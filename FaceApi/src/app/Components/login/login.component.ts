import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth/auth.service";
import { User } from "../models/User";
import { SocialAuthService } from 'angularx-social-login';
import { SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AzureCognitiveServicesService } from '../services/AzureApi/azure-cognitive-services.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form_login: FormGroup;
  user!: User;
  userGoogle!: SocialUser;
  imageUrl: string;

  ImageInfo: string;

  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean;

  OnFileSelected(event: any){
    console.log(event)
  }

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;

    this.uploadToS3()
  }

  async uploadToS3() {

    let response = await axios.post('https://ri3eoiwlti.execute-api.us-east-1.amazonaws.com/dev/file', {
      key: new Date().getTime().toString().concat('.png'),
      contentType: 'image/png'
    })

    let resBody = JSON.parse(response.data.body)

    console.log(resBody)

    let binary = atob(this.captures[0].split(',')[1])
    let array = []
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i))
    }
    let blobData = new Blob([new Uint8Array(array)], {type: 'image/png'})
    console.log('Uploading to: ', resBody.uploadURL)

    const result = await fetch(resBody.uploadURL, {
      method: 'PUT',
      body: blobData
    })
    console.log('Result: ', result)

  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }



  constructor(
    private authService: AuthService,
    private authServiceGoogle: SocialAuthService,
    private fb: FormBuilder,
    private router: Router,
    private data:AzureCognitiveServicesService
  ) {

    this.form_login = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    })

    this.imageUrl = '';
    this.ImageInfo = '';
    this.captures = [];
  }

  getInfo(imageUrl:string){
    this.data.GetImage(imageUrl).subscribe(data => {
      console.log(data)
      this.ImageInfo = data;
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
