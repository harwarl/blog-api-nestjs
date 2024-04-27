import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUserResponse } from './types';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { UserD } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(@UserD() user: User): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @UserD('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user);
  }
}
