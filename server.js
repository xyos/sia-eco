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
const firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'nodos-92480',
    clientEmail: 'firebase-adminsdk-rjeve@nodos-92480.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.DB_KEY}\n-----END PRIVATE KEY-----\n`
  }),
  databaseURL: 'https://nodos-92480.firebaseio.com/'
});

const database = firebase.database();
const ref = database.ref('sia-eco/');
const usersRef = ref.child('session');

let count = 0; /* Count requests */

/* ================= Request SIA API ================= */
const fetchSIA = (query, host, callback) => {
  fetch(`http://${host}/buscador/JSON-RPC`, { method: 'POST', body: query }).then(res => {
    res.json().then(json => callback(json, null)).catch(err => callback(null, err));
  }).catch(err => callback(null, err));
};

/* ================= Express Server ================= */
const app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 80);

// Handle HTTP request and return JSONP with contact
app.get('*', (req, res) => {
  res.jsonp({ contact: 'giacostaj@unal.edu.co' });
});

// Handle POST in url ".../eco" and then request with the POST query
app.post('/eco', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); /* Disable CORS */
  fetchSIA(req.body.query, req.body.host, (json, err) => {
    if (err === null) {
      res.jsonp(json);
      console.log(`SIA-REQUEST ${count++} ${req.body.id} ${req.body.host} OK`);
    } else {
      res.jsonp({ error: err });
      console.log(`SIA-REQUEST ${count++} ${req.body.id} ${req.body.host} `, err);
    }
  });
});

app.listen(app.get('port'), () => {
  console.log('SIA Eco is running on port', app.get('port'));
});

process.on('exit', () => {
  usersRef.push({
    date: new Date(),
    requests_count: count
  });
});
