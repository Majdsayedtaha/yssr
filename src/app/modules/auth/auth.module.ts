//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from 'src/app/core/core.module';

//Components
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerificationCodeComponent } from './components/verification-code/verification-code.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    VerificationCodeComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CoreModule
  ],
})
export class AuthModule { }
