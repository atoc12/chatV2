const ActualizarUsuario = require("../../../DataBase/schemas/usuario/function/usuario/actualizar");

const UserDisconnect =async (userdata,socket)=>{
    try{
        if(userdata && userdata.name && userdata._id){
            let actualizar =await ActualizarUsuario({body:{
                search:userdata._id,
                update:{
                    conexion:false,
                }
            }},null,socket.id);
            userdata.contactos.map(data=>{
                socket.emit("")
                socket.to(data._id.toString()).emit("conexion-contacto",{message:`${userdata.name} se ha desconectado`});
                socket.to(data._id.toString()).emit("nuevo-contacto",true);
            })
        }
    }catch(err){console.log(err);}
}

module.exports = UserDisconnect;