export const getExplorerLink = {
  object: (objectId: string, network?: string) => {
    return `https://suiexplorer.com/object/${objectId}?network=${
      network ?? "devnet"
    }`;
  },
  address: (address: string, network?: string) => {
    return `https://suiexplorer.com/address/${address}?network=${
      network ?? "devnet"
    }`;
  },
};
