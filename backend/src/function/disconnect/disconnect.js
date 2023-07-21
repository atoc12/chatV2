const ActualizarUsuario = require("../../../DataBase/schemas/usuario/function/usuario/actualizar");

const UserDisconnect =async (userdata,datos =null,socket)=>{
    try{
        if(userdata && userdata.name && userdata._id){
            let actualizar =await ActualizarUsuario({body:{
                search:userdata._id,
                update:{
                    conexion:false,
                }
            }},null,socket.id);
            userdata.contactos.map(data=>{
                socket.leave(data._id);
                socket.to(data._id.toString()).emit("conexion-contacto",{message:`${userdata.name} se ha desconectado`});
                socket.to(data._id.toString()).emit("nuevo-contacto",true);
            })
            socket.leave(datos ? datos._id :userdata._id);
        }
    }catch(err){console.log(err);}
}

module.exports = UserDisconnect;