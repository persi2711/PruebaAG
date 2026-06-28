import { Module } from "@nestjs/common";
import { ApplicationModule } from "../Application/application.module";
import { SistemaAlumnosController } from "./controllers/sistema-alumnos.controller";

@Module({
  imports: [ApplicationModule],
  exports: [],
  providers: [],
  controllers: [SistemaAlumnosController],
})
export class ApiModule {}
