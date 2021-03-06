var express = require('express');
var resumable = require('./resumable-node.js')('tmp/');
var app = express();

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../src'));

app.use(express.bodyParser());

// Handle uploads through Resumable.js
app.post('/upload', function(req, res){
  resumable.post(req, function(status, filename, original_filename, identifier){
    console.log('POST', status, original_filename, identifier);
    res.send(200, {
      // NOTE: Uncomment this funciton to enable cross-domain request.
      //'Access-Control-Allow-Origin': '*'
    });
  });
});

// Handle cross-domain requests
// NOTE: Uncomment this funciton to enable cross-domain request.
/*
  app.options('/upload', function(req, res){
  console.log('OPTIONS');
  res.send(true, {
  'Access-Control-Allow-Origin': '*'
  }, 200);
  });
*/

// Handle status checks on chunks through Resumable.js
app.get('/upload', function(req, res){
  resumable.get(req, function(status, filename, original_filename, identifier){
    console.log('GET', status);
    res.send(200, (status == 'found' ? 200 : 404));
  });
});

app.get('/download/:identifier', function(req, res){
	resumable.write(req.params.identifier, res);
});

app.listen(3000);
