import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alumno } from "./entities/Alumno.entity";
import { Empresa } from "./entities/Empresa.entity";
import { HistorialInscripcion } from "./entities/HistorialInscripcion.entity";
import { Inscripcion } from "./entities/Inscripcion.entity";
import { PerfilInfo } from "./entities/PerfilInfo.entity";
import { Programa } from "./entities/Programa.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alumno,
      Empresa,
      HistorialInscripcion,
      Inscripcion,
      PerfilInfo,
      Programa,
    ]),
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class CoreModule {}
