/**
 * @file esbuild dev 配置
 * @author Yangholmes 2025-03-12
 */

import * as esbuild from 'esbuild';
import { baseConfig } from './build.config.base.js';

const result = await esbuild.build({
  ...baseConfig,
});

console.log(result);
