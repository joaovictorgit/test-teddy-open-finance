import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserResource {
  @ApiProperty()
  @IsNotEmpty({ message: 'Campo email é obrigatório' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Campo password é obrigatório' })
  password: string;
}