/**
 * @file esbuild 配置
 * @author Yangholmes 2023-05-28
 */

import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.mjs',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  loader: {
    '.env': 'text'
  },
  alias: {
    '@': './src'
  }
});
