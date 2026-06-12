import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [JwtModule, BcryptModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
