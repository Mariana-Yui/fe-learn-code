import { defineConfig } from 'rollup';
import babel from 'rollup-plugin-babel';
import ts from '@rollup/plugin-typescript';
// import ts from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import path from 'path';

export default defineConfig({
  input: './lib/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
    // {
    //   file: './dist/index.umd.js',
    //   format: 'umd',
    //   globals: {
    //     'html-webpack-plugin': 'HtmlWebpackPlugin',
    //   },
    //   name: pkg.name,
    // },
  ],
  external: ['html-webpack-plugin', 'ejs', 'html-minifier-terser', 'zip-a-folder', 'adm-zip'],
  plugins: [
    cleaner({
      targets: ['./dist'],
    }),
    json(),
    babel(),
    ts({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
    }),
    resolve(),
    commonjs({ transformMixedEsModules: true }),
  ],
});
