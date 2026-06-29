export type EstatusValidos = [
  "Activo",
  "Baja de empresa",
  "Baja del programa",
  "Inscrito",
  "Suspendido",
  "Reingreso",
  "Egresado",
];
export interface CreateAlumnoDto {
  nombres: string;
  apellidos: string;
  empresaId: number;
  programaId: number;
  urlImagenPerfil?: string;
  telefono?: string;
  direccion?: string;
}

export interface CambiarEstatusDto {
  alumnoId: number;
  programaId: number;
  nuevoEstatus: EstatusValidos | string;
  motivo?: string;
}
