import { Test, TestingModule } from '@nestjs/testing';
import { SuppliesUsageService } from './supplies-usage.service';

describe('SuppliesUsageService', () => {
  let service: SuppliesUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliesUsageService],
    }).compile();

    service = module.get<SuppliesUsageService>(SuppliesUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
