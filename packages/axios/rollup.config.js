import createConfigs from '../../config/rollup';

export default createConfigs({
  path: __dirname,
  external: ['axios'],
  globals: {axios: 'axios'},
  exports: 'auto'
});
