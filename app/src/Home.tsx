import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function Home() {
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return <h1 className="text-4xl mt-4">Please Connect Wallet</h1>;
  }

  return (
    <>
      <div className="flex dark:bg-black justify-center">
        <div className="w-1/2 dark:bg-black p-6 mx-2">
          <Card className="dark:bg-black">
            <CardHeader>
              <CardTitle className="text-black text-5xl">
                Account Receivable
              </CardTitle>
            </CardHeader>
            <CardContent className="text-black text-3xl">$42</CardContent>
          </Card>
        </div>
        <div className="w-1/2 dark:bg-black p-6 mx-2">
          <Card className="dark:bg-black">
            <CardHeader>
              <CardTitle className="text-black text-5xl">
                Accounts Payable
              </CardTitle>
            </CardHeader>
            <CardContent className="text-black text-3xl">$100</CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-5 pt-2 px-4 min-h-[500px]">
        {currentAccount ? (
          counterId ? (
            <Counter id={counterId} />
          ) : (
            <CreateCounter
              onCreated={(id) => {
                window.location.hash = id;
                setCounter(id);
              }}
            />
          )
        ) : (
          <h3>Please connect your wallet</h3>
        )}
      </div>
    </>
  );
}

export default Home;
