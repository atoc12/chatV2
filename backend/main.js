require('./DataBase/conexion.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const app = express();
const http = require("http");
const servidor = http.createServer(app);
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require('socket.io');
const io = new Server(servidor,{cors:{}});
const cors = require('cors');
const userApi = require('./DataBase/schemas/usuario/user.api.js');
const ActualizarUsuario = require('./DataBase/schemas/usuario/function/usuario/actualizar.js');
const ObtenerContacto = require('./DataBase/schemas/usuario/function/contactos/obtener.js');
const ObtenerUsuarios = require('./DataBase/schemas/usuario/function/usuario/obtener.js');
const CrearSolicitud = require('./DataBase/schemas/usuario/function/contactos/solicitud/crear.js');
const ObtenerNotifiaciones = require('./DataBase/schemas/usuario/function/notifiaciones/obtener.js');
const BorrarNotificacion = require('./DataBase/schemas/usuario/function/notifiaciones/borrar.js');
const CrearNotificacion = require('./DataBase/schemas/usuario/function/notifiaciones/crear.js');
const opcionSolicitud = require('./DataBase/schemas/usuario/function/contactos/solicitud/opcion.js');
const BorrarContacto = require('./DataBase/schemas/usuario/function/contactos/borrar.js');
const ObtenerChat = require('./DataBase/schemas/chat/function/chat/obtener.js');
const AgregarMensaje = require('./DataBase/schemas/chat/function/message/obtener.js');
const path = require("path");



app.use(cors({}));
app.use(cookieParser());
// app.use(session({
//     name:"TOKEN",
//     secret: 'mi-secreto', // Una clave secreta para cifrar la sesión (puede ser cualquier cadena)
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Configura secure en true si estás utilizando HTTPS
    
// }));
app.use(express.json());    
app.use('/usuario',userApi);
// app.use(
//     '*',
//     createProxyMiddleware({
//       target: 'http://localhost:5173',
//       changeOrigin: true,
//     })
// );




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

    socket.on("conexion",async (datos)=>{
        try{
            socket.join(datos._id);
            let actualizar =await ActualizarUsuario({body:{
                search:datos._id,
                update:{
                    conexion:true,
                    socket_id:socket.id,
                }
            }},null,socket.id);
            user[socket.id] = actualizar.update;
        }catch(err){console.log(err);}
        
    })
    
    socket.on("validar-token",async (datos)=>{
        try{
            let resultado = await ObtenerUsuarios({
                body:{
                    search:{session:datos},
                    value:['session']
            }},null);
            socket.emit("resultado-token",resultado);
        }catch(err){
            console.log(err);
        }
    })
    /*----------------------notificaciones--------------------------------------*/
    socket.on("obtener-notificaciones",async(datos)=>{
        try{
            let query = await ObtenerNotifiaciones({
                body:{
                    search:{
                        _id:datos._id,
                        name:datos.name
                    }
                }
            })
            socket.emit("nuevas-notificaciones",query.notificaciones);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("create-noti",async (datos)=>{
        try{
            let noti_create = {
                body:{
                    search:{_id:user[socket.id]._id},
                    value:datos
                }
            }

            await CrearNotificacion(noti_create);
            socket.emit("recibir-notificacion",true);
        }catch(err){console.log(err)}
    })

    socket.on("delete-noti",async (datos) => {
        try{
            let noti_select ={
                body:{
                    value:datos,
                    search:{
                        _id:user[socket.id]._id.toString()
                    }
                }
            }
            await BorrarNotificacion(noti_select);
            socket.emit("recibir-notificacion",true);
        }catch(err){
            console.log(err);
        }
    })
    /*-------------------------Contactos---------------------------------------*/
    socket.on("enviar-solicitud",async(datos)=>{
        try{
            let resultado = await CrearSolicitud({
                body:{
                    search:{
                        name:datos.contact_name
                    },
                    value:{
                        _id:datos._id,
                        name:datos.name
                    }
                }
            })
            socket.to(resultado.socket).emit("recibir-notificacion",true);
            socket.to(resultado.socket).emit("nueva-solicitud",true);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("obtener-contactos",async(datos)=>{
        try{
            let res = await ObtenerContacto({
                body:{
                    search:{
                        _id:datos._id
                    }
                }
            })
            if(res && res.contactos && res.contactos.length >0){
                res.contactos.map(data=>{
                    socket.join(data._id.toString());
                    socket.to(data._id.toString()).emit("conexion-contacto",{message:`${datos.name} se ha conectado`});
                })
            }
            socket.emit("recibir-contactos",await res.contactos);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("borrar-contacto",async(datos)=>{
        try{
            await BorrarContacto({
                body:{
                    search:{_id:datos.user._id},
                    value:{_id:datos.contacto._id}
                }
            })
            await BorrarContacto({
                body:{
                    search:{_id:datos.contacto._id},
                    value:{_id:datos.user._id}
                }
            })
            socket.to(datos.contacto._id).emit("nuevo-contacto",true);
            socket.emit("nuevo-contacto",true);
        }catch(err){
            console.log(err);   
        }
    })
    /*----------------------------------Solicitud------------------------------ */
    socket.on("obtener-solicitud",async (datos)=>{
        try{
            let req = {
                body:{
                    search:{
                        _id:datos._id.toString()
                    },
                    value:["solicitud"]
                }
            };
            let res = await ObtenerUsuarios(req,null);
            socket.emit("solicitudes",res.data.solicitud);
        }catch(err){console.log(err)}
    });

    socket.on("confirmar-solicitud",async (datos)=>{
        try{
            let pre_consulta ={
                body:{
                    value:{_id:datos.data._id},
                    search:{_id:datos.user._id.toString()},
                    option:datos.value
                }
            };
            let res = await  opcionSolicitud(pre_consulta);
            if(datos.value){
                socket.to(datos.data._id).emit("nuevo-contacto",true);
                socket.emit("nuevo-contacto",true);
                socket.to(datos.data._id).emit("recibir-notificacion",true);
                socket.emit("recibir-notificacion",true);
            }
            socket.emit("nueva-solicitud",true);
        }catch(err){console.log(err);}
    });
    //--------------------------------CHAT-------------------------------------

    socket.on("send-chat",async (data)=>{// envia el identificador del chat en el que se encuentra
        try{
            let chat = await ObtenerChat(null,data.chat_id);
            if(user[socket.id].chatJoin){
                socket.leave(user[socket.id].chatJoin);
            }
            socket.join(data.chat_id);
            user[socket.id].chatJoin=data.chat_id;
            socket.emit("recive-chat-info",chat.messages);
        }catch(err){
            console.log(err);
        }        
    });
    socket.on("send-message",async (msj)=>{//enviar mensajes a los chats
        console.log(msj);
        await AgregarMensaje(null,user[socket.id].chatJoin,msj);
        socket.emit("recive-message",msj);
        socket.to(user[socket.id].chatJoin).emit("recive-message",msj);
    });

    socket.on("disconnect",()=>{
        console.log("usuario desconectado")
    })








})



















const publicPath = path.resolve(__dirname, '../dist');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});




servidor.listen(80,()=>{
    console.log('servidor abierto http://localhost:3000');
})