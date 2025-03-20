import { InjectionToken } from "@angular/core";

export const APP_CONFIG = new InjectionToken<IAppConfig>("app.config");

export interface IAppConfig {
  env: string;
  port: number;
  apiUrl: string;
  refreshTokenKey: string;
  accessTokenKey: string;
  refreshTokenEndPoint: string;
  loginEndPoint: string;
  navbarPath: string;
  sideMenuPath: string;
  loginAppPath: string;
  logoutAppPath: string;
}

export const AppConfig: IAppConfig = {
  env: "development",
  port: 4200,
  apiUrl: "http://localhost:3000",
  refreshTokenKey: "mims_refresh",
  accessTokenKey: "mims_access",
  loginEndPoint: "/auth/login",
  refreshTokenEndPoint: "/auth/refreshToken",
  navbarPath: "../assets/menus/navigationmenu.json",
  sideMenuPath: "../assets/menus/sidebarmenu.json",
  loginAppPath: "login",
  logoutAppPath: "logout",
};
