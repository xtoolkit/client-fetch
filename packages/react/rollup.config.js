import createConfigs from '../../config/rollup';

export default createConfigs({
  path: __dirname,
  external: ['react'],
  globals: {react: 'react'}
});
