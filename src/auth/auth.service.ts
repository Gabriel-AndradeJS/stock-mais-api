import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { HashingService } from 'src/bcrypt/hashing.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}
  async login(loginDto: LoginUserDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      return { message: 'Credenciais inválidas' };
    }

    const passwordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordValid) {
      return { message: 'Credenciais inválidas' };
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }
}
