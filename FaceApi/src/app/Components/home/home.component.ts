
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';
import { AzureCognitiveServicesService } from '../services/AzureApi/azure-cognitive-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imageUrl: string;
  ImageInfo: string;

  link1: string;
  link2: string;

  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean;

  ngOnInit() {

  }

  OnFileSelected1(event: any){
    console.log(event)
    const file:File = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(file);

    let blobData1 = new Blob()

    let that = this;

    reader.onload = async function () {
      let fileData = reader.result?.toString()

      let binary = atob(fileData!.split(',')[1])
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      blobData1 = new Blob([new Uint8Array(array)], {type: 'image/png'})
      
      that.link1 = await that.uploadToS3(blobData1)
    };
  }

  OnFileSelected2(event: any){
    console.log(event)
    const file:File = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(file);

    let blobData1 = new Blob()

    let that = this;

    reader.onload = async function () {
      let fileData = reader.result?.toString()

      let binary = atob(fileData!.split(',')[1])
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      blobData1 = new Blob([new Uint8Array(array)], {type: 'image/png'})
      
      that.link2 = await that.uploadToS3(blobData1)
    };
  }

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  getBase64(file:File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result)
      return reader.result

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      
    };
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

    if (this.captures.length > 2) {
      this.captures.shift()
    }

    console.log(this.captures);
  }

  async uploadToS3(blobData: Blob) {

    let response = await axios.post('https://ri3eoiwlti.execute-api.us-east-1.amazonaws.com/dev/file', {
      key: new Date().getTime().toString().concat('.png'),
      contentType: 'image/png'
    })

    let resBody = JSON.parse(response.data.body)

    console.log("Blob", blobData)

    /*
    let binary = atob(this.captures[0].split(',')[1])
    let array = []
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i))
    }
    let blobData = new Blob([new Uint8Array(array)], {type: 'image/png'})
    console.log('Uploading to: ', resBody.uploadURL)*/

    const result = await fetch(resBody.uploadURL, {
      method: 'PUT',
      body: blobData
    })
    console.log('Result: ', result)

    return resBody.objectUrlAfterUpload
  }

  async analyze() {
    if (this.captures.length == 2) {
      let binary = atob(this.captures[0].split(',')[1])
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      let blobData1 = new Blob([new Uint8Array(array)], {type: 'image/png'})
      
      binary = atob(this.captures[1].split(',')[1])
      array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      let blobData2 = new Blob([new Uint8Array(array)], {type: 'image/png'})

      /**
       * SUBIDA A S3
       */
      await this.uploadToS3(blobData1)
      await this.uploadToS3(blobData2)

      let info1 = this.getInfo(this.link1)
      let info2 = this.getInfo(this.link2)
    }
    else if (this.link1 != null && this.link2 != null){
      let info1 = this.getInfo(this.link1)
      let info2 = this.getInfo(this.link2)
    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debes seleccionar dos imágenes o tomar dos fotografías!',
      })
    }
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

  constructor(private data:AzureCognitiveServicesService){
    this.imageUrl = '';
    this.ImageInfo = '';
    this.captures = [];
  }

  getInfo(imageUrl:string){
    this.data.GetImage(imageUrl).subscribe(data => {
      console.log(data)
      return data;
    })
  }
}
