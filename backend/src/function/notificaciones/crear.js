const CrearNotificacion = require("../../../DataBase/schemas/usuario/function/notifiaciones/crear");

const CrearNotificaciones = async (datauser,datos,socket)=>{
    try{
        let noti_create = {
            body:{
                search:{_id:datauser._id},
                value:datos
            }
        }
        await CrearNotificacion(noti_create);
        socket.emit("recibir-notificacion",true);
    }catch(err){console.log(err)}
}

module.exports = CrearNotificaciones;