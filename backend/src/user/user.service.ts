/* eslint-disable prettier/prettier */

import { HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import Joi from 'joi';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
) { }



async  findAll(pg:any): Promise<any> {
    const users=await this.userRepository.find();

    const totalPages=Math.ceil(users.length/6);

    return [users.splice((pg-1)*6,6),totalPages]
}

async  find(id: any): Promise<User[] | User | string> {
  const user= await this.userRepository.find();
  for(const iter of user)
    {
      if(iter.id==id)
      { 
          return iter
      }
    }
    return 'no user found'
 
}

async  create(user: User | any): Promise<User> {
  
    const allUser= await this.userRepository.find();
    for(const iter of allUser)
    {
        if(iter.email===user.email)
        { 
            throw new HttpException('Email already exists, try something different',400) 
        }
    }
    
    return await this.userRepository.save(user);
}

async  createFriend(user: User | any,url,password): Promise<any> {
  
  const allUser= await this.userRepository.find();
  for(const iter of allUser)
  {
      if(iter.email===user.email)
      { 
          throw new HttpException('Email already exists, try something different',400) 
      }
  }
  // console.log(url+"/inviteFriend/email:"+user.email+"|"+"password:"+password)
  const res=await this.userRepository.save(user);

  return {res:res,link:url+"/inviteFriend/email:"+user.email+"-"+"password:"+password}
}

// async update(user: User): Promise<UpdateResult>{
//   if(user.email!==undefined)
//   {
//     const allUser= await this.userRepository.find();
//     for(const iter of allUser)
//     {
//         if(iter.email===user.email)
//         { 
//             throw new HttpException('Email already exists, try something different',400) 
//         }
//     }
//   }
//     return await this.userRepository.update(user.id, user);
// }

// async delete(id: string | number| FindOptionsWhere<User>): Promise<DeleteResult> {
//     return await this.userRepository.delete(id);
// }
 
async userLogin({ tempEmail}:{ tempEmail: string;}):Promise<User> {
  const user= await this.userRepository.findOne({where: {email:tempEmail}});

  if(!user)
  {
     throw new HttpException('invalid credetials',400)
  }
  else {
    return user
  }
  
}

async findOne(condition: any): Promise<User> {
  return this.userRepository.findOne({where: {id:condition}});
}
}
  