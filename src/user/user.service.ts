import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let newUser = new User();
    const saltOrRounds = 10;
    newUser.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    newUser = { ...createUserDto, ...newUser };
    return this.userRepository.save(newUser);
  }

  async findOne(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserById(id: number) {
    let user = await this.userRepository.findOneBy({ id });
    user.password = undefined;

    return user;
  }

  async getUserNameByEmail(email: string) {
    let user = await this.userRepository.findOneBy({ email });
    return user.username;
  }
}
