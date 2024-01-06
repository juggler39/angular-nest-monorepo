import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RestrictedComponent } from './pages/restricted/restricted.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoggedInGuard } from '@services/logged-in.guard';
import { AuthGuard } from '@services/auth.guard';


const appRoutes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'restricted',
    component: RestrictedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      //onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking'
    })
  ],
  declarations: [],
  providers: [],
  exports: [RouterModule],
})
export class AppRoutingModule { }
