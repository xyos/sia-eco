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

/* eslint max-len: 0 */
firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'nodos-92480',
    clientEmail: 'firebase-adminsdk-rjeve@nodos-92480.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.DB_KEY}SCBKcwggSjAgEAAoIBAQC8QMfxM0VsmknO\nMStVln0OYcg0qHzS2vIkpnPUe79edeyWPS/PUv1K+Qx75oKxnUVNwaDJM3oqyNHn\nBUAhKyIDUPBotxEtKI36wXDMDcFGCCbdXmwmd+ofm6jFngtTTGL6AfoK4mWGrM5V\nmsYKW62doKunHYqaOqRCocogrFWfca8DxUo9JDLxzDbI5KChbjGTv+AX3txzSf8G\n+6KsXCZ4dpw7VDYg4aK36cK0KqtxRk2FNK6e6H8URMhgSo/9uknI3fRycTrlZt2t\nMFWPvyffp2CKVLo3RoxjmMx3OR7dwfeTyCv9vAvsp1Rfl+y8ke3cvrJjcbfXSUqO\nPdZ/ATc7AgMBAAECggEAZb1xEadO/unHt5sVO3VQcuRfyi3BAEf6E9qtwQl8HHYI\n/g1leFv2rn04xQGIYquHmAVsezDJ9rN/1aYdyY9BG5+zvjQqIUjIqtu+tVk9ujaP\nopX0RzoJmzmKFftbTZJ773gABb/jdMyR2uwB2flANG9wNaoejUniGmzMC6p3v+pH\nQlxaXSqKD6byGp60incyTq437EEiT2AHmNEZ2NTjGOkonuBGCsZp3K0cp81W0gTm\nPrv+8b3sF3KQk6tEJaXXO0dsRxw6qHfPO3g1Rb36FM/Qg+kIHI/uAugJ+CUDGGSv\n40tGtjOev6leeool1TMg2ycu2BZ5HYQjh+UNIKuqoQKBgQDzqPLNJWms7yYDQwnB\nAMYdeuY863xLkZZriKeadyUuxTXA7U4KsfKA6CydREL3XadOxdcmzAFiA1DiPmQp\n0ffakAiGPnizhrN93wUwhvc2/YNP6DriRVcAeDcmob8IxvHf+Cn0DmJqgr5Rwhs9\ngIiGLezOwonq3zsNPeYLhJMJMQKBgQDFyXtlaSoannGKpGafAMBjGO0ElBan64k2\n5lZ/yM63A2K6tRQIeOmP5ZarpI1YPtDxucp/ov2uB9zZdeFmGWphKcQuV4cZF0l7\nhZO0CwjGdTvXiTCtBbfCMaKIQ4i8N1qS9PsaNgGceaE1aZvgd640ahONqrYUVgAN\nE1YhXc5sKwKBgQDcxNNZtPBO1FBo3DDWQtE+nMBHqkXwYnUb8bGKbzGtctoFd/4i\nCqFi0vq5c8QJRT32TaNnb6hBGigLFeTDT4925NIUcD4Ey6OOBKg7E86icIitugjA\nQ3tU3Zd61Uq1tSwqdjvs+auKPfQbN/hefTs1+B58KB+2Q5TJpq/s964RwQKBgDNi\nLr6f3aJgu1qrb0Wrqk+UcC8aUfB6DoHGwX4dKyb8qC+dT4EL+JG7sbMR4u6kEyBZ\nhjQ2ofUOcd/E8jPWMn7fnOn1L1HjbOG8SC0kGLmGR2+tYonwzFaVEoaYFPPg5ZT8\nNCgRE8YVCz6XGznrncRcMoxBZ2BNH2JGPcAZYMFVAoGAZ0oblReT8QkU3OiF3wnM\n3C5K5cJrjDCQRqIRH4TRa9sSNMrpnkgmcHZuIDYKcXrF0MXfNuY9Sy1QTkqgRDLQ\nj1Z6MjNEh9Rc9szu9aIJsiSyRwUX1Mu7FDzCH/wdCDDICtk9t/2Yc2xOr1Z7/xFX\nwCKMZwun++SH6dPzwD0KUvQ=\n-----END PRIVATE KEY-----`
  }),
  databaseURL: 'https://nodos-92480.firebaseio.com/'
});
/* eslint max-len: 0 */

const database = firebase.database();
const session = database.ref('sia-eco/').child('session');

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
  session.push({
    date: new Date(),
    requests_count: count
  });
});
