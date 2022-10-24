declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    MUX_TOKEN_ID: string;
    MUX_TOKEN_SECRET: string;
    MUX_WEBHOOK_SECRET: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    PWD: string;
  }
}