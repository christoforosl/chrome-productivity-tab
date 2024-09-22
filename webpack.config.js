const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production build
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    // Add other entry points as needed
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "src/manifest.json", to: "manifest.json" },
      ],
    }),
  ],
};