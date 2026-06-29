import { Component, inject, OnInit, signal } from "@angular/core";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { DashboardResumenResponse } from "../../../api/response/responses";
import { MetricCardComponent } from "../../components/metric-card/metric-card.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  imports: [MetricCardComponent, MatProgressSpinnerModule],
  selector: "app-home-page",
  templateUrl: "home-page.component.html",
  styleUrls: ["home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
  private alumnosService = inject(SistemaAlumnosService);

  metricas = signal<DashboardResumenResponse | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.alumnosService.obtenerMetricasDashboard().subscribe({
      next: (data) => {
        this.metricas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error("Error cargando métricas:", err);
        this.cargando.set(false);
      },
    });
  }
}
