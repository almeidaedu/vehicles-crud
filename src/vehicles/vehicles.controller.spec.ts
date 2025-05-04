import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { of } from 'rxjs';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  const client = {
    send: jest.fn(() => of('mocked_response')),
  };

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

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    create: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue({ ...mockVehicle, ...updateDto }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        { provide: VehiclesService, useValue: mockService },
        { provide: 'VEHICLES_SERVICE', useValue: client },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should send vehicle_created event with correct dto', async () => {
      await controller.create(createDto);
      expect(client.send).toHaveBeenCalledWith('vehicle_created', createDto);
    });
  });

  describe('update', () => {
    it('should send vehicle_updated event with correct id and dto', async () => {
      const id = 1;
      await controller.update(id, updateDto);
      expect(client.send).toHaveBeenCalledWith('vehicle_updated', {
        id: +id,
        update: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should send vehicle_removed event with correct id', async () => {
      const id = 1;
      await controller.remove(id);
      expect(client.send).toHaveBeenCalledWith('vehicle_removed', +id);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of vehicles', async () => {
      const result = await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id and return the vehicle', async () => {
      const result = await controller.findOne('1');
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVehicle);
    });
  });
});
