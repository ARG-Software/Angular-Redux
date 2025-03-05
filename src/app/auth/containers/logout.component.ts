import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { logout } from "../actions/auth.actions";
import * as fromModule from "../auth.reducers.index";

@Component({
  standalone: false,
  template: "",
})
export class LogoutComponent implements OnInit {
  constructor(private store: Store<fromModule.AuthState>) {}

  public ngOnInit(): void {
    console.log("🔓 Dispatching logout action...");
    this.store.dispatch(logout());
  }
}
