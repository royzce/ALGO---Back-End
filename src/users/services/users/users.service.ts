import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findUser() {
    return {
      username: 'mark',
      email: 'mark@gmail.com',
      name: 'mark christian manzano',
      password: '12345678',
      photo: 'photo.jpeg',
    };
  }
}
