import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "./auth.service";


import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    guard = TestBed.inject(AuthGuard);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
