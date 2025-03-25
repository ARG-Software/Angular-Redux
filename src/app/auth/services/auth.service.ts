import { Injectable, Injector } from "@angular/core";
import { IAppConfig, APP_CONFIG } from "src/app/app.config";

@Injectable()
export class AuthService {
  private readonly appConfigurations: IAppConfig;
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;

  constructor(private readonly injector: Injector) {
    this.appConfigurations = this.injector.get(APP_CONFIG);
    this.accessTokenKey = this.appConfigurations.accessTokenKey;
    this.refreshTokenKey = this.appConfigurations.refreshTokenKey;
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
