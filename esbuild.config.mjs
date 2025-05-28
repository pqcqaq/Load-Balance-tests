import { build } from 'esbuild';
import glob from 'fast-glob';

const entryPoints = await glob(['src/**/*.ts']);

await build({
  entryPoints,
  outdir: 'dist',
  bundle: false,
  format: 'esm',
  platform: 'node',
  target: ['node20'],
  splitting: true,
  sourcemap: true,
  outbase: 'src',
  tsconfig: 'tsconfig.json',
});

console.log('Build completed.');
