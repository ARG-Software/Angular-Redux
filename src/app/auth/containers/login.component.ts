import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { login } from "../actions/auth.actions";
import * as fromModule from "../auth.reducers.index";

@Component({
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  protected loginError$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromModule.AuthState>
  ) {}

  public ngOnInit(): void {
    this.loginError$ = this.store.select(fromModule.hasLoginError);

    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  public logIn(): void {
    if (this.loginForm.invalid) {
      console.warn("❌ Login form is invalid!");
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log("🚀 Dispatching login action:", username);

    this.store.dispatch(login({ username, password }));
  }
}
