import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicle } from './interfaces/vehicle.interface';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<IVehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    await this.vehicleRepository.save(vehicle);
    return `this action added a new vehicle with ID ${vehicle.id}`;
  }

  async findAll() {
    const vehicles = await this.vehicleRepository.find();
    if (!vehicles.length) {
      return 'No vehicles found';
    }

    return vehicles;
  }

  findOne(id: number) {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.vehicleRepository.update(id, updateVehicleDto);
    return `This action updated the #${id} vehicle`;
  }

  async remove(id: number) {
    await this.vehicleRepository.delete(id);
    return `This action removed the #${id} vehicle`;
  }
}
