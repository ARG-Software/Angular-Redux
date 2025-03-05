import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => {
        console.log("✅ AuthModule is being loaded dynamically!");
        return m.AuthModule;
      }),
  },
];
