import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../actions/auth.actions';

export interface IAuthState {
  isLoggedIn: boolean;
}

export const initialAuthState: IAuthState = {
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, (state) => { return { ...state, isLoggedIn: true } }),
  on(logout, (state) => { return { ...state, isLoggedIn: false } }),
);
