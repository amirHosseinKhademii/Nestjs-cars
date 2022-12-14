import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serializer } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serializer(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/who')
  who(@Session() session: any) {
    return this.userService.findOne(session.userId);
  }

  @Get('/whoAm')
  @UseGuards(AuthGuard)
  whoAm(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signinUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signoutUser(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  findUser(@Param() { id }: { id: string }) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param() { id }: { id: string }) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param() { id }: { id: string }, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
