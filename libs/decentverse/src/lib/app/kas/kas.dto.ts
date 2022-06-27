export interface TransactionForm {
  from: string;
  to: string;
  value: number;
  gas?: number;
  memo?: string;
  submit?: boolean;
}
export interface Signature {
  R: string;
  S: string;
  V: string;
}
export interface TransactionResult {
  from: string;
  gas: number;
  gasPrice: string; //hexString
  nonce: number;
  rlp: string;
  typeInt: number;
  input: string;
  signatures: Signature[];
  status: "Submitted" | "Committed" | "Pending" | "Commit Error";
  to: string;
  transactionHash: string;
  value: string; //hexstring
}
export interface TransactionReceipt extends TransactionResult {
  contractAddress: string | null;
  blockHash: string;
  blockNumber: string; // hexString
  gasUsed: string; //hexString
  hash: string;
  input: "0x" | string;
  logs: any[];
  logsBloom: string;
  senderTxHash: string;
  transactionIndex: string; //hexString
  type: "TxTypeLegacyTransaction" | string;
}
export interface WalletForm {
  contractAlias?: string;
  chainId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface TokenItem {
  createdAt: number;
  owner: string;
  previousOwner: string;
  tokenId: string;
  tokenUri: string;
  transactionHash: string;
  updatedAt: number;
}
export interface Token {
  owner: string;
  previousOwner: string;
  tokenId: number;
  url: string;
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TokenListResponse {
  items: TokenItem[];
  cursor: "";
}
export interface Transaction {
  transferType: "klay";
  from: string;
  fee: string; //hexstring
  status: 0 | 1;
  to: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  typeInt: number;
  timestamp: number;
  value: string; //hexstring
  feePayer: string;
  feeRatio: number;
}
export interface TransactionHistoryResponse {
  items: Transaction[];
  cursor: string;
}
export interface Nft {
  owner: string;
  previousOwner: string;
  tokenId: string; //hexString;
  tokenUri: string;
  transactionHash: string;
  createdAt: number;
  updatedAt: number;
}
export interface NftTransfer {
  transferType: "nft";
  transaction: any;
  contract: any;
  from: string;
  to: string;
  tokenId: string; //hexString
}
