export interface Environment {
  NODE_ENV: 'localhost' | 'production' | 'test';
  api: string;

  auth: {
    user: string;
    password: string;
  };
}
