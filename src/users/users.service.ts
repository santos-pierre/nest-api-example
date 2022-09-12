import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersService: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { email: ['Email Already Taken'] },
      });
    }
    const hashedPassword = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });
    const newUser = await this.usersService.save({
      ...createUserDto,
      password: hashedPassword,
    });
    return plainToInstance(UserEntity, newUser);
  }

  async findAll(): Promise<[UserEntity[], number]> {
    return await this.usersService.findAndCount();
  }

  async findOne(id: string): Promise<UserEntity> {
    return plainToInstance(
      UserEntity,
      await this.usersService.findOneBy({ id }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return plainToInstance(
      UserEntity,
      await this.usersService.save({ id, ...updateUserDto }),
    );
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.usersService.delete({ id });
  }

  private async findByEmailAndId(
    id: string,
    email: string,
  ): Promise<UserEntity> {
    return plainToInstance(
      UserEntity,
      await this.usersService
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .andWhere('user.email = :email', { email })
        .getOne(),
    );
  }

  async validateUser(loginDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.usersService.findOneBy({ email: loginDto.email });

    if (
      user &&
      (await argon2.verify(user.password, loginDto.password, {
        type: argon2.argon2id,
      }))
    ) {
      return plainToInstance(UserEntity, user);
    }

    throw new HttpException(
      'Credentials do not match our records',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
