import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { throwError,Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AzureCognitiveServicesService {

  constructor(private httpClient: HttpClient) { }


  GetImage(imageUrl:string):Observable<any>{

    const header = new HttpHeaders({
      'Content-Type':'application/json',
      'Ocp-Apim-Subscription-Key': 'f70f66fc1a3e494f83258b69497b9a4d'
    })

    return this.httpClient.post(environment.server, {url: imageUrl},{headers:header}).pipe(catchError(this.clientError));
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
