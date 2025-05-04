import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehiclesListener } from './vehicles.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    ClientsModule.register([
      {
        name: 'VEHICLES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'vehicles_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [VehiclesController, VehiclesListener],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
