import { createAction, props } from "@ngrx/store";


export const logout = createAction(
  '[Auth] LOGOUT'
)

export const loginStart = createAction(
  '[Auth] LOGIN_START',
  props<{payload: {
    email: string,
    password: string,
  }}>()
)

export const authSuccess = createAction(
  '[Auth] AUTH_SUCCESS',
  props<{payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean,
  }}>()
)

export const authFailure = createAction(
  '[Auth] AUTH_FAILURE',
  props<{payload: {
    error: string
  }}>()
)

export const signupStart = createAction(
  '[Auth] SIGNUP_START',
  props<{payload: {
    email: string,
    password: string,
  }}>()
)

export const clearError = createAction(
  '[Auth] CLEAR_ERROR'
)

export const autoLogin = createAction(
  '[Auth] AUTO_LOGIN'
)

export const autoLoginFailure = createAction(
  '[Auth] AUTO_LOGIN_FAILURE'
)
