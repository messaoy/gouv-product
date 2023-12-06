import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OctokitUtils } from '../utils/octokit.utils';
import { ServiceFactory } from '../factory/service.factory';
import { ServiceFromApi, StatusItem } from '../types/Service';
import * as utils from '../utils/utils';

jest.mock('../utils/utils', () => {
  return {
    getTitleFromDecodedContent: jest.fn<() => string>().mockReturnValue('Mon service'),
    getLinkFromDecodedContent: jest.fn<() => string>().mockReturnValue('https://test.com'),
  };
});
jest.mock('../utils/octokit.utils', () => {
  return {
    OctokitUtils: jest.fn<() => unknown>().mockReturnValue({
      getRequest: jest.fn<() => Promise<string>>().mockResolvedValue('dGl0bGU6IE1vbiBzZXJ2aWNlCmxpbms6IGh0dHBzOi8vdGVzdC5jb20='),
    }),
  };
});
describe('Service Factory', () => {
  let serviceFactory: ServiceFactory;
  let octokitUtils: OctokitUtils;
  const service = 'service';

  beforeEach(() => {
    serviceFactory = new ServiceFactory();
    octokitUtils = new OctokitUtils('auth');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getServiceFromGitApi', () => {
    it('should call getRequest once and return a service from GitApi', async () => {
      const content = 'title: Mon service\nlink: https://test.com';

      const result: ServiceFromApi = await serviceFactory.getServiceFromGitApi(
        octokitUtils,
        service,
      );

      const spy1 = jest.spyOn(utils, 'getTitleFromDecodedContent').mockReturnValue('Mon service');
      const spy2 = jest.spyOn(utils, 'getLinkFromDecodedContent').mockReturnValue('https://test.com');

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(octokitUtils.getRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        title: 'Mon service',
        link: 'https://test.com',
        content,
      } as ServiceFromApi);
    });

  });

  describe('findServiceStatus', () => {
    it('should return n/a if service link value is "Non disponible"', () => {
      const arrayOfStatus = [
        { status: 'up', url: 'https://test.com' },
        { status: 'down', url: 'https://test-test.com' },
      ]  ;

      const serviceTest = { title: 'Service Test', link: 'Non disponible', content: 'Test content' };

      const result = serviceFactory.findServiceStatus(arrayOfStatus, serviceTest);

      expect(result).toBe('n/a');
    });

    it('should return the right status based on url', () => {
      const arrayOfStatus = [
        { status: 'up', url: 'https://test.com' },
        { status: 'down', url: 'https://testtest.com' },
      ] as StatusItem[];

      const serviceTest = { title: 'Service Test', link: 'https://test.com', content: 'Test content' } as ServiceFromApi;

      const result = serviceFactory.findServiceStatus(arrayOfStatus, serviceTest);

      expect(result).toBe('up');
    });
  });
});
