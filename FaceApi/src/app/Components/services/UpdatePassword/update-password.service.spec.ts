import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UpdatePassword } from './update-password.service';

describe('UpdatePassword', () => {
  let service: UpdatePassword;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UpdatePassword);
  });

  it('Servicio para obtener datos de direccion creado correctamente', () => {
    expect(service).toBeTruthy();
  });
});
