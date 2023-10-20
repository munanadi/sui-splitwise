import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button } from "./components/ui/button";
import { PACKAGE_ID } from "./constants";

export function Counter({ id }: { id: string }) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const { data, isLoading, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const executeMoveCall = (method: "increment" | "reset") => {
    const txb = new TransactionBlock();

    if (method === "reset") {
      txb.moveCall({
        arguments: [txb.object(id), txb.pure.u64(0)],
        target: `${PACKAGE_ID}::counter::set_value`,
      });
    } else {
      txb.moveCall({
        arguments: [txb.object(id)],
        target: `${PACKAGE_ID}::counter::increment`,
      });
    }

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
          client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            refetch();
          });
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (!data.data) return <p>Not found</p>;

  console.log(currentAccount?.address);

  const ownedByCurrentAccount =
    getCounterFields(data.data)?.owner === currentAccount?.address;

  return (
    <>
      <h2>Counter {id}</h2>

      <div className="flex flex-col gap-2">
        <p>Count: {getCounterFields(data.data)?.value}</p>
        <div className="flex gap-2">
          <Button onClick={() => executeMoveCall("increment")}>
            Increment
          </Button>
          {ownedByCurrentAccount ? (
            <Button onClick={() => executeMoveCall("reset")}>Reset</Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { value: number; owner: string };
}
