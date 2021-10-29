import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth/auth.service";
import { User } from "../models/User";
import { SocialAuthService } from 'angularx-social-login';
import { SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form_login: FormGroup;
  user!: User;
  userGoogle!: SocialUser;


  constructor(
    private authService: AuthService,
    private authServiceGoogle: SocialAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.form_login = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    })
  }


  login() {

    var aux = this.form_login.value as User;
    this.user = aux;
    this.authService.signIn(this.form_login.value).subscribe((res) => {
      //console.log(res)
      if (res.codigo == '100') {
        this.router.navigate(['Client/home']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.mensaje,
          footer: '<a href>Why do I have this issue?</a>'
        })
        this.router.navigate(['./login']);
      }

    });
  }

  ngOnInit(): void {

  }


  SignInWithGoogle(): any {
    this.authServiceGoogle.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authServiceGoogle.authState.subscribe((userGoogle) => {
      this.userGoogle = userGoogle;
    })


    console.log(this.userGoogle)
    this.authService.signInGoogle(this.userGoogle).subscribe((res) => {

      if (res.codigo == '100') {
        this.router.navigate(['Client/home']);
        Swal.fire('Inicio de Sesión con Google', res.mensaje, 'success')
      } else {
        Swal.fire(res.mensaje);
        this.router.navigate(['./login']);
      }

    });

  }
}
