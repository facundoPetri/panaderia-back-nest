import { Test, TestingModule } from '@nestjs/testing';
import { ReportingOrdersController } from './reporting_orders.controller';
import { ReportingOrdersService } from './reporting_orders.service';

describe('ReportingOrdersController', () => {
  let controller: ReportingOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportingOrdersController],
      providers: [ReportingOrdersService],
    }).compile();

    controller = module.get<ReportingOrdersController>(ReportingOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
