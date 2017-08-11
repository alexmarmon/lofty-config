const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');

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

// handles '/url/path' page refreshes to /index.html - spa
app.get('*', function(req, res){
  res.sendFile(path.resolve('/prod/index.html'));
});

// start server
app.listen(port);

// export app for tests
module.exports = app;
