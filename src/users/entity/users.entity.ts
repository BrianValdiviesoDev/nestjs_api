import { Types } from 'mongoose';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  PROFESSIONAL = 'PROFESSIONAL',
  REVIEWER = 'REVIEWER',
  GUEST = 'GUEST',
}
export interface UserEntity {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  rol: UserRole;
}
