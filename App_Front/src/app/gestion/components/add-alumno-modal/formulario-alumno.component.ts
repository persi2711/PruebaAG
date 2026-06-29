import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { forkJoin } from "rxjs";

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Empresa, Programa } from "../../../api/response/responses";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { CreateAlumnoDto } from "../../../api/dto/dto";

@Component({
  selector: "app-formulario-alumno",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./formulario-alumno.component.html",
  styleUrl: "./formulario-alumno.component.scss",
})
export class FormularioAlumnoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormularioAlumnoComponent>);
  private apiService = inject(SistemaAlumnosService);

  empresas = signal<Empresa[]>([]);
  programas = signal<Programa[]>([]);
  cargandoCatalogos = signal<boolean>(true);
  enviando = signal<boolean>(false);

  alumnoForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCatalogosIniciales();
  }

  private inicializarFormulario(): void {
    this.alumnoForm = this.fb.group({
      nombres: ["", [Validators.required, this.noSoloNumerosValidator]],
      apellidos: ["", [Validators.required, this.noSoloNumerosValidator]],
      empresaId: ["", Validators.required],
      programaId: ["", Validators.required],
      urlImagenPerfil: [""],

      telefono: ["", [Validators.pattern(/^\+52\d{10}$/)]],
      direccion: ["", [this.noSoloNumerosValidator]],
    });
  }

  private cargarCatalogosIniciales(): void {
    forkJoin({
      empresas: this.apiService.listarEmpresas(),
      programas: this.apiService.listarProgramas(),
    }).subscribe({
      next: (res) => {
        this.empresas.set(res.empresas);
        this.programas.set(res.programas);
        this.cargandoCatalogos.set(false);
      },
      error: (err) => {
        console.error("Error al poblar catálogos:", err);
        this.cargandoCatalogos.set(false);
      },
    });
  }

  private noSoloNumerosValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    const esSoloNumeros = /^\d+$/.test(valor.toString().trim());
    return esSoloNumeros ? { soloNumeros: true } : null;
  }

  guardar(): void {
    if (this.alumnoForm.invalid) {
      this.alumnoForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    const formValue = this.alumnoForm.value;
    const dto: CreateAlumnoDto = {
      nombres: formValue.nombres.trim(),
      apellidos: formValue.apellidos.trim(),
      empresaId: Number(formValue.empresaId),
      programaId: Number(formValue.programaId),
      urlImagenPerfil: formValue.urlImagenPerfil?.trim() || undefined,
      telefono: formValue.telefono?.trim() || undefined,
      direccion: formValue.direccion?.trim() || undefined,
    };

    this.apiService.registrarAlumno(dto).subscribe({
      next: () => {
        this.enviando.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Error al registrar estudiante:", err);
        this.enviando.set(false);
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
