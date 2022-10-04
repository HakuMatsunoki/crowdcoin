const webpack = require('webpack');

const { parsed } = require('dotenv').config({ path: './config.env' });

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(parsed));
    return config;
  },
};
