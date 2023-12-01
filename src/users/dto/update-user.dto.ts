import { Allow } from 'class-validator';

export class UpdateUserDto {
  @Allow()
  name?: string;
}
