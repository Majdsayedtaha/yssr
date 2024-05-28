export interface IBillExchange extends IBillExchangeTable {}
export interface IBillExchangeTable {
  id: string;
  exchangeNumber: number;
  date: string;
  sideTypeId: string;
  expenseTypeId: string;
  paymentDestinationId: string;
  amount: number;
  tax: number;
  description: string;
}
