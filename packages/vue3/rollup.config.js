import createConfigs from '../../config/rollup';

export default createConfigs({
  path: __dirname,
  external: ['vue'],
  globals: {vue: 'Vue'}
});
