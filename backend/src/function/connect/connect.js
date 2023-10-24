const Usuario = require("../../../api/usuarios/user");

const UserConnect = async (datos,socket)=>{
    try{
        socket.join("index");
        socket.leave(datos._id);
        socket.join(datos._id);
        let actualizar =await new Usuario().update({search:{_id:datos._id},value:{conexion:true,socket_id:socket.id}});
        actualizar.data.contactos.map(data=>{
            socket.join(data._id.toString());
            socket.to(data._id.toString()).emit("nuevo-contacto",true);
        })
        return actualizar.data;
    }catch(err){console.log(err);}
}

module.exports = UserConnect;