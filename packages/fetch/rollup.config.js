import createConfigs from '../../config/rollup';

export default createConfigs({
  path: __dirname,
  external: ['cross-fetch'],
  globals: {'cross-fetch': 'fetch'},
  exports: 'default'
});
