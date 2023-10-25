require('dotenv').config()
const express = require('express');
const Conexion = require('./config/databases/conexion');
const http = require("http");
const {Server} = require("socket.io");
const cors = require('cors');
const path = require("path");
const User = require('./config/databases/schemas/user/user_schema');
const errorescatch = require('./config/databases/errors/errors');
const REST = require('./src/api/routes');
const Publicacion = require('./config/databases/schemas/post/post_schema');
const AddContact = require('./src/socket/contacts/add.js');
const RemoveContact = require('./src/socket/contacts/remove');
const Chat = require('./config/databases/schemas/chat/chat_schema');
const APP = express();
const servidor = http.createServer(APP);
const io = new Server(servidor,{cors:{}});
const carpetaPath = path.resolve(__dirname, '../carpetas');
const publicPath = path.resolve(__dirname, '../dist');
APP.use('/carpetas', express.static(carpetaPath));
APP.use(cors({}))
APP.use(express.json());
APP.use(REST)

APP.use(express.static(publicPath));
APP.get('*', (req, res) =>res.send("hola mundo"));
// APP.get('*', (req, res) =>res.sendFile(path.join(publicPath, 'index.html')));

//-----------------------DB------------------------------
Conexion(process.env.DB);
const user = {};
io.on("connection",(socket)=>{

    user[socket.id]={
        _id:null,
        email:null,
        name:null,
        conexion:false,
        socket_id:socket.id,
        token:null,
        chatJoin:null
    };
    socket.on("conexion", async (datos)=>{
        try{
            socket.join("general");
            datos && socket.join(datos._id);
            datos && console.log("usuario conectado");
            let result = await User.findById(datos._id,{chats:1,notificaciones:1,solicitud:1,contactos:1}).populate('solicitud contactos',{name:1,email:1,_id:1});
            socket.emit("recive-alert",result.notificaciones);
            socket.emit("recive-solicitud",result.solicitud);
            socket.emit("recive-contact",result.contactos);
            socket.emit("recive-chats",result.chats);

            result.chats.length > 0 &&  result.chats.forEach(chats => socket.join(chats._id.toString()));
            

        }catch(err){
            
        }
    });
    socket.on("get-alert",async (user)=>{
        try{

            let result = await User.findById(user,{notificaciones:1});
            socket.emit("recive-alert",result);
        }catch(err){
            console.log(err);
        }
    });



    socket.on("user-update",async (datos)=>{
        try{
            const {user,campo,value,share} = datos
            let response = await User.findById(user,{password:0,email:0,session:0});

            if(Array.isArray(response[campo])){
                response[campo].push(value);
            }else{
                response[campo] = value;
            }


            response = await response.save();

            if(share){
                socket.join(share);
                socket.to(share).emit("recive-user-update",response);
            }
            socket.emit("recive-user-update",response);
        }catch(err){
            console.log(err);
        }
    })

    socket.on("update-post",async (datos)=>{
        try{
               
            const {search,value} = datos;
            let response = await Publicacion.findById(search);
            response = await response.addLike(search,value);
            socket.to("general").emit("update-post-"+search,response);
            socket.emit("update-post-"+search,response);

        }catch(err){
            console.log(err);
        }
    });

    //------------------Contactos----------------------------------
    //Este fragmento de Socket se utilizará para agregar contactos a la coleccion de usuario
    //1_ add-contact añade un contacto solo si en el campo solicitud tiene el _id del usuario que se quiere agregar como contacto
    socket.on("send-request",async (datos)=>{
        try{
            const {user,user2} = datos
            const PRIMARY_USER = await User.findById(user);
            if(!PRIMARY_USER) throw Error("usuario no encontrado");
            let response = null;
            if(!PRIMARY_USER.solicitud.includes(user2)){
                response = await PRIMARY_USER.addRequest(user2);
            }else{
                response = await PRIMARY_USER.removeRequest({_id:user2});
            }
            response =await response.populate("solicitud",{name:1,email:1,_id:1});
            response =await response.populate("notificaciones");
            
            socket.join(user);
            socket.to(user).emit("recive-solicitud",response.solicitud);
            socket.to(user).emit("recive-alert",response.notificaciones);
            socket.emit("recive-user-change",true);
            socket.leave(user);
            
            
            
        }catch(err){
            console.log(err);
        }
    })
    socket.on("add-contact",async function (data) { AddContact(data,this)});
    socket.on("remove-contact",async function (data) { RemoveContact(data,this)});

    // ----------------------------------------Chat---------------------------------------------
    socket.on("get-chat",async (data)=>{
        try{
            const {user,chat_id} = data;

            const RESULT = await Chat.findById({_id:chat_id}).populate('participants',{name:1,email:1,_id:1}) ; 

            socket.emit("recive-chat-info",RESULT);
            socket.emit("recive-messages"+chat_id,RESULT.messages);

        }catch(err){
            console.log(err);
        }

    })
    socket.on("new-message",async (data)=>{
        try{    
            const {message,chat_id,user} = data

            const RESULT = await Chat.findById(chat_id);

            RESULT.messages.push({content:message,sender:user._id,name:user.name});

            await RESULT.save();

            socket.to(chat_id).emit("recive-messages"+chat_id,RESULT.messages);
            socket.emit("recive-messages"+chat_id,RESULT.messages);

            
        }catch(err){
            console.log(err);
        }
    })

})



servidor.listen(process.env.PORT,()=>{
    console.log("servidor iniciado");
});