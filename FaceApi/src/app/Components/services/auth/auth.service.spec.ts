import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('El servicio de auth se funciona correctamente', inject([AuthService], (authService: AuthService) => {
    expect(authService).toBeTruthy();
  }));
});
