const webpack = require('webpack');
const path = require('path');
const chokidar = require('chokidar');
const WebpackDevServer = require('webpack-dev-server');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser')

let config;

const app = express();

// use config depending on role
if (process.env.FRAMEWORK === 'react') {
  config = require('./react/webpack.dev.js');
} else if (process.env.FRAMEWORK === 'vue') {
  config = require('./vue/webpack.dev.js');
}

// if (process.env.AUTH) {
//   const auth = require('@lofty/lofty-auth/src/components/auth-router/auth-router')(app);
// }

// Use router for API calls
app.use('/api', function(req, res, next) {
  require(path.resolve('./src/api/router'))(req, res, next);
});

// Development Server - Hot Reload w/ WebpackDevServer & api proxy
if (process.env.npm_lifecycle_event === 'dev') {
  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    quiet: true,
    // Create proxy for API with DevServer
    proxy: {
      '/api/*': 'http://localhost:' + (parseInt(process.env.PORT) + 30),
      '/user/*': 'http://localhost:' + (parseInt(process.env.PORT) + 30),
    },
  }).listen(parseInt(process.env.PORT), 'localhost', (err) => {
    if (err) { console.log(err); }
  });
  app.use(bodyParser.json());
  app.listen(parseInt(process.env.PORT) + 30);

  // listen for changes to files in /api/
  const watcher = chokidar.watch(path.resolve('./src/api/'));
  watcher.on('ready', function() {
    watcher.on('all', function() {
      // clear require cache and re require new files after change
      console.log("Updated backend");
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]src\/api[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
} else {
  // Production Server
  app.use(bodyParser.json());
  app.use(compress());
  app.use(express.static('prod'));
  app.use('/static', express.static('static'));
  app.get('*', function(req, res){
    res.sendFile(__dirname + path.resolve('/prod/index.html'));
  });
  app.listen(parseInt(process.env.PORT));
}

module.exports = app;
