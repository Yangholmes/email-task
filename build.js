/**
 * @file esbuild 配置
 * @author Yangholmes 2023-05-28
 */

import * as esbuild from 'esbuild';
import { baseConfig } from './build.config.base.js';

const result = await esbuild.build({
  ...baseConfig,
  // optimization
  drop: [
    'console',
    'debugger'
  ],
  minify: true,
  treeShaking: true,

  metafile: true,
});

console.log(await esbuild.analyzeMetafile(result.metafile, {
  verbose: true,
}));
