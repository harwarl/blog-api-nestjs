import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JWTSECRET } from 'src/config';
import { IUserResponse } from './types';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username is taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        password: true,
      },
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    delete user.password;
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWTSECRET,
      { expiresIn: '15m' },
    );
  }

  buildUserResponse(user: User): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
