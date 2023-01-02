/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from '../db/food.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import { User } from 'src/db/user.entity';
import { max } from 'rxjs';


@Injectable()
export class foodService {
  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
) { }



async  findAll(userRole:any,userId:any,pg:any): Promise<Food[]|any> {
    const temp= await this.foodRepository.find({where:{addedBy:userId}});
    
    const sortedProducts = temp.sort(
      (p1, p2) => (new Date(p1.date) < new Date(p2.date)) ? 1 : (new Date(p1.date) > new Date(p2.date)) ? -1 : 0);

      console.log(sortedProducts)

      const set=new Set()

      sortedProducts.forEach((element)=>{
        set.add(new Date(new Date(element.date).toDateString()).getTime());
      })

      console.log(set)

      const tempFood=[];
      const new_arr=[...set]
      console.log(new_arr)
      console.log('new_arr')

      sortedProducts.forEach((element)=>{
        if(new_arr.length<5*pg)
        {
          if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[new_arr.length-1]))
          {
            tempFood.push(element)
          }
        }
        else if(new_arr.length>=5*pg)
        {
          if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[5*pg-1]))
          {
            tempFood.push(element)
          }
        }
      })

    console.log(tempFood)

    console.log('tempFood')
    const detailsByMonths={}
  tempFood.forEach(element=>{
    if(new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear() in detailsByMonths===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]={days:{},monthlyExpenses:0,expenseLimitReached:false}
    }
    if(new Date(element.date).getDate() in detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()].days===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()]={food:[],totalCalories:0,calorieLimitReached:false}
    }
    let calorieLimitReached;
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories+=Number(element.calorie);

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories>=2.10)
    {

      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].calorieLimitReached=true;
    }

    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].food.push(element)
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']+=Number(element.price)

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']>1.00)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['expenseLimitReached']=true
    }
  })
    console.log(detailsByMonths)
    // let max=0;
    // Object.keys(detailsByMonths).forEach(element => {
    //   detailsByMonths.element.days
    // });
    
    return detailsByMonths
}

async  findById(userId:any,pg:any): Promise<Food[]|any> {
  const temp= await this.foodRepository.find({where:{addedBy:userId}});
  
  const sortedProducts = temp.sort(
    (p1, p2) => (new Date(p1.date) < new Date(p2.date)) ? 1 : (new Date(p1.date) > new Date(p2.date)) ? -1 : 0);

    console.log(sortedProducts)

    const set=new Set()

    sortedProducts.forEach((element)=>{
      set.add(new Date(new Date(element.date).toDateString()).getTime());
    })

    console.log(set)

    const tempFood=[];
    const new_arr=[...set]
    console.log(new_arr)
    console.log('new_arr')

    sortedProducts.forEach((element)=>{
      if(new_arr.length<5*pg)
      {
        if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[new_arr.length-1]))
        {
          tempFood.push(element)
        }
      }
      else if(new_arr.length>=5*pg)
      {
        if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[5*pg-1]))
        {
          tempFood.push(element)
        }
      }
    })


  console.log('tempFood')
  const detailsByMonths={}
  tempFood.forEach(element=>{
    if(new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear() in detailsByMonths===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]={days:{},monthlyExpenses:0,expenseLimitReached:false}
    }
    if(new Date(element.date).getDate() in detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()].days===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()]={food:[],totalCalories:0,calorieLimitReached:false}
    }
    let calorieLimitReached;
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories+=Number(element.calorie);

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories>=2.10)
    {

      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].calorieLimitReached=true;
    }

    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].food.push(element)
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']+=Number(element.price)

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']>1.00)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['expenseLimitReached']=true
    }
  })
  console.log(detailsByMonths)
  return detailsByMonths
}

async  findReportById(userId:any): Promise<Food[]|any> {
  const tempFood= await this.foodRepository.find({where:{addedBy:userId}});
  console.log(tempFood)
    
    // let pastWeekEntry

  const dateLastWeek = new Date();
  const dateLastLastWeek = new Date();


  dateLastWeek.setDate(dateLastWeek.getDate() - 7);
  dateLastLastWeek.setDate(dateLastLastWeek.getDate() - 14);


  const now = new Date();
  const pastWeekEntry=[]
  const pastPastWeekEntry=[]
  let avgCalories=0;
  tempFood.forEach((val,key)=>{
    if(new Date(val.date)>new Date(dateLastWeek) && new Date(val.date)<=new Date(now))
    {
      pastWeekEntry.push(val)
      avgCalories+=Number(val.calorie)
    }
    if(new Date(val.date)>new Date(dateLastLastWeek) && new Date(val.date)<=new Date(dateLastWeek))
    {
      pastPastWeekEntry.push(val)
    }
  })

  return {pastWeekEntry:pastWeekEntry, pastPastWeekEntry:pastPastWeekEntry,avgCalories:avgCalories/pastWeekEntry.length}
//   let pastWeekEntry

//   const dateLastWeek = new Date();

//   dateLastWeek.setDate(dateLastWeek.getDate() - 7);

//   let now = new Date();
//   let daysOfYear = [];
//   for (let d = dateLastWeek; d <=now; d.setDate(d.getDate() + 1)) {
//     if(tempFood.date)

//     daysOfYear.push(new Date(d));
// }
}


async  findByDates(userRole:any,userId:any,dates:any,pg:any): Promise<Food[]|any> {
  const temp= await this.foodRepository.find({where:{addedBy:userId}});
  
  const sortedProducts = temp.sort(
    (p1, p2) => (new Date(p1.date) < new Date(p2.date)) ? 1 : (new Date(p1.date) > new Date(p2.date)) ? -1 : 0);

    console.log(sortedProducts)

    const set=new Set()

    sortedProducts.forEach((element)=>{
      set.add(new Date(new Date(element.date).toDateString()).getTime());
    })

    console.log(set)

    const tempFood=[];
    const new_arr=[...set]
    console.log(new_arr)
    console.log('new_arr')

    sortedProducts.forEach((element)=>{
      if(new_arr.length<5*pg)
      {
        if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[new_arr.length-1]))
        {
          tempFood.push(element)
        }
      }
      else if(new_arr.length>=5*pg)
      {
        if(new Date(new Date(element.date).toDateString()).getTime()<=Number(new_arr[5*(pg-1)]) && new Date(new Date(element.date).toDateString()).getTime()>=Number(new_arr[5*pg-1]))
        {
          tempFood.push(element)
        }
      }
    })

  console.log('tempFood')
  const detailsByMonths={}
  tempFood.forEach(element=>{

    if(new Date(element.date).getTime()<new Date(dates.startDate).getTime()-(3600*5+1800)*1000 || new Date(element.date).getTime()>new Date(dates.endDate).getTime()-(3600*5+1800)*1000+((3600*24)*1000))
    {
      return;
    }
    if(new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear() in detailsByMonths===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]={days:{},monthlyExpenses:0,expenseLimitReached:false}
    }
    if(new Date(element.date).getDate() in detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()].days===false)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()]={food:[],totalCalories:0,calorieLimitReached:false}
    }
    let calorieLimitReached;
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories+=Number(element.calorie);

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].totalCalories>=2.10)
    {

      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].calorieLimitReached=true;
    }

    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['days'][new Date(element.date).getDate()].food.push(element)
    
    detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']+=Number(element.price)

    if(detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['monthlyExpenses']>1.00)
    {
      detailsByMonths[new Date(element.date).toLocaleString('default', { month: 'long' })+" "+new Date(element.date).getFullYear()]['expenseLimitReached']=true
    }

  })
  console.log(detailsByMonths)
  return detailsByMonths
}

async  create(food: Food): Promise<any> {    
  console.log(food)
    return await this.foodRepository.save(food);
}

async update(bike: Food,id:any): Promise<UpdateResult> {

  const bike1:any = await this.foodRepository.findOne({where:{id}});

  console.log('bike')

  console.log(bike1)

  if(bike1===null)
  {
    console.log(bike1)
    throw new BadRequestException("Bike doesn't  exist")
  }
    return await this.foodRepository.update(bike.id, bike);
}


async delete(id: string | number|any| FindOptionsWhere<Food>): Promise<DeleteResult> {
  const bike:any = await this.foodRepository.findOne({where:{id}});

  console.log('bike')

  console.log(bike)

  if(bike===null)
  {
    console.log(bike)
    throw new BadRequestException("Bike doesn't  exist")
  }
    return await this.foodRepository.delete(id);
}

}