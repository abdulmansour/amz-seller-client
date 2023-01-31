const path = require('path');

module.exports = {
  stories: ['../src/components/**/*stories.@(ts|tsx|js|jsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    (config.resolve.alias['@utils'] = path.resolve(__dirname, '../utils')),
      (config.resolve.alias['@components'] = path.resolve(
        __dirname,
        '../src/components'
      ));
    return config;
  },
};
