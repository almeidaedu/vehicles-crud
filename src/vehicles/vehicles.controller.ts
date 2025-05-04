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
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

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
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return lastValueFrom(this.client.send('vehicle_created', createVehicleDto));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
  ) {
    const msg = await lastValueFrom(
      this.client.send<{ id: number; update: UpdateVehicleDto }, object>(
        'vehicle_updated',
        { id, update: dto },
      ),
    );
    return { message: msg };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const msg = await lastValueFrom<string>(
      this.client.send('vehicle_removed', id),
    );
    return { message: msg };
  }
}
