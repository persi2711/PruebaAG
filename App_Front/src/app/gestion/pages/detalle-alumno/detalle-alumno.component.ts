import { Component, OnInit, inject, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { HistorialEstatusResponse } from "../../../api/response/historial-response";

@Component({
  selector: "app-detalle-alumno",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: "./detalle-alumno.component.html",
  styleUrl: "./detalle-alumno.component.scss",
})
export class DetalleAlumnoComponent implements OnInit {
  private apiService = inject(SistemaAlumnosService);

  uuid = input.required<string>();

  perfilData = signal<HistorialEstatusResponse | null>(null);
  cargando = signal<boolean>(true);
  errorEstudiante = signal<boolean>(false);

  imagenDefecto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  ngOnInit(): void {
    this.cargarDetalleEstudiante();
  }

  private cargarDetalleEstudiante(): void {
    this.cargando.set(true);
    this.errorEstudiante.set(false);

    this.apiService.obtenerHistorialAlumno(this.uuid()).subscribe({
      next: (data) => {
        this.perfilData.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error("Error al recuperar historial del alumno:", err);
        this.errorEstudiante.set(true);
        this.cargando.set(false);
      },
    });
  }

  manejarErrorImagen(event: Event): void {
    const mdcImg = event.target as HTMLImageElement;
    mdcImg.src = this.imagenDefecto;
  }
}
