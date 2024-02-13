// webpack.config.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mainConfig = {
  entry:  {
    main: './src/main/main.ts',
    preload: './src/main/preload.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'electron-main',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

const titleConfig = {
  entry:  {
    title: './src/title/title.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/title/title.html', to: 'title.html' }
      ]
    })
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
}

const stageSelectorConfig = {
  entry:  {
    stageSelector: './src/stageSelector/stageSelector.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/stageSelector/stageSelector.html', to: 'stageSelector.html' }
      ]
    })
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
};

const stageConfig = {
  entry:  {
    stage: './src/stage/stage.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  //target: 'electron-renderer',
  //target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/stage/stage.html', to: 'stage.html' }
      ]
    })
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
};

const howToPlayConfig = {
  entry:  {
    howToPlay: './src/howToPlay/howToPlay.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  //target: 'electron-renderer',
  //target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/howToPlay/howToPlay.html', to: 'howToPlay.html' }
      ]
    })
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
};

const documentConfig = {
  entry:  {
    document: './src/document/document.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  //target: 'electron-renderer',
  //target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/document/document.html', to: 'document.html' }
      ]
    })
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
};

module.exports = [mainConfig, titleConfig, stageSelectorConfig, stageConfig, howToPlayConfig, documentConfig];