const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const router = require(path.resolve('./src/api/router'));

// get port
const port = parseInt(process.env.PORT);

// create express instance
const app = express();

// use body parser for api requests
app.use(bodyParser.json());

// compress files before sending
app.use(compress());

// serve prod folder at '/'
app.use(express.static('prod'));

// serve static folder
app.use('/static', express.static('static'));

// server fonts
app.use('/fonts', express.static('./src/shared_styles/fonts/'))

// serve api
app.use('/api', router);

// handles '/url/path' page refreshes to /index.html - spa
app.get('*', function(req, res){
  res.sendFile(path.resolve('./prod/index.html'));
});

// start server
app.listen(port);

// export app for tests
module.exports = app;
