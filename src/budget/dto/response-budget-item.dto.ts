export class ResponseBudgetItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;

  constructor(item: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }) {
    this.productId = item.productId;
    this.productName = item.productName;
    this.quantity = item.quantity;
    this.unitPrice = item.unitPrice;
    this.subtotal = item.subtotal;
  }
}
