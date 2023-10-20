import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  getFaucetHost,
  requestSuiFromFaucetV1,
  getFaucetRequestStatus,
} from "@mysten/sui.js/faucet";
import { Button } from "./components/ui/button";
import { PACKAGE_ID } from "./constants";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useCurrentAccount,
  useSuiClientQuery,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui.js/client";
import useOwnedObjects from "./hooks/useOwnedObjects";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const account = useCurrentAccount();

  const { allObjects, error, moduleObjects } = useOwnedObjects(account, client);

  // const { selectNetwork } = useSuiClientContext();
  // const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  console.log(moduleObjects);

  return (
    <div className="container overflow-auto">
      <Button
        onClick={() => {
          create();
        }}
      >
        Create Counter
      </Button>

      {account ? (
        <div className="flex flex-col">
          <p>Wallet connected</p>
          <p>Address: {account.address}</p>
          <p>Network: {account.chains}</p>
          <p>{JSON.stringify(allObjects, null, 2)}</p>
        </div>
      ) : (
        <p>Wallet not connected</p>
      )}
    </div>
  );

  async function create() {
    if (!account?.address) {
      return;
    }

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
  }
}
