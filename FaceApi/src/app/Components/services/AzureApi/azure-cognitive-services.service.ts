import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AzureCognitiveServicesService {

  constructor(private httpClient: HttpClient) { }

  detect(face1: string, face2: string): Observable<string[]> {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'f70f66fc1a3e494f83258b69497b9a4d'
    })

    return forkJoin([
      this.httpClient.post(environment.baseURL + 'face/v1.0/detect', { url: face1 }, { headers: header }).pipe(catchError(this.clientError)),
      this.httpClient.post(environment.baseURL + 'face/v1.0/detect', { url: face2 }, { headers: header }).pipe(catchError(this.clientError))
    ]).pipe(
      map((data: any[]) => {
        let faceArray1 = data[0]
        let faceArray2 = data[1]

        let response: string[] = [faceArray1[0].faceId, faceArray2[0].faceId]
        return response;
      })
    )
  }

  verify(faceId1: string, faceId2: string): Observable<any> {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'f70f66fc1a3e494f83258b69497b9a4d'
    })

    return this.httpClient.post(environment.baseURL + 'face/v1.0/verify', { faceId1: faceId1, faceId2: faceId2 }, { headers: header }).pipe(
      map(res => {
        return res
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  GetImage(imageUrl: string): Observable<any> {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'f70f66fc1a3e494f83258b69497b9a4d'
    })

    return this.httpClient.post(environment.server, { url: imageUrl }, { headers: header }).pipe(catchError(this.clientError));
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
