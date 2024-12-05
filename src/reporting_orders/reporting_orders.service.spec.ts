import { Test, TestingModule } from '@nestjs/testing';
import { ReportingOrdersService } from './reporting_orders.service';

describe('ReportingOrdersService', () => {
  let service: ReportingOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportingOrdersService],
    }).compile();

    service = module.get<ReportingOrdersService>(ReportingOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
