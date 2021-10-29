import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CreateUser } from './create-user.service';

describe('CreateUser', () => {
  let service: CreateUser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(CreateUser);
  });

  it('Servicio para obtener datos de direccion creado correctamente', () => {
    expect(service).toBeTruthy();
  });
});
