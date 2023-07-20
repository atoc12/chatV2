const ActualizarUsuario = require("../../../DataBase/schemas/usuario/function/usuario/actualizar");

const UserConnect = async (datos,socket)=>{
    try{
        socket.leave(datos._id);
        socket.join(datos._id);
        let actualizar =await ActualizarUsuario({body:{
            search:datos._id,
            update:{
                conexion:true,
                socket_id:socket.id,
            }
        }},null,socket.id);
        actualizar.update.contactos.map(data=>{
            socket.to(data._id.toString()).emit("nuevo-contacto",true);
        })
        return actualizar.update;
    }catch(err){console.log(err);}
}

module.exports = UserConnect;