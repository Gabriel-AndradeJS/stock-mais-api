import { Budget } from 'src/budget/entities/budget.entity';
import { ResponseBudgetItemDto } from 'src/budget/dto/response-budget-item.dto';

export class ResponseBudgetItemsOnlyDto {
  name: string;
  totalAmount: number;
  items: ResponseBudgetItemDto[];

  constructor(budget: Budget) {
    this.name = budget.name;
    this.totalAmount = Number(budget.totalAmount ?? 0);
    this.items = (budget.items ?? []).map(
      (item) => new ResponseBudgetItemDto(item),
    );
  }
}
