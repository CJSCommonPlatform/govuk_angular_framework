// Karma configuration file
var path = require('path')

// Helper functions
var _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

module.exports = function (karma) {
  karma.set({
    frameworks: ['jasmine'],
    exclude: [],
    files: [
      {pattern: './test/spec.bundle.js'}
    ],
    preprocessors: {
      './test/spec.bundle.js': ['webpack', 'sourcemap']
    },
    port: 9876,
    colors: true,
    logLevel: karma.LOG_INFO,
    autoWatch: false,
    browsers: [
      'PhantomJS'
    ],
    singleRun: true,
    webpackServer: {
      noInfo: true
    },
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['', '.ts', '.js'],
        root: root('./src')
      },
      module: {
        preLoaders: [
          {test: /\.ts$/, loader: 'tslint', exclude: 'node_modules'},
          {test: /\.js$/, loader: 'source-map'}
        ],
        loaders: [
          {
            test: /\.ts$/,
            loader: 'awesome-typescript'
          }
        ]
      },
      tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'src'
      }
    }
  });
};