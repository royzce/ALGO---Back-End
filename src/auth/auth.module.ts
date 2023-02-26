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
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { blacklistedTokensProviders } from 'src/users/providers/blacklistedToken.providers';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ConfigModule.forRoot(),
    MailerModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    MailerService,
    ...userProfileProviders,
    ...interestProviders,
    ...blacklistedTokensProviders,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
