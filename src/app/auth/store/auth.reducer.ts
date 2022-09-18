import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User | null;
  error: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  error: null,
  loading: false,
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.authSuccess, (state, {payload}) => {
    const user = new User(payload.email, payload.userId, payload.token, payload.expirationDate);
    return ({
      ...state,
      user: user,
      error: null,
      loading: false,
    });
  }),
  on(AuthActions.authFailure, (state, {payload}) => {
    return ({
      ...state,
      user: null,
      error: payload.error,
      loading: false,
    });
  }),
  on(AuthActions.loginStart, (state, {payload}) => {
    return ({
      ...state,
      user: null,
      error: null,
      loading: true,
    });
  }),
  on(AuthActions.signupStart, (state, {payload}) => {
    return ({
      ...state,
      user: null,
      error: null,
      loading: true,
    });
  }),
  on(AuthActions.logout, state => ({
    ...state,
    user: null,
    error: null,
    loading: false,
  })),
  on(AuthActions.clearError, state => ({
    ...state,
    error: null
  }))
)

