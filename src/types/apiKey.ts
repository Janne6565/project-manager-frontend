export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  active: boolean;
}

export interface GeneratedApiKey {
  id: string;
  name: string;
  prefix: string;
  key: string;
  createdAt: string;
}
