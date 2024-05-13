const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const serverless = require('serverless-webpack');

const isLocal = serverless.lib.webpack.isLocal;

console.log('isLocal: ', isLocal);

module.exports = {
  mode:  isLocal ? 'development' : 'production',
  entry: serverless.lib.entries,
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: isLocal ? './.env.local' : './.env',
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@database': path.resolve(__dirname, './database/'),
      '@services': path.resolve(__dirname, './services/'),
    },
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    cacheDirectory: path.resolve('.webpackCache'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};