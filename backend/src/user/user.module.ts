/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { foodService } from 'src/food/food.service';
import { foodController } from 'src/food/food.controller';
import { Food } from 'src/db/food.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Food]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService,foodService],
  controllers: [UserController,foodController],
})
export class UserModule {}
