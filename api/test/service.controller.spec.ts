import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OctokitUtils } from '../utils/octokit.utils';
import { Service } from '../types/Service';
import { ServiceController } from '../controller/service.controller';
import { Request, Response } from 'express';

const listOfServices =
    [
      {
        'details': 'https://test.com',
        'id': 1,
        'status': 'up',
        'title': 'Mon service',
      },
      {
        'details': 'https://test.com',
        'id': 2,
        'status': 'up',
        'title': 'Mon service',
      },
    ] as Service[];
jest.mock('../service/service.service', () => {
  return {
    ServiceService: jest.fn<() => unknown>().mockReturnValue({
      getAllServices: jest.fn<() => Promise<Service[]>>().mockResolvedValue(
        [
          {
            'details': 'https://test.com',
            'id': 1,
            'status': 'up',
            'title': 'Mon service',
          },
          {
            'details': 'https://test.com',
            'id': 2,
            'status': 'up',
            'title': 'Mon service',
          },
        ] as Service[],
      ) }) };
});
jest.mock('../utils/octokit.utils', () => {
  return {
    OctokitUtils: jest.fn<() => unknown>().mockReturnValue({}),
  };
});
describe('Service Controller', () => {
  let serviceController: ServiceController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let octokitUtils: OctokitUtils;

  beforeEach(() => {
    octokitUtils = new OctokitUtils('auth');
    serviceController = new ServiceController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllServices', () => {
    it('should create a new instance of Octokit and use serviceService to return a list of services', async () => {
      const req = {} as Request;
      const res = {
        json: jest.fn<() => Promise<Service[]>>().mockResolvedValue(listOfServices),
        status: jest.fn<() => Response>().mockReturnThis(),
      } as unknown as Response;

      const result = await serviceController.getAllServices(req, res);

      expect(result).toEqual(listOfServices);
    });
  });
});
