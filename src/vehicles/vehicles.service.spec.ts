/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

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

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repo: Repository<Vehicle>;

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockVehicle),
    save: jest.fn().mockResolvedValue(mockVehicle),
    find: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue({ ...mockVehicle, ...updateDto }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    repo = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a vehicle', async () => {
    const result = await service.create(createDto);
    expect(repo.create).toHaveBeenCalledWith(createDto);
    expect(repo.save).toHaveBeenCalledWith(mockVehicle);
    expect(result).toContain(`${mockVehicle.id}`);
  });

  it('should return all vehicles', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockVehicle]);
  });

  it('should return "No vehicles found" if empty', async () => {
    repo.find = jest.fn().mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toBe('No vehicles found');
  });

  it('should find one vehicle by id', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockVehicle);
  });

  it('should update a vehicle', async () => {
    const result = await service.update(1, updateDto);
    expect(repo.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toContain('updated');
  });

  it('should remove a vehicle', async () => {
    const result = await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toContain('removed');
  });
});
