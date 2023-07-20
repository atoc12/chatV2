const ObtenerNotifiaciones = require("../../../DataBase/schemas/usuario/function/notifiaciones/obtener");

const ObtenerNotificaciones =async (datos,socket)=>{
    try{
        let query = await ObtenerNotifiaciones({
            body:{
                search:{
                    _id:datos._id,
                    name:datos.name
                }
            }
        })
        socket.emit("nuevas-notificaciones",query.notificaciones);
    }catch(err){
        console.log(err);
    }
}

module.exports = ObtenerNotificaciones;