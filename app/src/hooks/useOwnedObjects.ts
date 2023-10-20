import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useCurrentAccount,
  useSuiClientQuery,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import {
  SuiClient,
  SuiObjectResponse,
  SuiObjectData,
} from "@mysten/sui.js/client";
import { WalletAccount } from "@wallet-standard/base";
import { useEffect, useState } from "react";
import { PACKAGE_ID, PACKAGE_NAME } from "@/constants";

interface OwnedObjects {
  allObjects: SuiObjectResponse[];
  gasObjectIds: string[];
  moduleObjects: { [key: string]: SuiObjectData };
  error: boolean;
}

function useOwnedObjects(
  account: WalletAccount | null,
  client: SuiClient
): OwnedObjects {
  const [allObjects, setAllObjects] = useState<SuiObjectResponse[]>([]);
  const [moduleObjects, setModuleObjects] = useState<{
    [key: string]: SuiObjectData;
  }>({});
  const [gasObjectIds, setGasObjectIds] = useState<string[]>([]);

  const {
    data: allOwnedObjects,
    isLoading: allOwnedObjectsLoading,
    error: allOwnedObjectsError,
  } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address as string },
    { enabled: !!account }
  );

  const {
    data: allCoinObjects,
    isLoading: allCoinObjectsLoading,
    error: allCoinObjectsError,
  } = useSuiClientQuery(
    "getAllCoins",
    { owner: account?.address as string },
    { enabled: !!account }
  );

  useEffect(() => {
    async function fetchObjects() {
      if (allCoinObjects && allOwnedObjects) {
        // If all the fetches went okay to get all coins and objects
        const allCoinIds = allCoinObjects.data.map((obj) => obj.coinObjectId);

        const allObjectsWithoutGas = allOwnedObjects.data
          .filter(({ data }) => data?.objectId)
          .filter(({ data }) => !allCoinIds.includes(data?.objectId!));

        let allObjectIds = allObjectsWithoutGas
          .filter(({ data }) => data && data.objectId && data.objectId)
          .map(({ data }) => data!.objectId);
        allObjectIds.filter((o) => o !== undefined && o !== null);

        // Fetch the objects here
        const nogasOwnedObjectDetails = await client.multiGetObjects({
          ids: allObjectIds,
          options: {
            showContent: true,
            showType: true,
          },
        });

        const moduleRelatedObjects = nogasOwnedObjectDetails.filter(
          ({ data }) => data?.type?.includes(`${PACKAGE_ID}::${PACKAGE_NAME}`)
        );

        const moduleObjectsMap: { [key: string]: SuiObjectData } = {};

        moduleRelatedObjects.forEach(({ data }) => {
          const structName = data?.type?.split(
            `${PACKAGE_ID}::${PACKAGE_NAME}::`
          )[1]!;
          if (data) {
            moduleObjectsMap[structName] = data;
          }
        });

        setGasObjectIds(allCoinIds);
        setAllObjects(nogasOwnedObjectDetails);
        setModuleObjects(moduleObjectsMap);
      }
    }
    fetchObjects();
  }, [allCoinObjects, allOwnedObjects]);

  if (!account || !client) {
    return {
      error: true,
      allObjects: [],
      moduleObjects: {},
      gasObjectIds: [],
    };
  }

  return {
    allObjects,
    error: false,
    moduleObjects,
    gasObjectIds,
  };
}

export default useOwnedObjects;
