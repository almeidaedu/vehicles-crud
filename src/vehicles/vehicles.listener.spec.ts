/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesListener } from './vehicles.listener';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

describe('VehiclesListener', () => {
  let listener: VehiclesListener;
  let service: VehiclesService;

  const mockVehicle = {
    id: 1,
    plate: 'ABC-1234',
    chassis: 'XYZ9876ABC1234567',
    renavam: '123456789',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2020,
  };
  const createDto: CreateVehicleDto = {
    plate: 'ABC-1234',
    chassis: 'XYZ9876ABC1234567',
    renavam: '123456789',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2020,
  };
  const updateDto: UpdateVehicleDto = {
    model: 'Camry',
    brand: 'Toyota',
    year: 2021,
    plate: 'DEF-5678',
    chassis: 'XYZ9876ABC7654321',
    renavam: '987654321',
  };

  const mockVehiclesService = {
    create: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue({ ...mockVehicle, ...updateDto }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesListener],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    listener = module.get<VehiclesListener>(VehiclesListener);
    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.create on vehicle_created event', async () => {
    await listener.handleVehicleCreated(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should call service.update on vehicle_updated event', async () => {
    const id = 1;

    await listener.handleVehicleUpdated({ id, update: updateDto });
    expect(service.update).toHaveBeenCalledWith(id, updateDto);
  });

  it('should call service.remove on vehicle_removed event', async () => {
    const id = 1;
    await listener.handleVehicleRemoved(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
