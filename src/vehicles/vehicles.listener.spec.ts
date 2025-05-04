import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesListener } from './vehicles.listener';

describe('VehiclesListener', () => {
  let listener: VehiclesListener;

  const mockVehicle = {
    id: 1,
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

  beforeEach(() => {
    listener = new VehiclesListener();
    jest.restoreAllMocks();
  });

  describe('handleVehicleCreated', () => {
    it('should log created vehicle', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      listener.handleVehicleCreated(mockVehicle);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Vehicle created:',
        mockVehicle,
      );
    });
  });

  describe('handleVehicleUpdated', () => {
    it('should log updated vehicle', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const payload = {
        id: mockVehicle.id,
        data: updateDto,
      };

      listener.handleVehicleUpdated(payload);

      expect(consoleLogSpy).toHaveBeenCalledWith('Vehicle updated:', payload);
    });
  });

  describe('handleVehicleRemoved', () => {
    it('should log removed vehicle id', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const id = mockVehicle.id;

      listener.handleVehicleRemoved(id);

      expect(consoleLogSpy).toHaveBeenCalledWith('Vehicle removed:', id);
    });
  });

  describe('handleVehicleCreationError', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    it('should log error with ID when data property is not provided', () => {
      const errorData = { path: 'create', error: 'failed', id: 99 };
      listener.handleVehicleCreationError(errorData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error on vehicle service on create route: failed ID: 99',
      );
    });

    it('should log error with data when ID is not provided', () => {
      const errorData = { path: 'update', error: 'any', data: mockVehicle };
      listener.handleVehicleCreationError(errorData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error on vehicle service on update route: any',
        mockVehicle,
      );
    });

    it('should log error with ID and data when both are present', () => {
      const errorData = {
        path: 'remove',
        error: 'not found',
        id: 7,
        data: mockVehicle,
      };
      listener.handleVehicleCreationError(errorData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error on vehicle service on remove route: not found',
        7,
        mockVehicle,
      );
    });
  });
});
