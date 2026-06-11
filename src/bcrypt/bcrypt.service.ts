import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/bcrypt/hashing.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
