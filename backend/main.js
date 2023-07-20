/*------------------------------------------------------------Modulos----------------------------------------------------------------- */
require('./DataBase/conexion.js');
const cookieParser = require('cookie-parser'),express = require('express'),multer = require("multer"),app = express(),http = require("http");
const servidor = http.createServer(app),{ Server } = require('socket.io'),io = new Server(servidor,{cors:{}}),cors = require('cors');
const path = require("path"), mimmeTypes = require("mime-types"),publicPath = path.resolve(__dirname, '../dist');
const userApi = require('./DataBase/schemas/usuario/user.api.js');
const {BorrarNotificaciones,CrearNotificaciones,ObtenerNotificaciones} = require('./src/function/notificaciones/moduel.js');
const {UserConnect,ValidarToken,UserDisconnect, ActualizarPerfil, ObtenerUsuario} = require('./src/function/module.js')
const {BorrarContactos,ObtenerContactos} = require('./src/function/contactos/module.js')
const {CrearSolicitudes,ObtenerSolicitudes,ConfirmarSolicitud} = require('./src/function/contactos/solicitud/module.js');
const {ObtenerChats,ObtenerMensajes} = require('./src/function/chat/module.js');
const User = require('./DataBase/schemas/usuario/usuario.js');
/*--------------------------------Middelware----------------------------------------*/
const carpetaPath = path.resolve(__dirname, '../carpetas');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  carpetaPath+'/usuario/icon/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname+"."+mimmeTypes.extension(file.mimetype))
    }
  })
const upload = multer({storage:storage});
app.use(cors({}));
app.use(cookieParser());
app.use(express.json());    
app.use('/usuario',userApi);
app.use('/carpetas', express.static(carpetaPath));
const user = {};//Se define una estructura
io.on("connection",(socket)=>{
    // Estructura de cada usuario
    user[socket.id]={
        _id:null,
        email:null,
        name:null,
        conexion:false,
        socket_id:socket.id,
        token:null,
        chatJoin:null
    };
    /*-----------------------Conexion inicial------------------------------------ */
    socket.on("conexion",async (datos)=>user[socket.id]= await UserConnect(datos,socket));
    socket.on("validar-token",async (datos)=>await ValidarToken(datos,socket));
    /*----------------------Ajustes--------------------------------------------- */
    socket.on("actualizar-perfil", async (datos) =>await ActualizarPerfil(datos,socket));
    /*----------------------notificaciones--------------------------------------*/
    socket.on("obtener-notificaciones",async(datos)=>ObtenerNotificaciones(datos,socket));
    socket.on("create-noti",async (datos)=>await CrearNotificaciones(user[socket.id],datos,socket));
    socket.on("delete-noti",async (datos) => await BorrarNotificaciones(user[socket.id],datos,socket));
    /*-------------------Usuraios-------------------------------------------------------- */
    socket.on("obtener-usuario",async (datos)=>await ObtenerUsuario(datos,socket) );
    /*-------------------------Contactos---------------------------------------*/
    socket.on("obtener-solicitud",async (datos)=>await ObtenerSolicitudes(datos,socket));
    socket.on("enviar-solicitud",async(datos)=>await CrearSolicitudes(datos,socket));
    socket.on("confirmar-solicitud",async (datos)=>await ConfirmarSolicitud(datos,socket) );
    socket.on("obtener-contactos",async(datos)=>await ObtenerContactos(datos,socket));
    socket.on("borrar-contacto",async(datos)=>await BorrarContactos(datos,socket));
    //--------------------------------CHAT-------------------------------------
    socket.on("send-chat",async (datos)=>user[socket.id].chatJoin=await ObtenerChats(user[socket.id],datos,socket));
    socket.on("send-message",async (msj)=>await ObtenerMensajes(user[socket.id],msj,socket));
    /*--------------------------------Buscador---------------------------------- */
    socket.on("buscar-usuario",async(datos)=>{
        try{
            let resultado = await User.find({ name: { $regex: new RegExp(`^${datos}`, "i") } }).select('name picture _id');
            socket.emit("busqueda-resultado",resultado);
        }catch(err){
            console.log(err);
        }
    })
    /*----------------------------Conexion------------------------------------- */
    socket.on("disconnect",async(data)=>await UserDisconnect(user[socket.id],socket))
    socket.on("cerrar",async(data)=>await UserDisconnect(user[socket.id],socket))
    socket.on("error", (error) => console.error("Error en la conexión con el servidor:", error));
})
// Servir archivos estáticos en la ruta '/carpetas'
app.use(express.static(publicPath));
app.get('*', (req, res) =>res.sendFile(path.join(publicPath, 'index.html')));
app.post("/subir/archivo",upload.single('lol'),async (req,res)=>{
    try{
        res.json({message:"hola mundo"});
    }catch(err){
        console.log(err);
    }
})
servidor.listen(80,()=>{
    console.log('servidor abierto http://localhost:3000');
})