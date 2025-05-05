export enum AddressType {
  NFT = 'NFT',
  TOKEN = 'TOKEN',
}

export enum SubscriptionStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export type Subscription = {
  id: number;
  userId: number;
  addressType: AddressType;
  transactionType: string | null;
  address: string | null;
  webhookId: string | null;
  webhookUrl: string | null;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
};