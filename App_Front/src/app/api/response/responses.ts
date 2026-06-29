export interface RegisterAlumnoResponse {
  message: string;
  alumnoId: number;
  uuidPublico: string;
}
export interface ListAlumnoResponse {
  id: number;
  uuidPublico: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  perfilInfo: PerfilInfo;
  empresa: Empresa;
  inscripciones: Inscripcione[];
}

export interface PerfilInfo {
  id: number;
  nombres: string;
  apellidos: string;
  urlImagenPerfil: string;
  telefono: string;
  direccion: string;
}

export interface Empresa {
  id: number;
  nombre: string;
  contactoNombre: string;
  contactoEmail: string;
  createdAt: string;
}

export interface Inscripcione {
  id: number;
  estatusActual: string;
  updatedAt: string;
  programa: Programa;
}

export interface Programa {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
}
export interface AlumnoResponse {
  message: string;
  estatusAnterior: string;
  nuevoEstatus: string;
}
export interface DashboardResumenResponse {
  activos: number;
  bajasEmpresa: number;
  bajasPrograma: number;
  totalRegistrados: number;
}
