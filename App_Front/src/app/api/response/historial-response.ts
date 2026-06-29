export interface HistorialEstatusResponse {
  alumno: HisAlumno;
  historial: Historial[];
}

export interface HisAlumno {
  id: number;
  uuidPublico: string;
  isActive: boolean;
  createdAt: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  urlImagenPerfil: string;
  empresa: HisEmpresa;
}

export interface HisEmpresa {
  id: number;
  nombre: string;
}

export interface Historial {
  id: number;
  estatusAnterior?: string;
  estatusNuevo: string;
  motivo: string;
  createdAt: string;
  programa: Programa;
}

export interface Programa {
  id: number;
  nombre: string;
}
