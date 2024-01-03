import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RestrictedComponent } from './pages/restricted/restricted.component';
import { SignupComponent } from './pages/signup/signup.component';


const appRoutes: Routes = [
  // {
  //   path: '',
  //   component: NxWelcomeComponent,
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'restricted',
    component: RestrictedComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
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
