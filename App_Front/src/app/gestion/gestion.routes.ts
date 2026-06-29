import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { AlumnosStateService } from "./services/alumnos-state.service";

export const GESTION_ROUTES: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home",
        loadComponent: () =>
          import("./pages/home/home-page.component").then(
            (m) => m.HomePageComponent,
          ),
      },
      {
        path: "alumnos",
        loadComponent: () =>
          import("./pages/alumnos/alumnos-page.component").then(
            (m) => m.AlumnosPageComponent,
          ),
      },
      {
        path: "alumnos/:uuid",
        loadComponent: () =>
          import("./pages/detalle-alumno/detalle-alumno.component").then(
            (m) => m.DetalleAlumnoComponent,
          ),
      },
      {
        path: "programas",
        loadComponent: () =>
          import("./pages/programas/programas-page.component").then(
            (m) => m.ProgramasPageComponent,
          ),
      },
      {
        path: "empresas",
        loadComponent: () =>
          import("./pages/empresas/empresas-page.component").then(
            (m) => m.EmpresasPageComponent,
          ),
      },
    ],
  },
];
