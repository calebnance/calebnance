var express = require('express');
var notifier = require('node-notifier');
var app = express();
var port = 8000;

var isProduction = process.env.NODE_ENV === 'production' ? true : false;
var distFolder = isProduction ? 'dist_prod' : 'dist_local';

app.use(express.static(`${__dirname}/${distFolder}`, {
  setHeaders: function (res) {
    res.append('Access-Control-Allow-Origin', '*');
  }
}));

app.listen(port, function () {
  console.log('Express server listening on port ' + port + '\n\nhttp://127.0.0.1:' + port + '\n');
});
