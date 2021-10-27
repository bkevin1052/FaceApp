import { TestBed } from '@angular/core/testing';

import { AzureCognitiveServicesService } from './azure-cognitive-services.service';

describe('AzureCognitiveServicesService', () => {
  let service: AzureCognitiveServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureCognitiveServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
