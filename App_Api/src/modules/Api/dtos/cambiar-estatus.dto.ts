import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

const ESTATUS_VALIDOS = [
  "Activo",
  "Baja de empresa",
  "Baja del programa",
  "Inscrito",
  "Suspendido",
  "Reingreso",
  "Egresado",
];

export class CambiarEstatusDto {
  @ApiProperty({ example: 1, description: "ID interno del alumno" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  alumnoId!: number;

  @ApiProperty({ example: 2, description: "ID del programa relacionado" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  programaId!: number;

  @ApiProperty({
    example: "Activo",
    enum: ESTATUS_VALIDOS,
    description:
      "Nuevo estatus regulado por los CONSTRAINTs de la base de datos",
  })
  @IsIn(ESTATUS_VALIDOS, {
    message: "El estatus proporcionado no es un estado oficial válido.",
  })
  @IsNotEmpty()
  nuevoEstatus!: string;

  @ApiProperty({
    example: "El alumno completó la documentación de ingreso",
    required: false,
    description: "Motivo del cambio",
  })
  @IsString()
  @IsOptional()
  motivo?: string;
}
