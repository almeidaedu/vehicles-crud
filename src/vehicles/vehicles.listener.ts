import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller()
export class VehiclesListener {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @MessagePattern('vehicle_created')
  async handleVehicleCreated(@Payload() data: CreateVehicleDto) {
    try {
      return this.vehiclesService.create(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error creating vehicle: ${message}`);
    }
  }

  @MessagePattern('vehicle_updated')
  async handleVehicleUpdated(
    @Payload() data: { id: number; update: UpdateVehicleDto },
  ) {
    return this.vehiclesService.update(data.id, data.update);
  }

  @MessagePattern('vehicle_removed')
  async handleVehicleRemoved(@Payload() id: number) {
    return this.vehiclesService.remove(id);
  }

  //TODO use a logger instead of console.error
  @MessagePattern('vehicle_creation_error')
  handleVehicleCreationError(
    @Payload() data: { error: string; data: CreateVehicleDto },
  ) {
    console.error(`Error creating vehicle: ${data.error}`, data.data);
  }
}
