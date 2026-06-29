import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "gestion",
    loadChildren: () =>
      import("./gestion/gestion.routes").then((m) => m.GESTION_ROUTES),
  },
  {
    path: "",
    redirectTo: "gestion",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "gestion",
  },
];
