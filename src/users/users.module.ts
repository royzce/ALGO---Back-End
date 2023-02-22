import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './controllers/users/users.controller';
import { userProfileProviders } from './providers/userProfile.providers';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...userProfileProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
