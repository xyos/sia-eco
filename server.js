var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch')
var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 80));

app.get('/buscador/JSON-RPC', function(req, res, next) {
  res.jsonp({ error: 'nope :(' });
});

app.post('/buscador/JSON-RPC', function(req, res, next) {
  fetchSIA(JSON.stringify(req.body.query), req.body.host, (json, err) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (!err) {
      res.jsonp(json);
    } else {
      res.jsonp({ error: err });
    }
  });
});

function fetchSIA(query, host, callback) {
  fetch(`http://${host}/buscador/JSON-RPC`, { method: 'POST', body: query }).then(res => {
    res.json().then(json => callback(json, null)).catch(err => callback(null, err));
  }).catch(err => callback(null, err));
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});