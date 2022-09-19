declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DB_USER: string;
    DB_PASS: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    MUX_TOKEN_ID: string;
    MUX_TOKEN_SECRET: string;
    NEXTAUTH_URL: string;
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    PWD: string;
  }
}