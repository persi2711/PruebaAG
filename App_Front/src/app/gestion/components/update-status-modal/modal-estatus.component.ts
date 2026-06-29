import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import {
  Inscripcione,
  ListAlumnoResponse,
} from "../../../api/response/responses";
import { CambiarEstatusDto } from "../../../api/dto/dto";
import { AlumnosStateService } from "../../services/alumnos-state.service";

@Component({
  selector: "app-modal-estatus",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./modal-estatus.component.html",
  styleUrl: "./modal-estatus.component.scss",
})
export class ModalEstatusComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ModalEstatusComponent>);
  private apiService = inject(SistemaAlumnosService);
  private state = inject(AlumnosStateService);

  protected alumno: ListAlumnoResponse = inject(MAT_DIALOG_DATA);

  estatusMaster = this.state.statusOpciones;

  inscripcionSeleccionada = signal<Inscripcione | null>(null);

  nuevoEstatus = "";
  motivo = "";
  enviando = signal<boolean>(false);

  estatusOpcionesFiltradas = computed(() => {
    const inscripcionActual = this.inscripcionSeleccionada();
    if (!inscripcionActual) return this.estatusMaster;

    return this.estatusMaster.filter(
      (estatus) =>
        estatus.toLowerCase() !== inscripcionActual.estatusActual.toLowerCase(),
    );
  });

  ngOnInit(): void {
    if (this.alumno.inscripciones && this.alumno.inscripciones.length > 0) {
      this.inscripcionSeleccionada.set(this.alumno.inscripciones[0]);
    }
  }

  onProgramaChange(nuevaInscripcion: Inscripcione): void {
    this.inscripcionSeleccionada.set(nuevaInscripcion);
    this.nuevoEstatus = "";
  }

  guardar(): void {
    const inscripcion = this.inscripcionSeleccionada();
    if (!inscripcion || !this.nuevoEstatus) return;

    this.enviando.set(true);

    const dto: CambiarEstatusDto = {
      alumnoId: this.alumno.id,
      programaId: inscripcion.programa.id,
      nuevoEstatus: this.nuevoEstatus,
      motivo: this.motivo.trim() || undefined,
    };

    this.apiService.cambiarEstatus(dto).subscribe({
      next: () => {
        this.enviando.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.enviando.set(false);
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
