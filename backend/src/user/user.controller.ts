/* eslint-disable prettier/prettier */

import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';
import JwtUtil from 'src/utils/jwt.util';
import { AuthGuard } from 'src/guards/auth.guard';
import { ERole } from 'src/models/user.models';
import { RoleGuard } from 'src/guards/role.guard';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';


const schema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required(),
  role:Joi.string().valid('regular').valid('manager').required(),
  name: Joi.string().trim().min(2).max(30).required(),

});

const schemaRegister = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().trim().min(8).max(30).required(),
  name: Joi.string().trim().min(2).max(30).required(),

});

const schemaCreateId = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  name: Joi.string().trim().min(2).max(30).required(),
});

const tempSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required()})


@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}
  
  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get('pg/:pg')
  index(@Param('pg') pg): Promise<User[]> {
    if(Number(pg)<1)
    {
      throw new BadRequestException("page number cannot be less than 1");
    }
    return this.userService.findAll(pg);
  }  

 
  @UseGuards(AuthGuard)
  @Get('verify')
    async user(@Headers() headers) {
      // console.log('headers')

      console.log(headers)
      try{
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
      if(user){
          const {password, ...result} = user;

        return {result};
      }
    }catch(e){
      throw new UnauthorizedException();
    }
      
    }

  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get(':id')
  indexUser(@Param('id') id): Promise<User[] | string | User> {
    if(Number(id)<1)
    {
      throw new BadRequestException("page number cannot be less than 1");
    }
    return this.userService.find(id);
  } 

  @Post('register')
    async register(@Body() userData: User): Promise<any> {
      const {name,email,password} =userData;

      
      
      const result = schemaRegister.validate({name:name,email:email,password:password});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const hashedPassword= await bcrypt.hash(password,12)
      return this.userService.create({password:hashedPassword,name:userData.name.trim(),email:userData.email.trim().toLowerCase(),role:'regular'});
    }

    @Post('inviteFriend')
    async invite(@Body() userData: User,@Headers() header): Promise<any> {
      const {name,email} =userData;

      
      
      const result = schemaCreateId.validate({name:name,email:email});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const createdPassword=Math.random().toString(36).slice(2, 10)


      const hashedPassword= await bcrypt.hash(createdPassword,12)

      // console.log(header.origin)
      return this.userService.createFriend({password:hashedPassword,name:userData.name.trim(),email:userData.email.trim().toLowerCase(),role:'regular'},header.origin,createdPassword);
    }

    
    
    
    // @RoleGuard(ERole.A)
    // @UseGuards(AuthGuard)
    // @Delete(':id/delete')
    // async delete(@Param('id') id): Promise<any> {
    //   return this.userService.delete(id);
    // }  

    @Post('login')
    async userLogin(@Body() {email, password}:{email:string; password:string},
    @Res({passthrough:true}) response:Response)
    {
      const tempEmail=email.trim().toLowerCase();
      
      const result = tempSchema.validate({email:tempEmail,password:password})

        const user=await  this.userService.userLogin({tempEmail});
        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }
        if(!user || !await bcrypt.compare(password,user.password))
        {
            throw new BadRequestException('invalid credentials')
        }

        const token = JwtUtil.getJwtToken(user)
      
      return {
        ...user.toJSON(),
        jwt: token
      };

     }
}
