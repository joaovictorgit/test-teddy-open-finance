import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UrlResource {
  @ApiProperty()
  @IsNotEmpty({ message: 'O link da url é obrigatório' })
  originalUrl: string;
}

export class ShortCodeResource {
  @ApiProperty()
  @IsNotEmpty({ message: 'Informe o código da url' })
  shortCode: string;
}