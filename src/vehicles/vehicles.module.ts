import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehiclesListener } from './vehicles.listener';

const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    ClientsModule.register([
      {
        name: 'VEHICLES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: 'vehicles_queue',
        },
      },
    ]),
  ],
  controllers: [VehiclesController, VehiclesListener],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
