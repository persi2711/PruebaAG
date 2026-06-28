import { Module } from "@nestjs/common";
import { CoreModule } from "../Core/core.module";
import { SistemaAlumnosService } from "./services/sistema-alumnos.service";

@Module({
  imports: [CoreModule],
  exports: [SistemaAlumnosService],
  providers: [SistemaAlumnosService],
})
export class ApplicationModule {}
