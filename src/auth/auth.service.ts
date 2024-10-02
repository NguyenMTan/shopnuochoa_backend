import { UserRepository } from './../user/user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPayloadDto } from './dto/token.payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async generateToken(login: LoginDto) {
    const { email, password } = login;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    if (user.status === false) {
      throw new UnauthorizedException('Tài khoản đã bị khoá');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    const body: TokenPayloadDto = {
      _id: user._id.toHexString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return this.jwtService.signAsync(body);
  }
}
