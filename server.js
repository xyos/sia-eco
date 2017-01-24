var express = require('express');
var app = express();
var http = require('http');

app.set('port', (process.env.PORT || 5000));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
  postSIA(res);
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

function postSIA(response) {

    var post_data = JSON.stringify({ method: 'buscador.obtenerAsignaturas', params: [
          '',
          'PRE',
          'p',
          'PRE',
          '2509',
          '',
          1,
          3
        ] });
    // An object of options to indicate where to post to
    var post_options = {
        host: 'sia.bogota.unal.edu.co',
        port: '80',
        path: '/buscador/JSON-RPC',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log(chunk);
            response.jsonp(JSON.parse(chunk));
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});