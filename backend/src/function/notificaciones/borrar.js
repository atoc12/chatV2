const BorrarNotificacion = require("../../../DataBase/schemas/usuario/function/notifiaciones/borrar");

const BorrarNotificaciones = async (userdata,datos,socket)=>{
    try{
        let noti_select ={
            body:{
                value:datos,
                search:{
                    _id:userdata._id.toString()
                }
            }
        }
        await BorrarNotificacion(noti_select);
        socket.emit("recibir-notificacion",true);
    }catch(err){
        console.log(err);
    }
}


module.exports = BorrarNotificaciones;