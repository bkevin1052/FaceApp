import { AzureCognitiveServicesService } from './services/azure-cognitive-services.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Face Api';

  imageUrl: string;

  ImageInfo: string;

  constructor(private data:AzureCognitiveServicesService){
    this.imageUrl = '';
    this.ImageInfo = '';
  }

  getInfo(imageUrl:string){
      this.data.GetImage(imageUrl).subscribe(data => {
        console.log(data)
        //this.ImageInfo = data;
      })
  }



}
