import { OctokitUtils } from '../utils/octokit.utils';
import { ServiceService } from '../service/serviceService';
import { Request, Response } from 'express';
import { Service } from '../types/Service';

const auth = process.env.GITHUB_AUTH;
export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  async getAllServices(req: Request, res: Response): Promise<Service[]> {
    try {
      const octokitUtils = new OctokitUtils(auth);
      const formattedData = await this.serviceService.getAllServices(octokitUtils);
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).send('Une erreur est survenue lors de la récupération des services Mission Apprentissage ');
    }
  }
}
