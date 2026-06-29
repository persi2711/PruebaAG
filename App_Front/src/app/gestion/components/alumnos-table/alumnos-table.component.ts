import { Component, OnInit, OnDestroy, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AlumnosStateService } from "../../services/alumnos-state.service";
import { ListAlumnoResponse } from "../../../api/response/responses";
import { Router } from "@angular/router";

@Component({
  selector: "app-alumnos-table",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./alumnos-table.component.html",
  styleUrl: "./alumnos-table.component.scss",
})
export class AlumnosTableComponent implements OnInit, OnDestroy {
  private stateService = inject(AlumnosStateService);
  private sub!: Subscription;
  private router = inject(Router);

  dataSource = new MatTableDataSource<ListAlumnoResponse>([]);
  displayedColumns: string[] = [
    "nombre",
    "empresa",
    "programa",
    "fecha",
    "estatus",
    "acciones",
  ];

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (paginator) this.dataSource.paginator = paginator;
  }

  ngOnInit(): void {
    this.sub = this.stateService.alumnos$.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  obtenerEstatusActual(alumno: ListAlumnoResponse): string {
    return alumno.inscripciones?.[0]?.estatusActual || "Sin Inscripción";
  }

  obtenerProgramaNombre(alumno: ListAlumnoResponse): string {
    return alumno.inscripciones?.[0]?.programa?.nombre || "N/A";
  }

  verPerfil(alumno: ListAlumnoResponse): void {
    this.router.navigate(["/gestion/alumnos", alumno.uuidPublico]);
  }

  abrirCambioEstatus(alumno: ListAlumnoResponse): void {
    this.stateService.abrirModalCambioEstatus(alumno);
  }
}
