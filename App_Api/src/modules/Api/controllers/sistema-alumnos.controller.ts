import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { CreateAlumnoDto } from "../dtos/create-alumno.dto";
import { CambiarEstatusDto } from "../dtos/cambiar-estatus.dto";
import { SistemaAlumnosService } from "src/modules/Application/services/sistema-alumnos.service";

@ApiTags("Sistema de Alumnos (Prueba Técnica)")
@Controller("api/sistema-alumnos")
export class SistemaAlumnosController {
  constructor(private readonly sistemaService: SistemaAlumnosService) {}

  @Post("alumnos")
  @ApiOperation({
    summary: "Registrar un nuevo alumno",
    description:
      "Crea el perfil, vincula empresa y crea inscripción por defecto en una transacción.",
  })
  @ApiResponse({ status: 201, description: "Alumno registrado exitosamente." })
  @ApiResponse({
    status: 400,
    description: "Payload mal estructurado o IDs inválidos.",
  })
  async registrarAlumno(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.sistemaService.registrarAlumno(createAlumnoDto);
  }

  @Get("alumnos")
  @ApiOperation({
    summary: "Obtener catálogo de alumnos con filtros",
    description: "Retorna la lista unificada para la tabla del Front.",
  })
  @ApiQuery({
    name: "estatus",
    required: false,
    description: "Filtrar por estatus actual (ej. Activo, Inscrito...)",
  })
  @ApiQuery({
    name: "programaId",
    required: false,
    description: "Filtrar por ID del programa",
  })
  @ApiResponse({ status: 200, description: "Lista de alumnos obtenida." })
  async listarAlumnos(
    @Query("estatus") estatus?: string,
    @Query("programaId") programaId?: number,
  ) {
    return this.sistemaService.listarAlumnos({ estatus, programaId });
  }

  @Patch("alumnos/cambiar-estatus")
  @ApiOperation({
    summary: "Cambiar el estatus de un alumno en un programa",
    description:
      "Actualiza el estatus actual e inserta la bitácora en el historial.",
  })
  @ApiResponse({
    status: 200,
    description: "Estatus actualizado e historial registrado.",
  })
  @ApiResponse({
    status: 400,
    description: "El estatus enviado no es válido o no cumple los checks.",
  })
  async cambiarEstatus(@Body() cambiarEstatusDto: CambiarEstatusDto) {
    return this.sistemaService.cambiarEstatus(cambiarEstatusDto);
  }

  @Get("dashboard/resumen")
  @ApiOperation({
    summary: "Métricas de alumnos por estatus",
    description:
      "Retorna los contadores rápidos agrupados para las tarjetas de la UI.",
  })
  @ApiResponse({
    status: 200,
    description: "Contadores calculados de forma agregada.",
  })
  async obtenerMetricasDashboard() {
    return this.sistemaService.obtenerMetricasDashboard();
  }

  @Get("alumnos/:uuid/historial")
  @ApiOperation({
    summary: "Historial de cambios de estatus de un alumno",
    description:
      "Trae la línea de tiempo de estados utilizando el UUID público por seguridad.",
  })
  @ApiParam({ name: "uuid", description: "UUID público del alumno" })
  @ApiResponse({
    status: 200,
    description: "Historial cronológico recuperado.",
  })
  @ApiResponse({ status: 404, description: "Alumno no encontrado." })
  async obtenerHistorialAlumno(@Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.sistemaService.obtenerHistorialAlumno(uuid);
  }

  @Get("maestros/empresas")
  @ApiOperation({
    summary: "Listar empresas",
    description: "Para llenar el select del formulario de registro",
  })
  async listarEmpresas() {
    return this.sistemaService.listarEmpresas();
  }

  @Get("maestros/programas")
  @ApiOperation({
    summary: "Listar programas",
    description: "Para llenar el select del formulario de registro",
  })
  async listarProgramas() {
    return this.sistemaService.listarProgramas();
  }
}
