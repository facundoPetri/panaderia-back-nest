import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { SuppliesModule } from './supplies/supplies.module';
import { ProvidersModule } from './providers/providers.module';
import { MachinesModule } from './machines/machines.module';
import { AuthModule } from './auth/auth.module';
import { PdfService } from './pdf/pdf.service';
import { BatchModule } from './batch/batch.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveStaticOptions: {
        index: false,
      },
    }),
    UsersModule,
    RecipesModule,
    SuppliesModule,
    ProvidersModule,
    MachinesModule,
    AuthModule,
    BatchModule,
    MaintenanceModule,
    OrdersModule,
  ],
  providers: [PdfService],
})
export class AppModule {}
