import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsPositive,
} from "class-validator";

export class CreateAlumnoDto {
  @ApiProperty({
    example: "Emmanuel Antonio",
    description: "Nombres del alumno",
  })
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @ApiProperty({ example: "Rivera Lopez", description: "Apellidos del alumno" })
  @IsString()
  @IsNotEmpty()
  apellidos!: string;

  @ApiProperty({
    example: "https://ejemplo.com/foto.jpg",
    required: false,
    description: "URL de la foto de perfil",
  })
  @IsString()
  @IsOptional()
  urlImagenPerfil?: string;

  @ApiProperty({
    example: "6461234567",
    required: false,
    description: "Teléfono de contacto",
  })
  @IsPhoneNumber(undefined)
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    example: "Av. Universidad 123, Ensenada",
    required: false,
    description: "Dirección física",
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({ example: 1, description: "ID de la empresa asociada" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  empresaId!: number;

  @ApiProperty({ example: 2, description: "ID del programa académico inicial" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  programaId!: number;
}
