import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AzureCognitiveServicesService {

  constructor(private httpClient: HttpClient) { }


  GetImage(imageUrl:string){

    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      //params: new HttpParams().append('Ocp-Apim-Subscription-Key', 'c3cc8c1342e8426abe38113a2d9ed60b')
    }
    console.log(options);
    console.log(imageUrl);
    return this.httpClient.post(`${environment.server}`, { url: imageUrl},options).pipe(catchError(this.clientError));
  }

  clientError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
  }

}
