import { defineConfig } from "rollup";
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json';
import pkg from './package.json' assert {type: 'json'};

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'es',
      file: pkg.module,
    }
  ],
  plugins: [
    esbuild({
      tsconfig: './tsconfig.json',
      minify: false,
    }),
    json(),
  ]
})