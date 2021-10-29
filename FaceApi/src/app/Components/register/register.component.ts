import { CreateUser } from '../services/CreateUser/create-user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form_register: FormGroup;

  constructor(
    private fb: FormBuilder,
    private APIService: CreateUser, private route: Router
  ) {

    this.form_register = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]],
      name: ['', [
        Validators.required,
      ]],
      surname: ['', [
        Validators.required,
      ]],
      phone: ['', [
        Validators.required,
      ]]
    })

  }

  register() {
    console.log(this.form_register.controls.password.value);
    console.log(this.form_register.controls.confirmPassword.value);
    var pass = this.form_register.controls.password.value;
    var Confpass = this.form_register.controls.confirmPassword.value;

    if (pass == Confpass) {

      //Solicitud a la API
      console.log(this.form_register.value)
      this.APIService.crearUsuario(this.form_register.value).subscribe((data) => {

        Swal.fire(data.mensaje + '!', 'Por favor ingresar, nombre de usuario y contraseña.', 'success')
        this.route.navigate(['/login']);
        return;

      },
        (error: any) => {
          alert(error);
          return;
        });
    } else {

      alert("Contraseñas no coinciden");

    }
  }


  ngOnInit() {

  }

}
