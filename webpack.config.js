const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    background: './src/scripts/background.js',
    newTab: './src/scripts/newTab.js', // Add newTab.js as an entry point
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "src/manifest.json", to: "manifest.json" },
        {
          from: "src/scripts/lib",
          to: "scripts/lib"
        },
      ],
    }),
  ],
};