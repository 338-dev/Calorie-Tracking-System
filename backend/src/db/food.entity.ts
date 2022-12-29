/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity()
export class Food
 {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    date: string;
    
    @Column({
        nullable: true,
    })
    calorie: string;

    @Column()
    price: string;

    @Column()
    addedBy: number;
}