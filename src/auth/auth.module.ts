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
import { UsersModule } from 'src/users/users.module';
import { interestProviders } from 'src/users/providers/interest.providers';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    ...userProfileProviders,
    ...interestProviders,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
