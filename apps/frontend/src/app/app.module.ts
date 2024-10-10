import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { LoginComponent } from './pages/login/login.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/reducers/auth.reducer';
import { httpInterceptorProviders } from './services/token.interceptor';
import { SignupComponent } from './pages/signup/signup.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({ declarations: [AppComponent, LoginComponent, SignupComponent, SpinnerComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        StoreModule.forRoot({ auth: authReducer })], providers: [httpInterceptorProviders, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
