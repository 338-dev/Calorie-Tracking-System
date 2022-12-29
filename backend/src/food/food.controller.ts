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
  date: Joi.date().max(new Date()).required(),
  calorie:Joi.number().min(.01).max(100).allow('').optional(),
  price:Joi.number().min(.02).max(10).required(),
});

const schemaDates = Joi.object({
  startDate: Joi.date().max(new Date()).required(),
  endDate: Joi.date().max(new Date()).required(),
});

@Controller('/food')
export class foodController {
  constructor(private readonly foodService: foodService, private jwtService: JwtService) {}
  
  @UseGuards(AuthGuard)
  @Get()
  async index(@Auth() auth,@Headers() headers): Promise<[]> {
    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
    return this.foodService.findAll(user.role,id);
  }  
  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get('/:id')
  async foodByUser(@Auth() auth,@Param('id') id,@Headers() headers): Promise<[]> {
    const token = headers.jwt;
      // const decoded:any = jwt.verify(token,'secret');
      // const id = decoded.id;
      // const user = await User.findOne({where: {id}});
    return this.foodService.findById(id);
  }  

  @UseGuards(AuthGuard)
  @Post('/filtered')
  async filter(@Auth() auth,@Headers() headers,@Body() dates): Promise<[]> {
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
      const user = await User.findOne({where: {id}});
    return this.foodService.findByDates(user.role,id,dates);
  }  
  // @UseGuards(AuthGuard)
  // @Get('page/:pg')
  // async indexPage(@Auth() auth,@Param('pg') pg,@Headers() headers) {
  //   const token = headers.jwt;
  //     const decoded:any = jwt.verify(token,'secret');
  //     const id = decoded.id;
  //     const user = await User.findOne({where: {id}});


  //     return this.bikesService.findPage(pg,user.role);
  // }

  // @UseGuards(AuthGuard)
  // @Get(':id')
  // indexUser(@Auth() auth,@Param('id') id): Promise<Bikes[] | string | Bikes> {
  //   return this.bikesService.find(id);
  // } 

  // @RoleGuard(ERole.M)
  @UseGuards(AuthGuard)
  @Post('create')
    async create(@Body() foodData: Food,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;

      const result = schema.validate(foodData);
      foodData={...foodData,name:foodData.name.trim(),date:new Date(foodData.date).toString()}

      console.log(foodData)
      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }
      return this.foodService.create({...foodData,addedBy:userId});
    }

    

    // @UseGuards(AuthGuard)
    // @Post('filter/:pg')
    // async filter(@Param('pg') pg,@Body() filterData,@Headers() headers): Promise<any> {

    //   const token = headers.jwt;
    //   const decoded:any = jwt.verify(token,'secret');
    //   const id = decoded.id;
    //   const user = await User.findOne({where: {id}});
      
    //   console.log('applied')
    //   console.log(user.role)

    //   if('model' in filterData ===false && 'city' in filterData===false && 'color' in filterData===false && 'minRating' in filterData===false && 'startDate' in filterData===false && 'endDate' in filterData===false)
    //   {
    //     throw new BadRequestException('enter valid filters') 
    //   }

    //   if(('startDate' in filterData && 'endDate' in filterData==false) || ('startDate' in filterData ===false && 'endDate' in filterData))
    //   {
    //     throw new BadRequestException('enter valid filters') 
    //   }

    //   return this.bikesService.filter(filterData,pg,user.role);
    // }
    // @RoleGuard(ERole.M)
    // @UseGuards(AuthGuard)
    // @Put(':id/updateDetails')
    // async updateDetails(@Param('id') id, @Body() bikesData: Bikes): Promise<any> {
    //     bikesData.id = Number(id);
    //     console.log('Update #' + bikesData.id)

    //     if('model' in bikesData===false && 'color' in bikesData===false && 'city' in bikesData===false)
    //     {
    //       throw new BadRequestException('Enter valid details')
    //     }
    //     return this.bikesService.update(bikesData,id);
    // }

//     @UseGuards(AuthGuard)
//     @Put(':id/updateReserve')
//     async updateReserve(@Param('id') id,@Body() dates:any,@Headers() headers): Promise<any> {
//       const token = headers.jwt;
//       const decoded:any = jwt.verify(token,'secret');
//       const userId = decoded.id;
//       console.log('dates')
//         console.log(dates)
//         // bikesData.id = Number(id);
//         // console.log('Update #' + bikesData.id)

//         if('reservedFrom' in dates===false || 'reservedUntil' in dates===false)
//         {console.log('12')
//         console.log(dates)
//           throw new BadRequestException('Enter valid reservation details')
//         }
//         else   if(new Date(dates.reservedFrom).getTime()>new Date(dates.reservedUntil).getTime() || new Date(dates.reservedFrom).getTime()<new Date(new Date().toDateString()).getTime() || new Date(dates.reservedUntil).getTime()<new Date(new Date().toDateString()).getTime() || isNaN(new Date(dates.reservedFrom).getTime()) || isNaN(new Date(dates.reservedUntil).getTime()))
//         {console.log('23')
//         console.log(dates)
//           throw new BadRequestException('enter valid date') 
          
//         }
//         console.log('kj')
//         console.log(dates)
//         return this.bikesService.updateReservation(dates,id,userId);
//     }

//     @UseGuards(AuthGuard)
//     @Put(':id/cancelReserve')
//     async cancelReserve(@Param('id') id,@Body() dates:any,@Headers() headers): Promise<any> {
//       const token = headers.jwt;
//       const decoded:any = jwt.verify(token,'secret');
//       const userId = decoded.id;
      
//         // bikesData.id = Number(id);
//         console.log('Update #')
// console.log(dates)
//         if('reservedFrom' in dates===false || 'reservedUntil' in dates===false)
//         {
//           throw new BadRequestException('Enter valid reservation details')
//         }
//         else   if(new Date(dates.reservedFrom).getTime()>new Date(dates.reservedUntil).getTime() || new Date(dates.reservedFrom).getTime()<new Date(new Date().toDateString()).getTime() || new Date(dates.reservedUntil).getTime()<new Date(new Date().toDateString()).getTime() || isNaN(new Date(dates.reservedFrom).getTime()) || isNaN(new Date(dates.reservedUntil).getTime()))
//         {
//           throw new BadRequestException('enter valid date') 
          
//         }

//         console.log('cancel')
//         console.log(dates)
//         console.log(id)
//         console.log(userId)


//         return this.bikesService.cancelReservation(dates,id,userId);
//     }

//     @UseGuards(AuthGuard)
//     @Put(':id/updateRate')
//     async updateRate(@Param('id') id, @Body() ratingOrReview:any,@Headers() headers): Promise<any> {
//       const token = headers.jwt;
//       const decoded:any = jwt.verify(token,'secret');
//       const userId = decoded.id;

//         if('rate' in ratingOrReview===false && 'review' in ratingOrReview===false )
//         {
//           throw new BadRequestException('Enter valid ratings')
//         }
        
//         return this.bikesService.rating(ratingOrReview,id,userId);
//     }



//     @RoleGuard(ERole.M)
//     @UseGuards(AuthGuard)
//     @Put(':id/updateAvailable')
//     async updateAvailable(@Param('id') id, @Body() bikesData: Bikes): Promise<any> {
//         bikesData.id = Number(id);
//         console.log('Update #' + bikesData.id)

//         if('isAvailable' in bikesData===false)
//         {
//           throw new BadRequestException('Enter valid Availablity status')
//         }
//         else if(bikesData.isAvailable!==true && bikesData.isAvailable!==false)
//         {
//           throw new BadRequestException('Enter valid Availablity status')
//         }
//         return this.bikesService.update(bikesData,id);
//     }
    // @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
     
      return this.foodService.delete(id);
    }  

}