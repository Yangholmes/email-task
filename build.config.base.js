/**
 * @file build.config.base.js
 * @author Yangholmes 2025-03-12
 */

export const baseConfig = {
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
  // drop: [
  //   'console',
  //   'debugger'
  // ],
  // minify: true,
  // treeShaking: true,

  // metafile: true,
};
