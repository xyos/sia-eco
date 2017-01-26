/**
 * SIA Eco
 *
 * Copyright © 2015-2017 gioacostax. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

let count = 0; /* Count requests */

/* ================= Request SIA API ================= */
const fetchSIA = (query, host, callback) => {
  fetch(`http://${host}/buscador/JSON-RPC`, { method: 'POST', body: query }).then(res => {
    res.json().then(json => callback(json, null)).catch(err => callback(null, err));
  }).catch(err => callback(null, err));
}

/* ================= Express Server ================= */
const app = express();

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 80));

// Handle HTTP request and return JSONP with contact
app.get('*', (req, res, next) => {
  res.jsonp({ contact: 'giacostaj@unal.edu.co' });
});

// Handle POST in url ".../eco" and then request with the POST query
app.post('/eco', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); /* Disable CORS */
  fetchSIA(req.body.query, req.body.host, (json, err) => {
    if (!err) {
      res.jsonp(json);
      console.log(`REQUEST[${count++}][${req.connection.remoteAddress}][${req.body.host}]: OK`);
    } else {
      res.jsonp({ error: err });
      console.log(`REQUEST[${count++}][${req.connection.remoteAddress}][${req.body.host}]: `, err);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('SIA Eco is running on port', app.get('port'));
});