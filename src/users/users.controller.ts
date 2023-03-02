import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    NotFoundException,
    Session, 
    UseGuards,
    ForbiddenException
  } from '@nestjs/common';
import  { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User, UserRole } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guards';
import { SignInDto } from './dtos/signIn.dto';
import { UpdateUserDto } from './dtos/update-user.dto';



@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/all')
  @UseGuards(AuthGuard)
  async findAllUsers(@CurrentUser() user: User) {
    let usersForBoss = []
    if (user.role === UserRole.ADMIN) {
      return this.usersService.findAllForAdmin();
    } else if (user.role === UserRole.REGULAR) {
      return user
    } else if (user.role === UserRole.BOSS) {
      const users = await this.usersService.findAll(user.id);
      usersForBoss.push(user, users)
      return usersForBoss
    }
  }
 

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null
    
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SignInDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }


  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.usersService.remove(id);
    } else {
      throw new ForbiddenException('You cannot delete a user. You must be admin.')
      
    }
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto, @CurrentUser() user: User ) {
    const existBoss = await this.usersService.findOne(body.bossId);
    if (existBoss.role !== UserRole.REGULAR) {
      return this.usersService.update(id, user.id, body);
    } else {
      throw new ForbiddenException('User bossId must be a boss or admin.')
      
    }
    
  }
}