const SMTPServer = require('smtp-server').SMTPServer;
const tls = require('tls');
const fs = require('fs');

const server = new SMTPServer({
  secure: true, // Habilita la seguridad TLS
  key: fs.readFileSync('ruta/a/tu/clave-privada.key'), // Ruta a tu clave privada
  cert: fs.readFileSync('ruta/a/tu/certificado.crt'), // Ruta a tu certificado SSL
});

server.listen(465, () => {
  console.log('Servidor SMTP seguro escuchando en el puerto 465');

  

});
