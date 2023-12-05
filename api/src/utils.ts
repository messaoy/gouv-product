export const arrayOfServices: string[] = ['tdb-apprentissage', 'voeux-apprentissage', 'catalogue-apprentissage',
    'api.apprentissage', 'dematapprentissage',
    'uai_siret', 'la-bonne-alternance', 'boite.aux.lettres',
    'besoins.opco', 'prevention_ruptures_apprentissage']

export const englishToFrench = {
    title: 'Nom du service',
    sponsors: 'Sponsors',
    incubator: 'Incubateur',
    link: 'Lien vers le service',
    repository: 'Code source',
    contact: 'Contact',
    stats_url: 'Lien vers les statistiques',
    'stats:': 'Statistiques d\'usage',
    true:'Présente',
    events: 'Evenements',
    phases: 'Etapes',
    name: 'Nom de l\'étape',
    start: 'Début',
    end: 'Fin',
    usertypes: 'Type d\'utilisateurs',
    etat: 'Etat',
    'etablissement-scolaire': 'Etablissement scolaire',
    dashlord_url: 'Url vers Dashlord',
    accessibility_status: 'Accessibilité',
    redirect_from: 'Rediriger depuis'

};

export const replaceWordsWithFrench = (input, translations) => {
    return Object.entries(translations).reduce((output, [englishWord, frenchWord]) => {
        const regex = new RegExp(`\\b${englishWord}\\b`, 'g');
        return output.replace(regex, frenchWord);
    }, input);
};
