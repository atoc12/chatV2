/*------------------------------------------------------------Modulos----------------------------------------------------------------- */
require('./DataBase/conexion.js');
const cookieParser = require('cookie-parser'),express = require('express'),multer = require("multer"),app = express(),http = require("http");
const servidor = http.createServer(app),{ Server } = require('socket.io'),io = new Server(servidor,{cors:{}}),cors = require('cors');
const path = require("path"), mimmeTypes = require("mime-types"),publicPath = path.resolve(__dirname, '../dist');
const userApi = require('./DataBase/schemas/usuario/user.api.js');
const {BorrarNotificaciones,CrearNotificaciones,ObtenerNotificaciones} = require('./src/function/notificaciones/moduel.js');
const {UserConnect,ValidarToken,UserDisconnect, ActualizarPerfil, ObtenerUsuario} = require('./src/function/module.js')
const {BorrarContactos,ObtenerContactos} = require('./src/function/contactos/module.js')
const {CrearSolicitudes,ObtenerSolicitudes,ConfirmarSolicitud, Borrarsolicitudes} = require('./src/function/contactos/solicitud/module.js');
const {ObtenerChats,ObtenerMensajes} = require('./src/function/chat/module.js');
const User = require('./DataBase/schemas/usuario/usuario.js');
const CrearPublicacion = require('./DataBase/schemas/publicaciones/function/crear.js');
const ObtenerPublicacion = require('./DataBase/schemas/publicaciones/function/obtener.js');
const Publicacion = require('./DataBase/schemas/publicaciones/publicaciones.js');
const ActualizarPublicacion = require('./DataBase/schemas/publicaciones/function/actualizar.js');
const BorrarPublicacion = require('./DataBase/schemas/publicaciones/function/borrar.js');
const compression = require('compression');
const Usuario = require('./api/usuarios/user.js');
const rest = require('./api/api.js');
const Chats = require('./api/chat/chat.js');
const Post = require('./api/publicacion/publicacion.js');

/*--------------------------------Middelware----------------------------------------*/
const carpetaPath = path.resolve(__dirname, '../../../carpetas');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  carpetaPath+'/usuario/icon/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname+".jpeg")
    //   mimmeTypes.extension(file.mimetype)
    }
  })
  
const upload = multer({storage:storage});
app.use(cors({}));
app.use(cookieParser());
app.use(express.json());    
app.use(compression());// habilita la compresión de texto
// app.use('/api',rest);
app.use('/usuario',userApi);
app.use('/api',rest);
app.use('/carpetas', express.static(carpetaPath));
const user = {};//Se define una estructura
(async()=>{
    let chat1= await new Chats({value:{
        participants:[
            {
                _id:"64dae5f4380166cae29522c5"
            },
            {
                _id:"64daf9d407ebeeb56b9e9ea2"
            }
        ]
    }}).create();
})()

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

    socket.on("get-user",async(datos)=>{
        let response = await new Usuario({search:{_id:datos._id}}).read();
        let data = null;
        if(response.data){
            data = response.data[0];
        }
        socket.emit("recive-user-session",{...response,data:data});
    })

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
    socket.on("borrar-solicitud",async (datos)=> await Borrarsolicitudes(datos,socket));
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
            let resultado = await User.find(datos.busqueda? datos.search : { name:{ $regex: new RegExp(`${datos}`, "i") } }).select('name picture _id');
            // console.log()
            socket.emit("busqueda-resultado",resultado);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("buscar",async(datos)=>{
        try{
            let busqueda = new RegExp(datos.search, 'i');
            let resultado = [];
            if(datos.filter == 'usuario'){
                resultado = await User.find({}).where('name').regex(busqueda);
            }else if(datos.filter == 'publicacion'){
                resultado = await ObtenerPublicacion({
                    body:{
                        where:'content',
                        search:{},
                        regex:busqueda
                    }
                });
            }
            socket.emit("busqueda-resultado",resultado);
        }catch(err){
            console.log(err);
        }
    })
    /*---------------------Publicaciones---------------------------------------- */
    socket.on("buscar-publicacion",async(datos)=>{
        try{
            let resultado = await Publicacion.find({ content:{$regex: new RegExp(`${datos.search}`, "i") } });
            socket.emit("busqueda-resultado",resultado);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("obtener-publicacion",async (datos)=>{
        try{
            let res = await ObtenerPublicacion({body:{
                search:datos
            }});
            socket.emit("recibir-publicacion",res);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("obtener-comentarios",async (datos)=>{
        try{
            let {search} = datos;
            console.log(search);
            let response = await Publicacion.findById(search).select(`response`);
            let id = response.response.map(response => response._id.toString());
            let busqueda = await Publicacion.find({_id:{$in:id}});
            let array =id.flatMap(data=>busqueda.filter(item=> item._id.toString()==data));
            if(id.length != array){
                response.response=array;
                response.save();
            }
            let id_creator = busqueda.map(creator => creator.creator.toString());
            let creador = await User.find({_id:{$in:id_creator}}).select("_id name picture email");
            let estructura = busqueda.flatMap(data=>{
                let ind = creador.filter(user => user._id.toString() === data.creator.toString())[0];
                if(ind){
                    return {
                        _id:data._id.toString(),
                        creator:data.creator.toString(),
                        name: ind.name,
                        email: ind.email,
                        content:data.content,
                        like:data.like,
                        status:data.status,
                        channels: data.channels,
                        categories: data.categories,
                        timestamp: data.timestamp,
                    };
                }
            })
            socket.emit("recibir-comentarios",estructura);
        }catch(err){
            console.log(err);
        }
    
    })
    socket.on("crear-comentario",async (datos)=>{
        try{
            let {search,value} = datos;
            let create = await new Publicacion({
                creator:value.sender,
                content:value.content,
                categories:value.categories,
                timestamp:value.timestamp
            });
            
            if(create){
                let response = await Publicacion.findOne(search);
                response.response.push(create);
                create.myresponse.push(response);
                await response.save();
                await create.save();
            }
            socket.emit("recargar-comentarios",true);
        }catch(err){
            console.log(err);
        }
    })
    socket.on("crear-publicacion",async (datos)=>{
        try{
            let publicacion_structure = {
                creator:datos.user._id,
                content:datos.publicacion.content,
                categories:datos.publicacion.categories,
                picture:datos.user.picture,
                timestap:datos.publicacion.timestap
            }
            let res = await CrearPublicacion({body:publicacion_structure})
            console.log(res);
        }catch(err){
            console.log("error");
        }
    })
    socket.on("borrar-publicacion",async(datos)=>{
        try{

        }catch(err){
            console.log(err);
        }
    })
    


    socket.on("update-post",async(datos)=>{
        console.log("actualizar");
        let response = await new Post(datos).update();
        socket.to("index").emit("recive-post-update-"+datos.search._id,response);
        socket.emit("recive-post-update-"+datos.search._id,response);
    })
    socket.on("delete-post",async(datos)=>{
        try{
            console.log("borrar");
            let response = await new Post(datos).delete();
            socket.to("index").emit("recive-post-update-"+datos.search._id,response);
            socket.emit("recive-post-update-"+datos.search._id,response);
        }catch(err){
            console.log(err);
        }
    })
    /*----------------------------Conexion------------------------------------- */
    socket.on("disconnect",async(data)=>await UserDisconnect(user[socket.id],null,socket))
    socket.on("cerrar",async(data)=>await UserDisconnect(user[socket.id],data,socket))
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