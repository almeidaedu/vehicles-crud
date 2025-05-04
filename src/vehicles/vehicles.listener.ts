import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicle } from './interfaces/vehicle.interface';

//TODO usar um logger para registrar os eventos
//Usei o console.log e console.error para demonstrar a aplicação do broker de mensagens
@Controller()
export class VehiclesListener {
  @EventPattern('vehicle_created')
  handleVehicleCreated(@Payload() data: CreateVehicleDto) {
    console.log('Vehicle created:', data);
  }

  @EventPattern('vehicle_updated')
  handleVehicleUpdated(
    @Payload() data: { id: number; data: UpdateVehicleDto },
  ) {
    console.log('Vehicle updated:', data);
  }

  @EventPattern('vehicle_removed')
  handleVehicleRemoved(@Payload() id: number) {
    console.log(`Vehicle removed with ID: ${id}`);
  }

  @EventPattern('vehicle_crud_error')
  handleVehicleCreationError(
    @Payload()
    errorData: {
      path: string;
      error: string;
      data?: IVehicle;
      id?: number;
    },
  ) {
    const { path, error, data, id } = errorData;
    if (!data) {
      console.error(
        `Error on vehicle service on ${path} route: ${error} ID: ${id}`,
      );
      return;
    }
    if (!id) {
      console.error(
        `Error on vehicle service on ${path} route: ${error}`,
        data,
      );
      return;
    }

    console.error(
      `Error on vehicle service on ${path} route with vehicle id ${id}: ${error}`,
      data,
    );
  }
}
