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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { passwordResetTokenProviders } from 'src/users/providers/password-reset-token.providers';
import { friendProviders } from 'src/friends/providers/friend.provider';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ConfigModule.forRoot(),
    MailerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: configService.get<boolean>('app.rememberMe')
            ? '7d'
            : '6hr',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    MailerService,
    ...userProfileProviders,
    ...interestProviders,
    ...passwordResetTokenProviders,
    ...friendProviders,
  ],
  controllers: [AuthController],
})
export class AuthModule { }
