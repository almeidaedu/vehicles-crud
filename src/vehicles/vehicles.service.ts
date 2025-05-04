import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async findAll() {
    try {
      const vehicles = await this.vehicleRepository.find();
      if (!vehicles.length) {
        return 'No vehicles found';
      }
      return vehicles;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching vehicles: ${message}`);
    }
  }

  async findOne(id: number) {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async create(data: CreateVehicleDto) {
    try {
      const vehicle = this.vehicleRepository.create(data);
      return this.vehicleRepository.save(vehicle);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error creating vehicle: ${message}`);
    }
  }

  async update(id: number, update: UpdateVehicleDto) {
    const oldVehicle = await this.vehicleRepository.findOne({ where: { id } });
    await this.vehicleRepository.update(id, update);
    const newVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    return {
      ...oldVehicle,
      ...newVehicle,
    };
  }

  async remove(id: number) {
    await this.vehicleRepository.delete(id);
    return `Vehicle removed with ID: ${id}`;
  }
}
