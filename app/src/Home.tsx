import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";

function Home() {
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  const currentAccount = useCurrentAccount();

  return (
    <>
      <div>
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
      </div>
    </>
  );
}

export default Home;
