import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './core/openapi/api-docs.json',
    output: {
      mode: 'tags-split', // one file per tag (basicAuth, subscription, etc.)
      target: './core/api/generated',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './core/api/axios.ts',
          name: 'axiosInstanceMutator',
        },
      },
    },
  },
});
