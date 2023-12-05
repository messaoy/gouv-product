import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

interface Headers {
  [key: string]: string;
}

type GouvReposResponse =
    Endpoints['GET /repos/{owner}/{repo}']['response'];

export class OctokitUtils {
  private octokit: Octokit;

  private readonly headers: Headers;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
    this.headers = { 'X-GitHub-Api-Version': '2022-11-28' };
  }

  async getRequest(owner: string, repo: string, path: string): Promise<GouvReposResponse['data']> {
    const headers = this.headers;
    try {
      const response: GouvReposResponse = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits Mission Apprentissage:', error.message);
      throw error;
    }
  }
}
