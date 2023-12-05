export interface Service {
  id: number;
  title: string;
  status: string;
  content: string;
}

export type ServiceFromApi = Omit<Service, 'id' | 'status'> & {
  link: string;
};
