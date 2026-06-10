import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/bcrypt/hashing.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingService: HashingService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async GetAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const responseUsers = users.map((user) => new ResponseUserDto(user));
    const totalPages = Math.ceil(total / limit);

    return {
      results: responseUsers,
      meta: {
        page,
        limit,
        total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (exists) {
      throw new BadRequestException('Email ja existe!');
    }

    const passwordHash = await this.hashingService.hash(createUserDto.password);
    createUserDto.password = passwordHash;
    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.role ? createUserDto.role : undefined,
    });
    await this.userRepository.save(user);
    const responseUser = new ResponseUserDto(user);
    return responseUser;
  }
}
