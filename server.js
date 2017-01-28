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

/* Date Now as YYYY-MM-DD */
const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;

/* eslint max-len: 0 */
firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'sia-eco',
    clientEmail: 'firebase-adminsdk-2t0zb@sia-eco.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.DB_KEY}SCBKcwggSjAgEAAoIBAQDFVaXDqGUtdGNp\nwrXTGv4JL51VQktA2FFjIZDMS3UT0iGC2aO+UHm/cGKBctNpyOc2CLk4u4kXAMoZ\nBLMb6GbI7Nbwt8dhJxUUVRdfH+Q4/uBFLOfo2H8W/Gxo099wB3jRZDdV5boWimq+\nh0MNa/qGUqRQaC26e4uxKmhM6nLx1oSAOrNmLHBYcMhOz3qgB+l9SCD3MRUa1epP\nC5Wvt/FVLZ1JN8l3xmc+rjSNfSEeTLp/dDPpcQ8znCk1bqbS/9gqKLcyZg8WgHzg\nt75A6br8Yzu8j+nD+pofzKcVowrlsWXJBBhuhpF1ysi/kBWONnnoLyF7dbI1yG/q\nQh+5eBSLAgMBAAECggEAU0U0AN9jao3tkWh3n5CJWEj+ZEboSIG/vkwgtQS2b9nB\nCF1cqmd9KJp9BtD0g3QilPuTZWxFii5sGaiRCBrGnMzMWqHCga2jSIQrq5lijeaH\nrsknR2tsHcAA4y9c3wJYKkvWyel54B8isimT0usYuWvQKJn9ie6uYOFbR/G69W9p\noLs3HdnG4jS8vcI3L+897KfMvYEutf2UUsirCdTFVkmbviwXnPxIlXMA0OvIPbV7\n0JzzoKnOZz4NXMnhu2a7m3ucC6RM+Q15fE+BETxAn1ttfA2g+zjFUMmiDOxGE7J9\nfbRRdks3n+hb9eQ7jYUxRs6IXczQD0swTQS1zA/O8QKBgQDjNKX1eLay7Q1JY7im\nyUBnEnK8qtkydTejG/IqQm+nm4WPZLsL0DA9e2fSwL2R2iIZPtX5XQK+tjXyCG+I\nBqVlyzCxCYPzCu+o1bXBLAOuJ5jDR1ZjBElkmFkD3ANd8qGrDyMGsO0QR7cpCibY\nbZvfshaASzqoG1S9vfVxxmXP8wKBgQDeV+ArLVVocO/i+yG97S1WOcsAemNObtCM\nrbwoaVTZGuRAb/QXnNS8D8JnWspEtN88meAbok9saILvI9IZXv8/X2SE/IL60/4J\nUYupx/PCzErnBv4IJxEFv75VSTWZwDn56XiCyiesTopyZMpzZyc53+XHoRk5qhR2\n76Xq+SNnCQKBgQCqJSUa/Hkk6OyIRwtiq1d1WJVfwDnC1ZECrszc5L+kroyIY5DH\nOfLGOAH6C6hq7wWWDj5C7Wo+00j2pWaQYRm/bzhZe5y6hzgOIWxo6sMeyjxWELga\nkn07vfL7Num2kxqKdV1vh1MgW/RH4XhRn1OZY04CaVPVzBHbvcNunnpkDQKBgGie\nZp9KXHahNW7TBcRtNjjtRqS58cI1CDI5iWBmd4MUUTQ0uWDm7X5z1+Bz6tq7VJMa\nQEYgcEitQHavnytK9MVn6E9e1W6ak1zlHtdLe1o8cD4Wny9M2oie+Tr+EJeAyIbc\nIVVBM7uy1RgQbuYwMlfcDy2Ikur8KVbxWlue0NapAoGAREsNzHnvYtnZBMOtobp8\nO8Fyi9tELRDKFn+IIMfRPKUfkUfoQffW2eEcVSidF47XXXbxiZS24EmSU7WwIjO6\nw7VcBbop6ZC197QJjoRsTcEN1lwgFMikEWaeWmZb2tzDquIZOr42SlXAXpWNR1iA\nF4heStisrjuMiGz4fQnpsf4=\n-----END PRIVATE KEY-----`
  }),
  databaseURL: 'https://sia-eco.firebaseio.com/'
});
/* eslint max-len: 0 */

const database = firebase.database();

// TODO: Parse errors to be clearest in logs
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
  res.redirect('https://gioacostax.github.io/');
});

// Handle POST in url ".../eco" and then request with the POST query
app.post('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); /* Disable CORS */
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'content-type');

  fetchSIA(req.body.query, req.body.host, (json, err) => {
    const session = database.ref(`requests/${date}/${req.body.id}`);

    session.transaction(current => (current || 0) + 1);

    if (err === null) {
      res.jsonp(json);
      console.log(`request from=${req.body.id} to=${req.body.host} result=OK`);
    } else {
      res.jsonp({ error: err });
      console.log(`request from=${req.body.id} to=${req.body.host}] result=`, err);
    }
  });
});

app.listen(app.get('port'), () => {
  console.log('SIA Eco is running on port', app.get('port'));
});
