import { OctokitUtils } from '../utils/octokit.utils';
import dotenv from 'dotenv';
import { ServiceFromApi, StatusItem } from '../types/Service';
import { getLinkFromDecodedContent, getTitleFromDecodedContent } from '../utils/utils';

dotenv.config();

export class ServiceFactory {
  private readonly owner: string;

  private readonly repo: string;

  private readonly path: string;

  constructor() {
    this.owner = process.env.GITHUB_REPO_OWNER ? process.env.GITHUB_REPO_OWNER : '';
    this.repo = process.env.GITHUB_REPO ? process.env.GITHUB_REPO : '';
    this.path = process.env.GITHUB_REPO_PATH ? process.env.GITHUB_REPO_PATH : '';
  }

  async getServiceFromGitApi(octokitUtils: OctokitUtils, service: string): Promise<ServiceFromApi> {
    const pathToFile = `${this.path}/${service}.md`;

    const content = await octokitUtils.getRequest(this.owner, this.repo, pathToFile);

    const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

    return {
      title: getTitleFromDecodedContent(decodedContent),
      link: getLinkFromDecodedContent(decodedContent),
      content: decodedContent,
    };
  }

  findServiceStatus(arrayOfStatus: StatusItem[], service: ServiceFromApi): string {
    if (service.link === 'Non disponible') {
      return 'n/a';
    }
    const data = arrayOfStatus.find((status) => status.url === service.link
        || `${status.url}/` === service.link
        || status.url === `${service.link}/`);
    return data ? data.status : 'n/a';
  }
}
