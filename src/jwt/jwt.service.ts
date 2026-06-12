import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { PayloadType } from 'src/common/types/payload.type';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async jwtSignAsync(payload: PayloadType): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async jwtVerifyAsync<T extends PayloadType>(token: string): Promise<T> {
    return await this.jwtService.verifyAsync<T>(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
