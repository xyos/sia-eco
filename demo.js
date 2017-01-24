// We need this to build our post string
var http = require('http');

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
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
