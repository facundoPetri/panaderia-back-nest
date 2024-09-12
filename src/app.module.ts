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
import { SuppliesUsageModule } from './supplies-usage/supplies-usage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        const dbUri =
          env === 'local'
            ? configService.get<string>('DATABASE_URI')
            : configService.get<string>('DATABASE_URI_LOCAL');
        return {
          uri: dbUri,
        };
      },
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
    SuppliesUsageModule,
  ],
  providers: [PdfService],
})
export class AppModule {}
