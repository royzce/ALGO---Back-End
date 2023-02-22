import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { UsersService } from 'src/users/services/users/users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService, ...userProfileProviders],
  controllers: [AuthController],
})
export class AuthModule {}
