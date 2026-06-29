import { Component, inject, OnInit, signal } from "@angular/core";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { Empresa } from "../../../api/response/responses";
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
  selector: "app-empresas-page",
  templateUrl: "empresas-page.component.html",
  styleUrls: ["empresas-page.component.scss"],
})
export class EmpresasPageComponent implements OnInit {
  private apiService = inject(SistemaAlumnosService);

  empresas = signal<Empresa[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.apiService.listarEmpresas().subscribe({
      next: (data) => {
        this.empresas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      },
    });
  }
}
