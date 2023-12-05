import { arrayOfServices, decodeContentFromMd, englishToFrench, replaceWordsWithFrench } from '../utils/utils';
import { OctokitUtils } from '../utils/octokit.utils';
import dotenv from 'dotenv';
import { ServiceFactory } from '../factory/serviceFactory';
import { Service } from '../types/Service';

dotenv.config();

const statusRepoOwner = process.env.GITHUB_STATUS_REPO_OWNER;
const statusRepo = process.env.GITHUB_STATUS_REPO;
const statusPath = process.env.GITHUB_STATUS_PATH;
export class ServiceService {
  private serviceFactory: ServiceFactory;

  constructor() {
    this.serviceFactory = new ServiceFactory();
  }

  async getAllServices(octokitUtils: OctokitUtils): Promise<Service[]> {

    // On récupére la liste des produits Mission Apprentissage sur le github
    const arrayOfServicesFromApi = await Promise.all(arrayOfServices.map(async (service) =>
      this.serviceFactory.getServiceFromGitHub(octokitUtils, service)));

    // On récupére la liste des status des services Mission Apprentissage sur le github
    const resultFromApi = await octokitUtils.getRequest(statusRepoOwner, statusRepo, statusPath);

    const arrayOfStatusFromApi = decodeContentFromMd(resultFromApi.content);

    // On croise les données pour récupérer le status des services voulus et construire notre réponse
    return arrayOfServicesFromApi.map((service, index) => {
      const status = this.serviceFactory.findServiceStatus(arrayOfStatusFromApi, service);
      // Ici on modifie un peu le markdown et on le traduit pour avoir un meilleur affichage
      const content = replaceWordsWithFrench(service.content.replace(/(\w+):/g, '- $1:'), englishToFrench);
      return {
        id: index + 1, title: service.title, status, content,
      };
    });
  }
}
