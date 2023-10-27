const SMTPServer = require('smtp-server').SMTPServer;
const tls = require('tls');
const fs = require('fs');
const privateKeyPath = '/etc/letsencrypt/live/essec.ddns.net/privkey.pem'; // Ruta a tu clave privada
const certificatePath = '/etc/letsencrypt/live/essec.ddns.net/fullchain.pem'; // Ruta a tu certificado completo

const enviarMail =async ()=>{
    const config = {
        host:"essec.ddns.net",
        port:465,
        auth:{
            user:"octaviosdf1@gmail.com",
            pass:"vqfh fqpv ekzg kmkb"
        }
    }
    const mensaje = {
        from :'octaviosdf1@gmail.com',
        to:"octaviosdf2@gmail.com",
        subject:"Correo de pruebas",
        text:"hola mundo"
    }
    const transport = nodeMail.createTransport(config);
    const info = await transport.sendMail(mensaje);
    console.log(info);
  }

const server = new SMTPServer({
  secure: true, // Habilita la seguridad TLS
  key: fs.readFileSync(privateKeyPath), // Ruta a tu clave privada
  cert: fs.readFileSync(certificatePath), // Ruta a tu certificado SSL
  onAuth(auth, session, callback) {
    // Lógica de autenticación
  },
  onData(stream, session, callback) {
    enviarMail();    
  },
});

server.listen(465, () => {
  console.log('Servidor SMTP seguro escuchando en el puerto 465');
});
