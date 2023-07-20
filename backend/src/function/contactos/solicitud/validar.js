const opcionSolicitud = require("../../../../DataBase/schemas/usuario/function/contactos/solicitud/opcion");
const ConfirmarSolicitud = async (datos,socket)=>{
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
}

module.exports = ConfirmarSolicitud;