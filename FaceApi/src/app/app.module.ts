import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from "./Components/login/login.module";
import { ForgotPasswordComponent } from "./Components/forgotpassword/forgotpassword.component";
import { RegisterComponent } from "./Components/register/register.component";
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './Components/services/auth/auth.service';
import { AuthGuard } from './Components/services/auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule,SocialAuthServiceConfig,GoogleLoginProvider,FacebookLoginProvider} from 'angularx-social-login';
import { HomeComponent } from './Components/home/home.component';



@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LoginModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [{provide:AuthService}, {provide:AuthGuard},
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                '564886158649-rfbtd1v47j48md13000j4oin8vq32qi4.apps.googleusercontent.com'
              )
            },
            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider('clientId')
            }
          ]
        } as SocialAuthServiceConfig,
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
