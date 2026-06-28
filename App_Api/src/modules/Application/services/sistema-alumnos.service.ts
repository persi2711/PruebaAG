import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CambiarEstatusDto } from "src/modules/Api/dtos/cambiar-estatus.dto";
import { CreateAlumnoDto } from "src/modules/Api/dtos/create-alumno.dto";
import { Alumno } from "src/modules/Core/entities/Alumno.entity";
import { Empresa } from "src/modules/Core/entities/Empresa.entity";
import { HistorialInscripcion } from "src/modules/Core/entities/HistorialInscripcion.entity";
import { Inscripcion } from "src/modules/Core/entities/Inscripcion.entity";
import { PerfilInfo } from "src/modules/Core/entities/PerfilInfo.entity";
import { Programa } from "src/modules/Core/entities/Programa.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class SistemaAlumnosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(HistorialInscripcion)
    private readonly historialRepository: Repository<HistorialInscripcion>,
  ) {}

  async registrarAlumno(createAlumnoDto: CreateAlumnoDto) {
    const {
      nombres,
      apellidos,
      telefono,
      direccion,
      urlImagenPerfil,
      empresaId,
      programaId,
    } = createAlumnoDto;

    const empresa = await this.empresaRepository.findOneBy({ id: empresaId });
    if (!empresa)
      throw new NotFoundException(`La empresa con ID ${empresaId} no existe.`);

    const programa = await this.programaRepository.findOneBy({
      id: programaId,
    });
    if (!programa)
      throw new NotFoundException(
        `El programa con ID ${programaId} no existe.`,
      );

    return await this.dataSource.transaction(async (manager) => {
      const nuevoPerfil = manager.create(PerfilInfo, {
        nombres,
        apellidos,
        telefono,
        direccion,
        urlImagenPerfil,
      });
      const perfilGuardado = await manager.save(PerfilInfo, nuevoPerfil);

      const nuevoAlumno = manager.create(Alumno, {
        perfilInfo: perfilGuardado,
        empresa: empresa,
      });
      const alumnoGuardado = await manager.save(Alumno, nuevoAlumno);

      const nuevaInscripcion = manager.create(Inscripcion, {
        alumno: alumnoGuardado,
        programa: programa,
        estatusActual: "Inscrito",
      });
      await manager.save(Inscripcion, nuevaInscripcion);

      const historialInicial = manager.create(HistorialInscripcion, {
        alumnoId: alumnoGuardado.id,
        programaId: programa.id,
        estatusAnterior: undefined,
        estatusNuevo: "Inscrito",
        motivo: "Registro inicial del alumno en el sistema.",
      });

      await manager.save(HistorialInscripcion, historialInicial);

      return {
        message:
          "Alumno registrado exitosamente en el sistema con su historial inicial.",
        alumnoId: alumnoGuardado.id,
        uuidPublico: alumnoGuardado.uuidPublico,
      };
    });
  }

  async listarAlumnos(filtros: { estatus?: string; programaId?: number }) {
    const query = this.alumnoRepository
      .createQueryBuilder("alumno")
      .leftJoinAndSelect("alumno.perfilInfo", "perfilInfo")
      .leftJoinAndSelect("alumno.empresa", "empresa")
      .leftJoinAndSelect("alumno.inscripciones", "inscripcion")
      .leftJoinAndSelect("inscripcion.programa", "programa");

    if (filtros.estatus) {
      query.andWhere("inscripcion.estatusActual = :estatus", {
        estatus: filtros.estatus,
      });
    }

    if (filtros.programaId) {
      query.andWhere("programa.id = :programaId", {
        programaId: filtros.programaId,
      });
    }

    query.orderBy("alumno.createdAt", "DESC");

    return await query.getMany();
  }

  async cambiarEstatus(cambiarEstatusDto: CambiarEstatusDto) {
    const { alumnoId, programaId, nuevoEstatus, motivo } = cambiarEstatusDto;

    const inscripcion = await this.inscripcionRepository.findOne({
      where: {
        alumno: { id: alumnoId },
        programa: { id: programaId },
      },
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `No se encontró ninguna inscripción activa para el alumno ${alumnoId} en el programa ${programaId}.`,
      );
    }

    if (inscripcion.estatusActual === nuevoEstatus) {
      throw new BadRequestException(
        `El alumno ya se encuentra en el estatus '${nuevoEstatus}'. El nuevo estatus debe ser diferente.`,
      );
    }

    const estatusAnterior = inscripcion.estatusActual;

    return await this.dataSource.transaction(async (manager) => {
      inscripcion.estatusActual = nuevoEstatus;
      await manager.save(Inscripcion, inscripcion);
      const historialLog = manager.create(HistorialInscripcion, {
        alumnoId: alumnoId,
        programaId: programaId,
        estatusAnterior: estatusAnterior,
        estatusNuevo: nuevoEstatus,
        motivo: motivo || undefined,
      });
      await manager.save(HistorialInscripcion, historialLog);

      return {
        message:
          "Cambio de estatus procesado y registrado en el historial con éxito.",
        estatusAnterior,
        nuevoEstatus,
      };
    });
  }

  async obtenerMetricasDashboard() {
    const rawMetrics = await this.inscripcionRepository
      .createQueryBuilder("inscripcion")
      .select("inscripcion.estatusActual", "estatus")
      .addSelect("COUNT(inscripcion.id)", "cantidad")
      .groupBy("inscripcion.estatusActual")
      .getRawMany();

    const resultado = {
      activos: 0,
      bajasEmpresa: 0,
      bajasPrograma: 0,
      totalRegistrados: 0,
    };

    rawMetrics.forEach((row) => {
      const cantidad = parseInt(row.cantidad, 10);
      resultado.totalRegistrados += cantidad;

      if (row.estatus === "Activo") resultado.activos = cantidad;
      if (row.estatus === "Baja de empresa") resultado.bajasEmpresa = cantidad;
      if (row.estatus === "Baja del programa")
        resultado.bajasPrograma = cantidad;
    });

    return resultado;
  }

  async obtenerHistorialAlumno(uuid: string) {
    const alumno = await this.alumnoRepository.findOne({
      where: { uuidPublico: uuid },
      relations: {
        perfilInfo: true,
        empresa: true,
      },
    });

    if (!alumno) {
      throw new NotFoundException(`El alumno con UUID ${uuid} no existe.`);
    }

    const historial = await this.historialRepository.find({
      where: {
        inscripcion: {
          alumno: { id: alumno.id },
        },
      },
      relations: {
        inscripcion: {
          programa: true,
        },
      },
      order: { createdAt: "DESC" },
    });

    return {
      alumno: {
        id: alumno.id,
        uuidPublico: alumno.uuidPublico,
        isActive: alumno.isActive,
        createdAt: alumno.createdAt,
        nombres: alumno.perfilInfo.nombres,
        apellidos: alumno.perfilInfo.apellidos,
        telefono: alumno.perfilInfo.telefono,
        direccion: alumno.perfilInfo.direccion,
        urlImagenPerfil: alumno.perfilInfo.urlImagenPerfil,
        empresa: alumno.empresa
          ? {
              id: alumno.empresa.id,
              nombre: alumno.empresa.nombre,
            }
          : null,
      },
      historial: historial.map((item) => ({
        id: item.id,
        estatusAnterior: item.estatusAnterior,
        estatusNuevo: item.estatusNuevo,
        motivo: item.motivo,
        createdAt: item.createdAt,
        programa: {
          id: item.inscripcion.programa.id,
          nombre: item.inscripcion.programa.nombre,
        },
      })),
    };
  }

  async listarEmpresas() {
    return await this.empresaRepository.find({ order: { nombre: "ASC" } });
  }

  async listarProgramas() {
    return await this.programaRepository.find({ order: { nombre: "ASC" } });
  }
}
