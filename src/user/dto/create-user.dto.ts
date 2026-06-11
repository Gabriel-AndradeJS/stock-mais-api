import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
  @IsOptional()
  @IsString({ message: 'A role deve ser uma string' })
  role: Role;
}
