const privateKeyPath = '/etc/letsencrypt/live/essec.ddns.net/privkey.pem'; // Ruta a tu clave privada
const certificatePath = '/etc/letsencrypt/live/essec.ddns.net/fullchain.pem'; // Ruta a tu certificado completo
const SMTPServer = require('smtp-server').SMTPServer;
const fs = require('fs');
const nodemailer = require('nodemailer');

// Configura el servidor SMTP
const server = new SMTPServer({
  secure: true, // Habilita la seguridad TLS
  key: fs.readFileSync(privateKeyPath, 'utf8'),
  cert: fs.readFileSync(certificatePath, 'utf8'),
  onAuth(auth, session, callback) {
    // Lógica de autenticación
  },
  onData(stream, session, callback) {
    // Lógica para manejar los correos entrantes

    // Agrega la imagen de seguimiento al cuerpo del correo electrónico
    const bodyWithTracking = `
      <img src="https://ruta-de-tu-imagen-de-seguimiento.com/pixel.png" width="1" height="1" />
      ${stream}`;
    
    // Crea una nueva secuencia de correo electrónico con la imagen de seguimiento
    const newStream = new require('stream').PassThrough();
    newStream.end(bodyWithTracking);

    // Envía el correo modificado
    const mailOptions = {
      from: 'octaviosdf2@gmail.com', // Cambia a una dirección de correo válida
      to: 'octaviosdf1@gmail.com',
      subject: 'Correo con seguimiento de apertura',
      text: 'Este correo tiene una imagen de seguimiento.',
    };

    const transporter = nodemailer.createTransport({
      sendmail: true, // Otras opciones pueden ser configuradas
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });

    callback();
  },
});

server.listen(465, () => {
  console.log('Servidor SMTP seguro escuchando en el puerto 465');
});
