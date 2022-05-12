import client from "../apollo";
import gql from "graphql-tag";

export type MintTicketFragment = {
  _id: string;
  address: string;
  saleType: string;
  toAddr: string;
  mintNum: number;
  amount: number;
  processedNum: number;
  tokenIds: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mintTicketFragment = gql`
  fragment mintTicketFragment on MintTicket {
    _id
    address
    saleType
    toAddr
    mintNum
    amount
    processedNum
    tokenIds
    status
    createdAt
    updatedAt
  }
`;
