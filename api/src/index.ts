import express, { Express, Request, Response } from 'express';
import { Octokit } from "@octokit/core";
import dotenv from 'dotenv';
import {arrayOfServices, englishToFrench, replaceWordsWithFrench} from './utils';

dotenv.config();
const app: Express = express();
const cors = require('cors');
const port = process.env.PORT;

const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO;
const path = process.env.GITHUB_REPO_PATH;
const auth = process.env.GITHUB_AUTH;

const statusRepoOwner = process.env.GITHUB_STATUS_REPO_OWNER;
const statusRepo = process.env.GITHUB_STATUS_REPO;
const statusPath = process.env.GITHUB_STATUS_PATH;

const headers = { 'X-GitHub-Api-Version': '2022-11-28' };

app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  try {
      const octokit = new Octokit({
          auth,
      })

      const arrayOfServicesFromApi = await Promise.all(arrayOfServices.map(async (service) => {
          const pathToFile = `${path}/${service}.md`;

          // On récupére la liste des produits Mission Apprentissage sur le github
          const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
              owner,
              repo,
              path: pathToFile,
              headers,
          })

          // On récupere uniquement le nom du produit et l'url si ils existent
          const decodedContent = Buffer.from(result.data.content, 'base64').toString('utf-8');
          const title = decodedContent.match(/title:\s*([^\n]*)/);
          const link = decodedContent.match(/link: *([^\n]*)/);

          return { title: title && title[1] ? title[1] : 'Non disponible', link: link && link[1] ? link[1] : 'Non disponible', content: decodedContent };
      }));

      const resultFromApi = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
              owner: statusRepoOwner,
              repo: statusRepo,
              path: statusPath,
              headers,
          })

      const decodedContent = Buffer.from(resultFromApi.data.content, 'base64').toString('utf-8');
      const arrayOfStatusFromApi = JSON.parse(decodedContent);


      // On cherche le status du site de chaque service
      const formattedData = arrayOfServicesFromApi.map((service, index) => {
          const data = arrayOfStatusFromApi.find(status => status.url === service.link
              || `${status.url}/` === service.link
              || status.url === `${service.link}/`)
          const status =  data ? data.status : "N/A";

          // Ici on modifie un peu le markdown et on le traduit pour avoir un meilleur affichage
          const content = replaceWordsWithFrench(service.content.replace(/(\w+):/g, '- $1:'), englishToFrench)

          return { id: index + 1, title: service.title, status, slug: data && data.slug ? data.slug : '',
              content};
      });

      res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).send('Une erreur est survenue lors de la récupération des services Mission Apprentissage ');
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
