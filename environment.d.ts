declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    MUX_TOKEN_ID: string;
    MUX_TOKEN_SECRET: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string; // this is the line you want
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    PWD: string;
  }
}
