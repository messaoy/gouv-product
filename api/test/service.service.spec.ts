import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OctokitUtils } from '../utils/octokit.utils';
import { Service, ServiceFromApi } from '../types/Service';
import { ServiceService } from '../service/service.service';
import * as utils from '../utils/utils';

jest.mock('../utils/utils', () => {
  return {
    arrayOfServices: ['tdb-apprentissage', 'voeux-apprentissage'],
    parseMDText: jest.fn<() => string>().mockReturnValue('Mon service'),
    cleanDetailsMdText: jest.fn<() => string>().mockReturnValue('https://test.com'),
    decodeContentFromMdFile: jest.fn<() => string>().mockReturnValue('https://test.com'),
  };
});

jest.mock('../factory/service.factory', () => {
  return {
    ServiceFactory: jest.fn<() => unknown>().mockReturnValue({
      getServiceFromGitApi: jest.fn<() => Promise<ServiceFromApi>>().mockResolvedValue({
        id: 1,
        title: 'Mon service',
        content: 'Mon content',
        link: 'https://test.com',
      } as ServiceFromApi),
      findServiceStatus: jest.fn<() => string>().mockReturnValue('up'),
    }) };
});
jest.mock('../utils/octokit.utils', () => {
  return {
    OctokitUtils: jest.fn<() => unknown>().mockReturnValue({
      getRequest: jest.fn<() => Promise<string>>().mockResolvedValue('dGl0bGU6IE1vbiBzZXJ2aWNlCmxpbms6IGh0dHBzOi8vdGVzdC5jb20='),
    }),
  };
});
describe('Service Service', () => {
  let serviceService: ServiceService;
  let octokitUtils: OctokitUtils;

  beforeEach(() => {
    octokitUtils = new OctokitUtils('auth');
    serviceService = new ServiceService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllServices', () => {
    it('should call getRequest once and use factory to return a list of service', async () => {
      const details = 'sponsors: mfj';
      const content = 'title: Mon service\nlink: https://test.com';

      const result: Service[] = await serviceService.getAllServices(
        octokitUtils,
      );

      const spy1 = jest.spyOn(utils, 'parseMDText').mockReturnValue({ details, content   });
      const spy2 = jest.spyOn(utils, 'cleanDetailsMdText').mockReturnValue(details);
      const spy3 = jest.spyOn(utils, 'decodeContentFromMdFile').mockReturnValue([{ status: 'up', url: 'https://test.com' }]);

      // 2x car deux elements dans notre tableau
      expect(spy1).toHaveBeenCalledTimes(2);
      expect(spy2).toHaveBeenCalledTimes(2);
      expect(spy3).toHaveBeenCalledTimes(1);
      expect(octokitUtils.getRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
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
      ] as Service[]);
    });
  });
});
