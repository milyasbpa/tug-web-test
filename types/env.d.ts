// Type-safe environment variables.
declare namespace NodeJS {
  interface ProcessEnv {
    // Public — exposed to browser
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
    /** Production domain used for metadataBase and robots.txt. E.g. https://myapp.com */
    NEXT_PUBLIC_APP_URL?: string;

    // Server-only
    DATABASE_URL?: string;
  }
}
