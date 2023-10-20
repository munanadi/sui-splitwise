import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useSuiClientContext,
  useSuiClientInfiniteQuery,
} from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import useOwnedObjects from "./hooks/useOwnedObjects";
import { getExplorerLink } from "@/lib/explorerUtils";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ID } from "./constants";
import Dashboard from "./Dashboard";
import { Input } from "./components/ui/input";

function Home() {
  const [groupAdd, setGroupAdd] = useState<string>("");

  const client = useSuiClient();
  const account = useCurrentAccount();
  const ctx = useSuiClientContext();
  const { toast } = useToast();

  const { allObjects, error, moduleObjects } = useOwnedObjects(account, client);
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  if (!account) {
    return <h1 className="text-4xl mt-4 h-[500px]">Please Connect Wallet</h1>;
  }

  const isSplitwisePresent = Object.keys(moduleObjects).includes("Splitwise");
  const splitwiseDetails = isSplitwisePresent
    ? moduleObjects["Splitwise"]
    : null;

  const isAdminCapPresent =
    Object.keys(moduleObjects).includes("AdminCapability");
  const AdminCapDetails =
    isSplitwisePresent && moduleObjects["AdminCapability"];

  // console.log(splitwiseDetails);

  const handleGroupAddInput = (e: React.FormEvent<HTMLInputElement>) => {
    setGroupAdd(e.currentTarget.value);
  };

  const joinGroup = async () => {
    // Throw error for no address
    if (groupAdd.length == 0 || !account.address) {
      return;
    }

    // Check if your wallet is already a part of the group.
    const data = await client.getObject({
      id: groupAdd,
      options: { showContent: true, showOwner: true },
    });

    if (!data.data?.content || !data.data.objectId || !data.data.version) {
      // throw error
      console.log("Error fetching data");
      toast({
        title: `Something went wrong fetching shared object`,
      });
      return;
    }

    let addressFound = false;
    if (data) {
      const addressList = (data?.data?.content as any)?.fields
        .entity_addresses as string[];
      addressFound = addressList.includes(account.address);
      console.log(addressList, groupAdd)
      console.log({addressFound})
      if (addressFound) {
        toast({
          title: `You're already in this group!`,
        });
        return;
      }
    }

    // Not in group. Make the contract call to get added into this group
    const txb = new TransactionBlock();
    txb.setSenderIfNotSet(account.address);
    txb.setGasBudget(100000000);
    
    const coin = txb.splitCoins(txb.gas, [txb.pure(1)]);
    
    const splitwiseSharedObject = txb.sharedObjectRef({
      mutable: true,
      initialSharedVersion: data?.data?.version,
      objectId: data?.data?.objectId,
    });
    
    txb.transferObjects([coin, splitwiseSharedObject], account.address);

    txb.moveCall({
      target: `${PACKAGE_ID}::group::add_new_entites`,
      arguments: [splitwiseSharedObject, txb.pure.address(account.address)],
      typeArguments: [],
    });

    // console.log(splitwiseSharedObject)
    console.log(txb.blockData)

    try {
      signAndExecute(
        {
          transactionBlock: txb,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        },
        {
          onSuccess: (tx) => {
            client
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then(() => {
                console.log(tx);

                toast({
                  title: `Added you to this group`,
                });
              });
          },
        }
      );
    } catch (e) {
      console.log(e, "error message");
      toast({
        title: `Something went wrong while adding you in`,
      });
    }
  };

  const createGroup = () => {
    // const txb = new TransactionBlock();
    // txb.setSender(account.address);
    // txb.setGasBudget(100000000);

    // const coin = txb.splitCoins(txb.gas, [txb.pure(10000)]);
    // txb.transferObjects([coin], txb.pure(account.address));

    // txb.moveCall({
    //   arguments: [coin],
    //   // arguments: [],
    //   target: `${PACKAGE_ID}::entity::create_entity`,
    // });

    // try {
    //   signAndExecute(
    //     {
    //       transactionBlock: txb,
    //       options: {
    //         showEffects: true,
    //         showObjectChanges: true,
    //       },
    //     },
    //     {
    //       onSuccess: (tx) => {
    //         client
    //           .waitForTransactionBlock({
    //             digest: tx.digest,
    //           })
    //           .then(() => {
    //             console.log(tx);
    //             const objectId = tx.effects?.created?.[0]?.reference?.objectId;

    //             if (objectId) {
    //               onCreated(objectId);
    //             }
    //           });
    //       },
    //     }
    //   );
    // } catch (e) {
    //   console.log(e, "error message");
    // }

    toast({
      title: `Created a new group!`,
    });
  };

  return (
    <>
      {/* <Dashboard /> */}

      <div className="flex flex-col gap-4 mt-5 px-4 min-h-[500px] text-white">
        {isSplitwisePresent ? (
          splitwiseDetails && splitwiseDetails.objectId ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p>Splitwise Structure : {splitwiseDetails.objectId}</p>
                <Button>
                  <a
                    target="_blank"
                    href={getExplorerLink.object(
                      splitwiseDetails.objectId,
                      "local"
                    )}
                  >
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <p>Error Fetching details</p>
          )
        ) : (
          <div className="h-[500px] flex flex-col gap-10">
            <div className="space-y-2">
              <div>You can either create a new expenses group</div>
              <Button onClick={createGroup}>Create a New Group</Button>
            </div>
            <hr />
            <div className="space-y-2 mx-auto">
              <div>Or join a pre-existing group</div>
              <Input
                placeholder="Enter group address here"
                className="text-black"
                onInput={handleGroupAddInput}
              />
              <Button onClick={joinGroup}>Join a Existing Group</Button>
            </div>
          </div>
        )}

        {isAdminCapPresent && AdminCapDetails && AdminCapDetails.objectId ? (
          <div className="flex items-center gap-2">
            <p>AdminCap Structure : {AdminCapDetails.objectId}</p>
            <Button>
              <a
                target="_blank"
                href={getExplorerLink.object(AdminCapDetails.objectId, "local")}
              >
                Visit
              </a>
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Home;
