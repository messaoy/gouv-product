import { arrayOfServices, decodeContentFromMdFile, cleanDetailsMdText, parseMDText } from '../utils/utils';
import { OctokitUtils } from '../utils/octokit.utils';
import dotenv from 'dotenv';
import { ServiceFactory } from '../factory/service.factory';
import { Service } from '../types/Service';

dotenv.config();

const statusRepoOwner = process.env.GITHUB_STATUS_REPO_OWNER ? process.env.GITHUB_STATUS_REPO_OWNER : '';
const statusRepo = process.env.GITHUB_STATUS_REPO ? process.env.GITHUB_STATUS_REPO : '';
const statusPath = process.env.GITHUB_STATUS_PATH ? process.env.GITHUB_STATUS_PATH : '';
export class ServiceService {
  private serviceFactory: ServiceFactory;

  constructor() {
    this.serviceFactory = new ServiceFactory();
  }

  async getAllServices(octokitUtils: OctokitUtils): Promise<Service[]> {

    const arrayOfServicesFromGitApi = await Promise.all(arrayOfServices.map(async (service) =>
      this.serviceFactory.getServiceFromGitApi(octokitUtils, service)));

    // On récupére la liste des status des services Mission Apprentissage sur le github
    const resultFromGitApi = await octokitUtils.getRequest(statusRepoOwner, statusRepo, statusPath);

    const arrayOfStatusFromGitApi = decodeContentFromMdFile(resultFromGitApi);

    // On croise les données pour récupérer le status des services voulus et construire notre réponse
    return arrayOfServicesFromGitApi.map((service, index) => {
      const status = this.serviceFactory.findServiceStatus(arrayOfStatusFromGitApi, service);

      // TODO: voir s'il n'est pas plus intéressant de split la chaine en un objet avec toutes les propriétés
      // Ici on modifie un peu le markdown et on le traduit pour avoir un meilleur affichage
      const { details, content } = parseMDText(service.content);

      return {
        id: index + 1, title: service.title, status, details: cleanDetailsMdText(details), content,
      };
    });
  }
}
