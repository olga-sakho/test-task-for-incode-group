import { Module, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
const cookieSession = require('cookie-session')

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database:'db.sqlite',
    entities: [User],
    synchronize: true
  }),
    UsersModule],
    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: APP_PIPE,
        useValue: new ValidationPipe({
          whitelist: true,
        }),
      },
    ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['rverver']
        })
      )
      .forRoutes('*')
  }
}
