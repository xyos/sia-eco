var fetch = require('node-fetch')

var query = JSON.stringify({
  host: 'sia.bogota.unal.edu.co',
  query: { method: 'buscador.obtenerAsignaturas', params: [
    '',
    'PRE',
    'p',
    'PRE',
    '2509',
    '',
    1,
    3
  ]}
});

fetch(`http://nodos.herokuapp.com/buscador/JSON-RPC`, { 
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: query
}).then(res => {
  res.json().then(json => console.log(json)).catch(err => console.log(err));
}).catch(err => console.log(err));