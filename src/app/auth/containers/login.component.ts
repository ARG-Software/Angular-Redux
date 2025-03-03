import { Login } from "./../actions/auth.actions";
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  Component,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromModule from "../auth.reducers.index";
import { LoginModelUI } from "../models/auth.models";
import { Observable } from "rxjs";

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
    private formbuilder: FormBuilder,
    private store: Store<fromModule.AuthState>
  ) {}

  public ngOnInit(): void {
    this.loginError$ = this.store.select(fromModule.hasLoginError);
    this.loginForm = this.formbuilder.group({
      username: new FormControl(""),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(5)])
      ),
    });
  }

  public logIn() {
    const loginFormValues = this.loginForm.value;
    const loginModel: LoginModelUI = {
      username: loginFormValues.username,
      password: loginFormValues.password,
    };
    this.store.dispatch(new Login(loginModel));
  }
}
