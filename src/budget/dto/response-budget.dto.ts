import { Budget } from 'src/budget/entities/budget.entity';
import { ResponseBudgetItemDto } from 'src/budget/dto/response-budget-item.dto';
import { ResponseProductDto } from 'src/product/dto/response-product.dto';

export class ResponseBudgetDto {
  id: number;
  name: string;
  products: ResponseProductDto[];
  items: ResponseBudgetItemDto[];
  quantityProducts: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(budget: Budget) {
    this.id = budget.id;
    this.name = budget.name;
    this.products = (budget.products ?? []).map(
      (product) => new ResponseProductDto(product),
    );
    this.items = (budget.items ?? []).map(
      (item) => new ResponseBudgetItemDto(item),
    );
    this.quantityProducts = budget.quantityProducts ?? 0;
    this.totalAmount = Number(budget.totalAmount ?? 0);
    this.createdAt = budget.createdAt;
    this.updatedAt = budget.updatedAt;
  }
}
