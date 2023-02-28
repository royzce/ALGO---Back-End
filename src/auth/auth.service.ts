import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(loginDto: LoginDto, rememberMe: boolean) {
    const user = await this.usersService.findOne(loginDto.username);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const { password, ...result } = user;

      const payload = {
        sub: result.userId,
      };
      const expiresIn = rememberMe ? '7d' : '6h';
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn }),
      };
    }

    throw new BadRequestException('Invalid username or password');
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'This email address is not associated with any user.',
      );
    }
    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    try {
      await this.mailerService.sendResetPasswordEmail(
        user.email,
        token,
        user.firstName,
      );
      return true;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify the token using the JwtService
      const decodedToken = this.jwtService.verify(token, {
        ignoreExpiration: false,
      });
      const { email, exp } = decodedToken;
      // Check if the token is valid and not expired
      if (!email) {
        throw new BadRequestException('Invalid token');
      }

      // Check if token is in blacklist
      const isBlacklistedToken =
        await this.usersService.checkIfTokenIsInBlacklist(token);
      if (isBlacklistedToken) {
        throw new BadRequestException(
          'This link is already used to reset password.',
        );
      }
      // Find the user with the specified email
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (newPassword) {
        // Update the user's password in the database
        const saltOrRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltOrRounds);
        await this.usersService.updateUser(user);

        // Invalidate the token in the database
        // ...
        const tokenExpiration: string = new Date(exp * 1000).toISOString();
        const tokenInfo = {
          tokenValue: token,
          exp: tokenExpiration,
        };
        this.usersService.addTokenToBlacklist(tokenInfo);

        // Return a success response
        return { ResetPasswordResponse: 'Password reset successful' };
      } else {
        return true;
      }
    } catch (error) {
      // If the token is invalid or expired, return an error response
      throw new BadRequestException('Expired or invalid link');
    }
  }
}
