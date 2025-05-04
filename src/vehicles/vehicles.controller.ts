import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    @Inject('VEHICLES_SERVICE') private readonly client: ClientProxy,
    private readonly vehiclesService: VehiclesService,
  ) {}

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    try {
      const newVehicle = await this.vehiclesService.create(createVehicleDto);
      this.client.emit('vehicle_created', newVehicle);
      return newVehicle;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.client.emit('vehicle_creation_error', {
        path: 'Create',
        error: message,
        data: createVehicleDto,
      });
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Houve um erro ao criar o veículo',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error(message),
        },
      );
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    try {
      const vehicle = await this.vehiclesService.findOne(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      const updatedVehicle = await this.vehiclesService.update(
        id,
        updateVehicleDto,
      );
      this.client.emit('vehicle_updated', updatedVehicle);
      return updatedVehicle;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.client.emit('vehicle_crud_error', {
        path: 'Update',
        error: message,
        data: updateVehicleDto,
        id,
      });
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Houve um erro ao atualizar o veículo',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error(message),
        },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const vehicle = await this.vehiclesService.findOne(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      await this.vehiclesService.remove(id);
      this.client.emit('vehicle_removed', id);
      return vehicle;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.client.emit('vehicle_crud_error', {
        path: 'Remove',
        error: message,
        id,
      });
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Houve um erro ao remover o veículo',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: new Error(message),
        },
      );
    }
  }
}
