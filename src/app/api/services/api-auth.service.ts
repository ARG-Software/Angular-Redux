import { Injectable, Injector } from "@angular/core";
import { IAppConfig, APP_CONFIG } from "../../app.config";
import { GlobalEnvironmentService } from "../../global.environment.service";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class ApiAuthService {
  private readonly appConfigurations: IAppConfig;
  private readonly refreshTokenUrl: string;
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;

  constructor(
    private environment: GlobalEnvironmentService,
    private injector: Injector,
    private router: Router,
    private http: HttpClient
  ) {
    this.appConfigurations = injector.get(APP_CONFIG);
    this.refreshTokenUrl =
      this.environment.getApiUrl() +
      this.appConfigurations.refreshTokenEndPoint;
    this.accessTokenKey = this.appConfigurations.accessTokenKey;
    this.refreshTokenKey = this.appConfigurations.refreshTokenKey;
  }

  public getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  public getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  public updateAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  public addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getAccessToken()}`,
      },
    });
    return request;
  }

  public getNewAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      "content-type": "application/x-www-form-urlencoded",
      grant_type: "refresh_token",
      refresh_token: this.getRefreshToken()!,
    });
    return this.http.post(this.refreshTokenUrl, "", { headers });
  }

  public logout(): void {
    localStorage.setItem(this.accessTokenKey, "");
    localStorage.setItem(this.refreshTokenKey, "");
    this.router.navigate([this.appConfigurations.logoutAppPath]);
  }
}
