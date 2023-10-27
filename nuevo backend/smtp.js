const SMTPServer = require('smtp-server').SMTPServer;
const tls = require('tls');
const fs = require('fs');
const privateKeyPath = '/etc/letsencrypt/live/essec.ddns.net/privkey.pem'; // Ruta a tu clave privada
const certificatePath = '/etc/letsencrypt/live/essec.ddns.net/fullchain.pem'; // Ruta a tu certificado completo
const server = new SMTPServer({
  secure: true, // Habilita la seguridad TLS
  key : fs.readFileSync(privateKeyPath, 'utf8'),
  cert : fs.readFileSync(certificatePath, 'utf8'),
  onAuth(auth, session, callback) {
    // Lógica de autenticación
  },
  onData(stream, session, callback) {
    // Lógica para manejar los correos entrantes
  },
});

server.listen(465, () => {
  console.log('Servidor SMTP seguro escuchando en el puerto 465');
});
