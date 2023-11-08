import { createSelector } from '@ngrx/store';
import { IAuthState } from './reducers/auth.reducer';

export interface AppState {
  auth: IAuthState;
}

export const selectAuthState = (state: AppState) => state.auth;

export const selectAuth = createSelector(
  selectAuthState,
  (state: IAuthState) => state.isLoggedIn
);
