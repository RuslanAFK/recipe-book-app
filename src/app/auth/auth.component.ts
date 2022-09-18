import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { clearError, loginStart, signupStart } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = false;
  isLoading = false;
  error: string | null = null;

  private storeSub: Subscription | null = null;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.error;
    })
  }

  ngOnDestroy(): void {
    if(this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode) {
      this.store.dispatch(loginStart({payload: {email: email, password: password}}));
    } else {
      this.store.dispatch(signupStart({payload: {email: email, password: password}}))
    }
    form.reset();
  }

  onHandleClose() {
    this.store.dispatch(clearError());
  }

}
