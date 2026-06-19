import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  productId: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
