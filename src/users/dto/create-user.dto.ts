import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../entity/users.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  rol: UserRole;
}
