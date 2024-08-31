import { Test, TestingModule } from '@nestjs/testing';
import { SuppliesUsageController } from './supplies-usage.controller';
import { SuppliesUsageService } from './supplies-usage.service';

describe('SuppliesUsageController', () => {
  let controller: SuppliesUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliesUsageController],
      providers: [SuppliesUsageService],
    }).compile();

    controller = module.get<SuppliesUsageController>(SuppliesUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
