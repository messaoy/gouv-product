import express, { Request, Response } from 'express';
import { ServiceController } from '../controller/service.controller';
import { Service } from '../types/Service';

export const serviceRouter = express.Router();
const serviceController = new ServiceController();

serviceRouter.get('/', async (req: Request, res: Response): Promise<Service[]> => serviceController.getAllServices(req, res));
