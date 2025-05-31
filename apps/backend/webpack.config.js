const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      // additionalEntryPoints: [{ entryPath: './src/utils/pino-pretty.ts', entryName: 'pino-pretty' }],
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/assets',
        { glob: 'config.yaml', input: '../../', output: './' },
        { glob: 'pino-pretty.js', input: './src/utils', output: './' },
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
