
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';
import { AzureCognitiveServicesService } from '../services/AzureApi/azure-cognitive-services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

  ngOnInit() {

  }

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
    //this.isCaptured = true;
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
        this.ImageInfo = data;
      })
  }


}
