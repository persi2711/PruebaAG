import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {
  AlumnoResponse,
  ListAlumnoResponse,
  Programa,
} from "../../../api/response/responses";
import { Program } from "typescript";
import { SistemaAlumnosService } from "../../../api/sistema-alumnos.service";
import { BehaviorSubject } from "rxjs";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { AlumnosTableComponent } from "../../components/alumnos-table/alumnos-table.component";
import { AlumnosStateService } from "../../services/alumnos-state.service";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    AlumnosTableComponent,
  ],
  selector: "app-alumnos-page",
  templateUrl: "alumnos-page.component.html",
  styleUrls: ["alumnos-page.component.scss"],
})
export class AlumnosPageComponent implements OnInit {
  private apiService = inject(SistemaAlumnosService);
  protected state = inject(AlumnosStateService);

  programas = signal<Programa[]>([]);

  estatusSeleccionado = "";
  programaSeleccionado: number | undefined = undefined;
  estatusOpciones = this.state.statusOpciones;

  ngOnInit(): void {
    this.apiService
      .listarProgramas()
      .subscribe((data) => this.programas.set(data));

    this.state.refrescarAlumnos();
  }

  aplicarFiltros(): void {
    this.state.actualizarFiltros(
      this.estatusSeleccionado,
      this.programaSeleccionado,
    );
  }

  abrirModalAgregar(): void {
    this.state.abrirModalAgregarAlumno();
  }
}
