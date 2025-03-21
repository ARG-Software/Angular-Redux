import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => {
        return m.AuthModule;
      }),
  },
];
