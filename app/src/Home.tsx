import { useState } from "react";
import {
  useCurrentAccount,
  useSuiClient,
  useSuiClientContext,
  useSuiClientInfiniteQuery,
} from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import useOwnedObjects from "./hooks/useOwnedObjects";
import { getExplorerLink } from "@/lib/explorerUtils";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";

function Home() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const ctx = useSuiClientContext();
  const { toast } = useToast();

  const { allObjects, error, moduleObjects } = useOwnedObjects(account, client);

  if (!account) {
    return <h1 className="text-4xl mt-4">Please Connect Wallet</h1>;
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

  const createSplitwise = () => {
    console.log("createSplitwise");

    toast({
      title: `Created Splitwise`,
    });
  };

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
          <Button onClick={createSplitwise}>Create Splitwise</Button>
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
