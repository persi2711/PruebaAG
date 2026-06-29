import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  AlumnoResponse,
  DashboardResumenResponse,
  Empresa,
  ListAlumnoResponse,
  Programa,
  RegisterAlumnoResponse,
} from "./response/responses";
import { CambiarEstatusDto, CreateAlumnoDto } from "./dto/dto";
import { HistorialEstatusResponse } from "./response/historial-response";

@Injectable({
  providedIn: "root",
})
export class SistemaAlumnosService {
  private http = inject(HttpClient);
  private readonly URL_BASE = "http://localhost:3000/api/sistema-alumnos";

  // GET: api/sistema-alumnos/alumnos
  listarAlumnos(
    estatus?: string,
    programaId?: number,
  ): Observable<ListAlumnoResponse[]> {
    let params = new HttpParams();
    if (estatus) params = params.set("estatus", estatus);
    if (programaId) params = params.set("programaId", programaId.toString());

    return this.http.get<ListAlumnoResponse[]>(`${this.URL_BASE}/alumnos`, {
      params,
    });
  }

  // POST: api/sistema-alumnos/alumnos
  registrarAlumno(dto: CreateAlumnoDto): Observable<RegisterAlumnoResponse> {
    return this.http.post<RegisterAlumnoResponse>(
      `${this.URL_BASE}/alumnos`,
      dto,
    );
  }

  // PATCH: api/sistema-alumnos/alumnos/cambiar-estatus
  cambiarEstatus(dto: CambiarEstatusDto): Observable<AlumnoResponse> {
    return this.http.patch<AlumnoResponse>(
      `${this.URL_BASE}/alumnos/cambiar-estatus`,
      dto,
    );
  }

  // GET: api/sistema-alumnos/dashboard/resumen
  obtenerMetricasDashboard(): Observable<DashboardResumenResponse> {
    return this.http.get<DashboardResumenResponse>(
      `${this.URL_BASE}/dashboard/resumen`,
    );
  }

  // GET: api/sistema-alumnos/alumnos/:uuid/historial
  obtenerHistorialAlumno(uuid: string): Observable<HistorialEstatusResponse> {
    return this.http.get<HistorialEstatusResponse>(
      `${this.URL_BASE}/alumnos/${uuid}/historial`,
    );
  }

  // GET: api/sistema-alumnos/maestros/empresas
  listarEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.URL_BASE}/maestros/empresas`);
  }

  // GET: api/sistema-alumnos/maestros/programas
  listarProgramas(): Observable<Programa[]> {
    return this.http.get<Programa[]>(`${this.URL_BASE}/maestros/programas`);
  }
}
