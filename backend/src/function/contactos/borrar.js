const BorrarContacto = require("../../../DataBase/schemas/usuario/function/contactos/borrar");
const BorrarContactos =async (datos,socket)=>{
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
}
module.exports = BorrarContactos;