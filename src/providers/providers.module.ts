import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider, ProviderSchema } from './schemas/provider.schema';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
    ]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService, PdfService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
