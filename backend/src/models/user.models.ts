/* eslint-disable prettier/prettier */

// Interfaces

export enum ERole {
  R = 'regular',
  A = 'admin'
}

export interface IUser{
  name: string;
  email: string;
  password: string;
  role:string;
  id: number;
}

