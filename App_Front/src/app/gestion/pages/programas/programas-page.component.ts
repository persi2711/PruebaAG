import { Component, inject, OnInit, signal } from "@angular/core";
import { Programa } from "../../../api/response/responses";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  selector: "app-programas-page",
  templateUrl: "programas-page.component.html",
  styleUrls: ["programas-page.component.scss"],
})
export class ProgramasPageComponent implements OnInit {
  private apiService = inject(SistemaAlumnosService);

  programas = signal<Programa[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.apiService.listarProgramas().subscribe({
      next: (data) => {
        this.programas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      },
    });
  }
}
