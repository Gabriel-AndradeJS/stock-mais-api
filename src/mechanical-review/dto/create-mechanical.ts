import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { Type } from 'class-transformer';
import { ProductUsedDto } from 'src/mechanical-review/dto/product-used.dto';

export class CreateMechanicalDto {
  @IsOptional()
  description: string;

  @IsEnum(MechanicalStatus)
  status: MechanicalStatus;

  @IsString()
  titular: string;

  @IsString()
  placa: string;

  @IsString()
  mechanic: string;

  userId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUsedDto)
  productsUsed: ProductUsedDto[];
}
