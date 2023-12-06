export interface Service {
  id: number;
  title: string;
  status: string;
  details: string;
  content: string;
}

export type ServiceFromApi = Omit<Service, 'id' | 'status' | 'details'> & {
  link: string;
};

export type StatusItem = {
  status: string;
  url: string;
};
