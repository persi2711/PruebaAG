import { Injectable, inject, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SistemaAlumnosService } from "../../api/sistema-alumnos.service";
import { ListAlumnoResponse } from "../../api/response/responses";
import { MatDialog } from "@angular/material/dialog";
import { ModalEstatusComponent } from "../components/update-status-modal/modal-estatus.component";
import { FormularioAlumnoComponent } from "../components/add-alumno-modal/formulario-alumno.component";

@Injectable({ providedIn: "root" })
export class AlumnosStateService {
  private apiService = inject(SistemaAlumnosService);

  private alumnosSubject = new BehaviorSubject<ListAlumnoResponse[]>([]);
  statusOpciones = [
    "Activo",
    "Baja de empresa",
    "Baja del programa",
    "Inscrito",
    "Suspendido",
    "Reingreso",
    "Egresado",
  ];
  alumnos$ = this.alumnosSubject.asObservable();
  cargando = signal<boolean>(false);
  private dialog = inject(MatDialog);

  estatusSeleccionado = signal<string>("");
  programaSeleccionado = signal<number | undefined>(undefined);

  refrescarAlumnos(): void {
    this.cargando.set(true);

    const estatus = this.estatusSeleccionado() || undefined;
    const programaId = this.programaSeleccionado();

    this.apiService.listarAlumnos(estatus, programaId).subscribe({
      next: (data) => {
        this.alumnosSubject.next(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error("Error en AlumnosStateService:", err);
        this.cargando.set(false);
      },
    });
  }

  actualizarFiltros(estatus: string, programaId: number | undefined): void {
    this.estatusSeleccionado.set(estatus);
    this.programaSeleccionado.set(programaId);
    this.refrescarAlumnos();
  }

  abrirModalCambioEstatus(alumno: ListAlumnoResponse): void {
    const dialogRef = this.dialog.open(ModalEstatusComponent, {
      width: "450px",
      data: alumno,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((resultadoExitoso) => {
      if (resultadoExitoso) {
        this.refrescarAlumnos();
      }
    });
  }
  abrirModalAgregarAlumno(): void {
    const dialogRef = this.dialog.open(FormularioAlumnoComponent, {
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((resultadoExitoso) => {
      if (resultadoExitoso) {
        this.refrescarAlumnos();
      }
    });
  }
}
