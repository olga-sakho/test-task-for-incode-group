import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService
  ]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
