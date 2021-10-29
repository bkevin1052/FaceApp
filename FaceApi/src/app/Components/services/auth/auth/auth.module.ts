import { LoginComponent } from '../../../login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
