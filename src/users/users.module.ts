import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './controllers/users/users.controller';
import { userProfileProviders } from './providers/userProfile.providers';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100d' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    ...userProfileProviders,
    UsersService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
