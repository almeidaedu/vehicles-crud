/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

describe('VehiclesController', () => {
  let controller: VehiclesController;
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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockVehicle),
    findAll: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue({ ...mockVehicle, ...updateDto }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: mockService }],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct dto and return the result', async () => {
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of vehicles', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id and return the vehicle', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('update', () => {
    it('should call service.update with numeric id and dto and return the updated vehicle', async () => {
      const result = await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({ ...mockVehicle, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id and return deletion result', async () => {
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
