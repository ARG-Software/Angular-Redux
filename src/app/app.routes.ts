import { Routes } from "@angular/router";

export const routes: Routes = [
  //TODO uncomment to enable auth components
  /* {
    path: "",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => {
        console.log("✅ AuthModule is being loaded dynamically!");
        return m.AuthModule;
      }),
  }, */

  {
    path: "",
    //TODO activate this
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("../app/main/main.module").then((m) => m.MainModule),
  },
];
