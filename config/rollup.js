import fs from 'fs';
import {resolve, basename} from 'path';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import ts from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import originPkg from '../package.json';

export default function (config) {
  config.path = resolve(config.path);
  const name = basename(config.path);
  const getPath = x => resolve(config.path, x);
  const pkg = require(getPath('package.json'));

  fs.rmSync(getPath('dist'), {recursive: true, force: true});

  const banner = `/*!
  * ${pkg.name} v${originPkg.version}
  * @license MIT
  */`;

  const commonInput = {
    input: getPath('src/index.ts'),
    external: config.external,
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': `'${config.env}'`
        }
      }),
      commonjs()
    ]
  };

  const commonOutput = {
    banner,
    globals: config.globals,
    exports: config.exports
  };

  return [
    {
      file: getPath('dist/index.d.ts'),
      format: 'es',
      dts: true
    },
    {
      file: getPath('dist/index.esm-bundler.js'),
      format: 'esm',
      target: 'es2015'
    },
    {
      file: getPath('dist/index.cjs.js'),
      format: 'cjs',
      target: 'es2015'
    },
    {
      file: getPath('dist/index.global.js'),
      format: 'iife',
      name: name.toLowerCase() + 'ClientApi',
      target: 'es5'
    },
    {
      file: getPath('dist/index.global.min.js'),
      format: 'iife',
      name: name.toLowerCase() + 'ClientApi',
      target: 'es5',
      minify: true
    }
  ].map(x => createConfigs(x, commonInput, commonOutput));
}

function createConfigs(config, commonInput, commonOutput) {
  let plugins = [];
  if (config.dts) {
    plugins.push(dts());
  } else {
    plugins = [...commonInput.plugins];
    plugins.push(
      ts({
        check: false,
        tsconfigOverride: {
          compilerOptions: {
            target: config.target
          }
        },
        exclude: ['node_modules']
      })
    );
    if (config.minify) {
      plugins.push(
        terser({
          compress: {
            ecma: 5,
            pure_getters: true
          },
          format: {
            comments: false
          }
        })
      );
    }
  }
  return {
    input: commonInput.input,
    external: commonInput.external,
    output: {
      file: config.file,
      format: config.format,
      name: config.name,
      ...commonOutput
    },
    plugins
  };
}
