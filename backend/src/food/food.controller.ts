/* eslint-disable prettier/prettier */

import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { foodService } from './food.service';
import { Food } from '../db/food.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth } from 'src/utils/auth.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from 'src/models/user.models';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/db/user.entity';
import * as Joi from 'joi';


const schema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  calorie:Joi.number().min(.01).max(100).allow('').optional(),
  price:Joi.number().min(.02).max(10).required(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().trim().min(3).max(30),
  calorie:Joi.number().min(.01).max(100).allow('').optional(),
  price:Joi.number().min(.02).max(10),
});

const schemaDates = Joi.object({
  startDate: Joi.date().max(new Date()).required(),
  endDate: Joi.date().max(new Date()).required(),
});

@Controller('/food')
export class foodController {
  constructor(private readonly foodService: foodService, private jwtService: JwtService) {}
  
  @UseGuards(AuthGuard)
  @Get('pg/:pg')
  async index(@Auth() auth,@Headers() headers,@Param('pg') pg): Promise<[]> {

    if(Number(pg)<1)
    {
      throw new BadRequestException("Page cannot be negative")
    }
    else if(isNaN(pg))
    {
      throw new BadRequestException("Page value should be a number")
    }
    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
    return this.foodService.findAll(user.role,id,pg);
  }  


  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get('/:id/pg/:pg')
  async foodByUser(@Auth() auth,@Param('id') id,@Param('pg') pg,@Headers() headers): Promise<[]> {

    if(Number(pg)<1 || Number(id)<1)
    {
      throw new BadRequestException("Page or Id cannot be negative")
    }
    else if(isNaN(pg) || isNaN(id))
    {
      throw new BadRequestException("Page or Id value should be a number")
    }

    const user = await User.findOne({where: {id}});
    console.log('user')
    console.log(user)

    if(user===null || !user)
    {
      throw new BadRequestException("No user with given id")

    }

    return this.foodService.findById(id,pg);
  }  

  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get('stats/:id')
  async reportByUser(@Auth() auth,@Param('id') id,@Headers() headers): Promise<[]> {

    if(Number(id)<1)
    {
      throw new BadRequestException("Page cannot be negative")
    }
    else if(isNaN(id))
    {
      throw new BadRequestException("Page value should be a number")
    }
    const user = await User.findOne({where: {id}});
    console.log('user')
    console.log(user)

    if(user===null || !user)
    {
      throw new BadRequestException("No user with given id")

    }


    return this.foodService.findReportById(id);
  }  

  @UseGuards(AuthGuard)
  @Post('/filtered/pg/:pg')
  async filter(@Auth() auth,@Headers() headers,@Body() dates,@Param('pg') pg): Promise<[]> {
    if(Number(pg)<1)
    {
      throw new BadRequestException("Page cannot be negative")
    }
    else if(isNaN(pg))
    {
      throw new BadRequestException("Page value should be a number")
    }
    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;

      const result = schemaDates.validate(dates);

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }else if(new Date(dates.startDate).getTime()>new Date(dates.endDate).getTime())
      {
        throw new BadRequestException('start date cannot be greater than end date')

      }
      console.log(1234)
      console.log(dates)
      const user = await User.findOne({where: {id}});
    return this.foodService.findByDates(user.role,id,dates,pg);
  }  

  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Put(':id/update')
  async updateDetails(@Param('id') id, @Body() foodData: Food,@Headers() headers): Promise<any> {

    if(Number(id)<1)
    {
      throw new BadRequestException("Page cannot be negative")
    }
    else if(isNaN(id))
    {
      throw new BadRequestException("Page value should be a number")
    }
    // const token = headers.jwt;
    // const decoded:any = jwt.verify(token,'secret');
    // const userId = decoded.id;

    // if(foodData.e)

    const result = schemaUpdate.validate(foodData);
    foodData={...foodData,name:foodData.name.trim()}

    console.log(foodData)
    const { error } = result;
    if(error)
    {
      throw new BadRequestException(result.error.message)
    }

      return this.foodService.update(foodData,id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
    async create(@Body() foodData: Food,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;

      if(new Date(foodData.date).getTime()>new Date().getTime())
      {
        throw new BadRequestException("Invalid date")
      }
      const result = schema.validate({name:foodData.name,price:foodData.price,calorie:foodData.calorie});
      foodData={...foodData,name:foodData.name.trim(),date:new Date(foodData.date).toString()}

      console.log(foodData)
      const { error } = result;
      if(error)
      {
        console.log(error)
        throw new BadRequestException(result.error.message)
      }
      return this.foodService.create({...foodData,addedBy:userId});
    }

    
    @RoleGuard(ERole.A)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
    
      return this.foodService.delete(id);
    }

}