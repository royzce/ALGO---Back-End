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

  getDatePlusOneHour(): string {
    const currentDate = new Date();
    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);
    return oneHourLater.toISOString();
  }
  async forgotPassword(email: string) {
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

    const tokenInfo = {
      email: user.email,
      tokenValue: token,
      exp: this.getDatePlusOneHour(),
    };

    try {
      await this.mailerService.sendResetPasswordEmail(
        user.email,
        token,
        user.firstName,
      );
      await this.usersService.removePrevToken(user.email);
      await this.usersService.addResetTokenTodb(tokenInfo);

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

      // Check if user requested to change pwd, by looking it in db
      const isRequested = await this.usersService.checkIfResetPwdTokenIsInDB(
        token,
      );

      if (!isRequested) {
        throw new BadRequestException('Expired or Invalid Link');
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

        // Invalidate the token in the database, by removing in in the db
        await this.usersService.removeResetPwdToken(token);

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

  async changePassword(
    old_password: string,
    new_password: string,
    userId: number,
  ) {
    const user = await this.usersService.findUserById(userId);
    if (user && (await bcrypt.compare(old_password, user.password))) {
      const saltOrRounds = 10;
      user.password = await bcrypt.hash(new_password, saltOrRounds);
      return await this.usersService.updateUser(user);
    } else {
      throw new BadRequestException('Old password did not match.');
    }
  }
}
