/**
 * @file esbuild 配置
 * @author Yangholmes 2023-05-28
 */

import * as esbuild from 'esbuild';

const result = await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  loader: {
    '.env': 'text'
  },
  alias: {
    '@': './src'
  },
  // optimization
  drop: [
    // 'console',
    'debugger'
  ],
  minify: true,
  treeShaking: true,

  metafile: true,
});

console.log(await esbuild.analyzeMetafile(result.metafile, {
  verbose: true,
}));
