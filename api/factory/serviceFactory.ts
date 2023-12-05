import { OctokitUtils } from '../utils/octokit.utils';
import dotenv from 'dotenv';
import { ServiceFromApi } from '../types/Service';

dotenv.config();

const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO;
const path = process.env.GITHUB_REPO_PATH;

export class ServiceFactory {

  async getServiceFromGitHub(octokitUtils: OctokitUtils, service: string): Promise<ServiceFromApi> {
    const pathToFile = `${path}/${service}.md`;

    const response = await octokitUtils.getRequest(owner, repo, pathToFile);

    const decodedContent = Buffer.from(response.content, 'base64').toString('utf-8');
    // On récupere uniquement le nom du produit et l'url si ils existent
    const title = decodedContent.match(/title:\s*([^\n]*)/);
    const link = decodedContent.match(/link: *([^\n]*)/);

    return {
      title: title && title[1] ? title[1] : 'Non disponible',
      link: link && link[1] ? link[1] : 'Non disponible',
      content: decodedContent,
    };
  }

  findServiceStatus(arrayOfStatus: [{
    status: string;
    url: string }], service: ServiceFromApi): string {
    const data = arrayOfStatus.find(status => status.url === service.link
        || `${status.url}/` === service.link
        || status.url === `${service.link}/`);
    return data ? data.status : 'N/A';
  }
}
