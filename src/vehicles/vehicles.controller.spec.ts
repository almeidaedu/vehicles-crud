import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { HttpException } from '@nestjs/common';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  const client = {
    emit: jest.fn(),
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
    plate: 'DEF-5678',
    chassis: 'XYZ9876ABC7654321',
    renavam: '987654321',
    model: 'Camry',
    brand: 'Toyota',
    year: 2021,
  };
  const updatedVehicle = { ...mockVehicle, ...updateDto };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    create: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue(updatedVehicle),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
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

  describe('findAll', () => {
    it('returns array of vehicles', async () => {
      const result = await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('findOne', () => {
    it('calls service.findOne with numeric id and returns vehicle', async () => {
      const result = await controller.findOne('1');
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVehicle);
    });

    it('returns whatever service.findOne returns when not found', async () => {
      mockService.findOne.mockResolvedValueOnce(null);
      const result = await controller.findOne('99');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates vehicle and emits vehicle_created', async () => {
      const result = await controller.create(createDto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(client.emit).toHaveBeenCalledWith('vehicle_created', mockVehicle);
      expect(result).toEqual(mockVehicle);
    });

    it('on error emits vehicle_creation_error and throws HttpException', async () => {
      const error = new Error('fail create');
      mockService.create.mockRejectedValueOnce(error);
      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
      expect(client.emit).toHaveBeenCalledWith('vehicle_creation_error', {
        path: 'Create',
        error: 'fail create',
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('updates vehicle and emits vehicle_updated', async () => {
      const result = await controller.update(1, updateDto);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
      expect(client.emit).toHaveBeenCalledWith(
        'vehicle_updated',
        updatedVehicle,
      );
      expect(result).toEqual(updatedVehicle);
    });

    it('when vehicle not found emits error and throws HttpException', async () => {
      mockService.findOne.mockResolvedValueOnce(null);
      await expect(controller.update(99, updateDto)).rejects.toThrow(
        HttpException,
      );
      expect(client.emit).toHaveBeenCalledWith('vehicle_crud_error', {
        path: 'Update',
        error: 'Vehicle not found',
        data: updateDto,
        id: 99,
      });
    });

    it('on service.update error emits error and throws HttpException', async () => {
      const err = new Error('update failed');
      mockService.findOne.mockResolvedValueOnce(mockVehicle);
      mockService.update.mockRejectedValueOnce(err);
      await expect(controller.update(1, updateDto)).rejects.toThrow(
        HttpException,
      );
      expect(client.emit).toHaveBeenCalledWith('vehicle_crud_error', {
        path: 'Update',
        error: 'update failed',
        data: updateDto,
        id: 1,
      });
    });
  });

  describe('remove', () => {
    it('removes vehicle and emits vehicle_removed', async () => {
      const result = await controller.remove(1);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(client.emit).toHaveBeenCalledWith('vehicle_removed', 1);
      expect(result).toEqual(mockVehicle);
    });

    it('when vehicle not found emits error and throws HttpException', async () => {
      mockService.findOne.mockResolvedValueOnce(null);
      await expect(controller.remove(99)).rejects.toThrow(HttpException);
      expect(client.emit).toHaveBeenCalledWith('vehicle_crud_error', {
        path: 'Remove',
        error: 'Vehicle not found',
        id: 99,
      });
    });

    it('on service.remove error emits error and throws HttpException', async () => {
      const err = new Error('remove failed');
      mockService.findOne.mockResolvedValueOnce(mockVehicle);
      mockService.remove.mockRejectedValueOnce(err);
      await expect(controller.remove(1)).rejects.toThrow(HttpException);
      expect(client.emit).toHaveBeenCalledWith('vehicle_crud_error', {
        path: 'Remove',
        error: 'remove failed',
        id: 1,
      });
    });
  });
});
