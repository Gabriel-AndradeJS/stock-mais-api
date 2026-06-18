import { IsInt, IsPositive } from 'class-validator';

export class ProductUsedDto {
  @IsInt()
  id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
