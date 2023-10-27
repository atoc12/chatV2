const nodemailer = require('nodemailer');
const fs = require('fs');
const SMTPServer = require('smtp-server').SMTPServer;

// Rutas a tus claves y certificados SSL
const privateKeyPath = '/etc/letsencrypt/live/essec.ddns.net/privkey.pem'; // Ruta a tu clave privada
const certificatePath = '/etc/letsencrypt/live/essec.ddns.net/fullchain.pem'; // Ruta a tu certificado completo

// Configuración del servidor SMTP
const server = new SMTPServer({
//   secure:true,
  key: fs.readFileSync(privateKeyPath), // Clave privada SSL
  cert: fs.readFileSync(certificatePath), // Certificado SSL
});

server.listen(465, () => {
  console.log('Servidor SMTP escuchando en el puerto 465 (SSL/TLS)');
});

// Configuración del cliente de correo electrónico (nodemailer)
const transporter = nodemailer.createTransport({
  host: 'essec.ddns.net', // Servidor SMTP
  port: 465, // Puerto seguro para SSL/TLS
  auth: {
    user: 'tu_usuario', // Usuario SMTP
    pass: 'tu_contraseña', // Contraseña SMTP
  }
});

// Detalles del mensaje
const mailOptions = {
  from: 'tucorreo@essec.ddns.net',
  to: 'octaviosdf1@gmail.com',
  subject: 'Asunto del correo',
  text: 'Cuerpo del correo',
};

// Enviar el correo electrónico
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar el correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});
