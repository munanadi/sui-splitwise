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
} from "@mysten/dapp-kit";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const { data, isLoading, error } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address as string },
    { enabled: !!account }
  );

  const {
    data: balanceData,
    isLoading: balanceDataLoading,
    error: balanceDataError,
  } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address as string },
    { enabled: !!account }
  );

  const {
    data: coinBalancesData,
    isLoading: coinBalancesLoading,
    error: coinBalancesError,
  } = useSuiClientQuery(
    "getAllBalances",
    { owner: account?.address as string },
    { enabled: !!account }
  );

  async function getFunds() {
    if (!account?.address) {
      return;
    }

    const faucetHost = getFaucetHost("localnet");
    const result = await requestSuiFromFaucetV1({
      host: faucetHost,
      recipient: account.address,
      headers: [
        ["Access-Control-Allow-Origin", "*"],
        [
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept",
        ],
      ],
    });

    if (!result.task) {
      return;
    }

    const t = await getFaucetRequestStatus({
      host: faucetHost,
      taskId: result.task,
    });
    console.log(t.status, t.error);
  }

  return (
    <div className="container">
      <Button
        onClick={() => {
          create();
        }}
      >
        Create Counter
      </Button>

      {/* Faucet button */}
      <Button
        onClick={() => {
          getFunds();
        }}
      >
        Get Funds
      </Button>

      {account ? (
        <div className="flex flex-col">
          <p>Wallet connected</p>
          <p>Address: {account.address}</p>
        </div>
      ) : (
        <p>Wallet not connected</p>
      )}

      {/* Object owned by the connected wallet */}
      {error ? (
        <p>Something went wrong</p>
      ) : isLoading || !data ? (
        <p>Loading....</p>
      ) : (
        <div className="flex flex-col my-2">
          {data.data.length === 0 ? (
            <p>No objects owned by the connected wallet</p>
          ) : (
            <h3>Objects owned by the connected wallet</h3>
          )}
          {data.data.map((object) => (
            <div key={object.data?.objectId}>
              <p>Object ID: {object.data?.objectId}</p>
            </div>
          ))}
        </div>
      )}

      {/* Coin Balances */}
      {coinBalancesError ? (
        <p>Something went wrong</p>
      ) : coinBalancesLoading || !coinBalancesData ? (
        <p>Loading....</p>
      ) : (
        <div className="flex flex-col my-2">
          {coinBalancesData.length === 0 ? (
            <p>No objects owned by the connected wallet</p>
          ) : (
            <h3>Coin balances by the connected wallet</h3>
          )}
          {coinBalancesData.map((object) => (
            <div key={object?.coinType.toString()}>
              <p>Object ID: {object?.coinObjectCount}</p>
              <p>
                Locked Balance: {JSON.stringify(object.lockedBalance, null, 2)}
              </p>
              <p>Total Balance: {object?.totalBalance}</p>
            </div>
          ))}
        </div>
      )}

      {/* Balance */}
      {balanceDataError ? (
        <p>Something went wrong</p>
      ) : balanceDataLoading || !balanceData ? (
        <p>Loading....</p>
      ) : (
        <div className="flex flex-col my-2">
          {!balanceData ? (
            <p>No objects owned by the connected wallet</p>
          ) : (
            <h3>Balance by the connected wallet</h3>
          )}
          {
            <div key={balanceData?.coinType.toString()}>
              <p>Object ID: {balanceData?.coinObjectCount}</p>
              <p>
                Locked Balance:{" "}
                {JSON.stringify(balanceData.lockedBalance, null, 2)}
              </p>
              <p>Total Balance: {balanceData?.totalBalance}</p>
            </div>
          }
        </div>
      )}
    </div>
  );

  async function create() {
    if (!account?.address) {
      return;
    }

    const s = await client.getAllBalances({ owner: account.address });
    console.log(s);

    const txb = new TransactionBlock();

    txb.setSender(account.address);

    txb.setGasBudget(100000000);

    const coin = txb.splitCoins(txb.gas, [txb.pure(1)]);
    txb.transferObjects([coin], txb.pure(account.address));

    console.log(coin);

    txb.moveCall({
      arguments: [coin],
      // arguments: [],
      target: `${PACKAGE_ID}::counter::create`,
    });

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
                const objectId = tx.effects?.created?.[0]?.reference?.objectId;

                if (objectId) {
                  onCreated(objectId);
                }
              });
          },
        }
      );
    } catch (e) {
      console.log(e, "error message");
    }
  }
}
