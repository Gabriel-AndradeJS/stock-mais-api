import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMechanicalDto } from 'src/mechanical-review/dto/create-mechanical';

export class UpdateMechanicalDto extends PartialType(
  OmitType(CreateMechanicalDto, ['userId'] as const),
) {}
