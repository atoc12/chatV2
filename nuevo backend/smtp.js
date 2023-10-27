const nodemailer = require('nodemailer');
const fs = require('fs');
const SMTPServer = require('smtp-server').SMTPServer;

// Rutas a tus claves y certificados SSL
const privateKeyPath = '/etc/letsencrypt/live/essec.ddns.net/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/essec.ddns.net/fullchain.pem';

// Configuración del servidor SMTP
const server = new SMTPServer({
  key: fs.readFileSync(privateKeyPath), // Clave privada SSL
  cert: fs.readFileSync(certificatePath), // Certificado SSL
  onAuth(auth, session, callback) {
    // Verifica las credenciales del usuario aquí
    const username = 'tu_usuario';
    const password = 'tu_contraseña';
    if (auth.username === username && auth.password === password) {
      return callback(null, { user: 'user' });
    } else {
      return callback(new Error('Autenticación fallida'));
    }
  },
});

server.listen(465, () => {
  console.log('Servidor SMTP escuchando en el puerto 465 (SSL/TLS)');
});

// Configuración del cliente de correo electrónico (nodemailer)
const transporter = nodemailer.createTransport({
  host: 'essec.ddns.net', // Servidor SMTP
  port: 465, // Puerto seguro para SSL/TLS
  secure: true, // Habilitar SSL/TLS
  auth: {
    user: 'tu_usuario', // Usuario SMTP
    pass: 'tu_contraseña', // Contraseña SMTP
  },
  tls: {
    // Configuración de TLS
    ca: [fs.readFileSync(certificatePath)],
  },
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
