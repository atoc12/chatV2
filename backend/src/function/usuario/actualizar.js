const ActualizarUsuario = require("../../../DataBase/schemas/usuario/function/usuario/actualizar");

const ActualizarPerfil =async (datos,socket)=>{
    try {
        let query =await  ActualizarUsuario({
            body:{
                search:{
                    _id:datos.user._id
                },
                update:datos.update
            }
        });
        console.log(query);
        query.update.contactos.map(data=>{
            socket.to(data._id.toString()).emit("nuevo-contacto",true);
        })
        socket.emit("actualizacion-perfil",{
            name:query.update.name,
            email:query.update.email,
            picture:query.update.picture,
            _id:query.update._id
        })
    } catch (err) {
      console.log(err);
    }
}
module.exports = ActualizarPerfil;