import { IsInt, Min } from 'class-validator';

export class CreateBudgetItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
