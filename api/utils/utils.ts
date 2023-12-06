// TODO: voir s'il n'est pas plus intéressant de faire une recherche dynamique sur les fichiers MD pour les trouver
export const arrayOfServices: string[] = ['tdb-apprentissage', 'voeux-apprentissage', 'catalogue-apprentissage',
  'api.apprentissage', 'dematapprentissage',
  'uai_siret', 'la-bonne-alternance', 'boite.aux.lettres',
  'besoins.opco', 'prevention_ruptures_apprentissage'];

export const englishToFrench: {
  [key: string]: string;
} = {
  title: 'Nom du service',
  sponsors: 'Sponsorisé par',
  incubator: 'Portée par',
  link: 'Site web',
  repository: 'Code source',
  contact: 'Contact',
  stats_url: 'Site statistiques',
  true:'Présente',
  events: 'Evenements',
  phases: 'Etapes',
  name: 'Nom de l\'étape',
  start: 'Début',
  end: 'Fin',
  usertypes: 'Utilisateurs',
  etat: 'Etat',
  'etablissement-scolaire': 'Etablissement scolaire',
  dashlord_url: 'Url vers Dashlord',
  accessibility_status: 'Accessibilité',
  redirect_from: 'Rediriger depuis',
  'mission-apprentissage': 'Mission interministérielle pour l’apprentissage',
};

export const translateToFrench = (input: string, translations: {
  [key: string]: string;
}): string => {
  return Object.entries(translations).reduce((output, [englishWord, frenchWord]) => {
    const regex = new RegExp(`\\b${englishWord}\\b`, 'g');
    return output.replace(regex, frenchWord);
  }, input);
};

export const decodeContentFromMdFile = (content?: string): [{
  status: string;
  url: string }] =>{
  if (!content) {
    return [{
      status: 'n/a',
      url: 'n/a',
    }];
  }
  const decodedContent = Buffer.from(content, 'base64').toString('utf-8');
  if (!decodedContent || !decodedContent.length) {
    return [{
      status: 'n/a',
      url: 'n/a',
    }];
  }
  return JSON.parse(decodedContent);
};

export const parseMDText = (mdText: string): { details: string, content: string } => {
  // on cherche '---' après le premier caractère car c'est la deuxième occurence que l'on cherche pour couper le texte en deux
  const firstIndex = mdText.indexOf('---', 1 + 1);
  return { details: mdText.substring(0, firstIndex + 4), content: mdText.substring(firstIndex + 4) };
};

export const cleanDetailsMdText = (mdText: string): string => translateToFrench(mdText
  .replace(/(\w+):/g, '- $1:')
  .replace(/^- /gm, '- **')
  .replace(/: +/g, ':** ')
  .replace(/: ?\n |: ?\n- /g, ':**$&')
  .replace(/:\*\*:/g, ':**')
  .replace(/ - - /g, ' - **')
  .replace(/ {4}- /g, '    - **')
  .replace(/- /g, '- ')
  .replace(/\/organisations\//g, '')
  .replace(/- h/g, 'h')
  .replace(/"/g, '')
  .replace(/---/g, '')
  .replace(/>-/g, '')

  .replace(/(mission|stats):/g, (match, p1) => p1.charAt(0).toUpperCase() + p1.slice(1) + ':')
, englishToFrench);

export const getTitleFromDecodedContent = (decodedContent: string): string => {
  const title = decodedContent.match(/title:\s*([^\n]*)/);
  return title && title[1] ? title[1] : 'Non disponible';
};

export const getLinkFromDecodedContent = (decodedContent: string): string => {
  const link = decodedContent.match(/link: *([^\n]*)/);
  return link && link[1] ? link[1] : 'Non disponible';
};
