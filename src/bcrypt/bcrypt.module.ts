import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { BcryptService } from './bcrypt.service';

@Module({
  imports: [],
  exports: [HashingService],
  providers: [{ provide: HashingService, useClass: BcryptService }],
})
export class BcryptModule {}
