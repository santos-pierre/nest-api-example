import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { faker } from '@faker-js/faker';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(private usersService: UsersService) {}

  async seedUser(): Promise<void> {
    const userFake = {
      email: faker.helpers.unique(faker.internet.email),
      name: faker.name.fullName(),
      password: 'Test1234=',
    };

    const newUser = await this.usersService.create(userFake);
    await this.usersService.create(newUser);
  }
}
