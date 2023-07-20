const CrearSolicitud = require("../../../../DataBase/schemas/usuario/function/contactos/solicitud/crear");
const CrearSolicitudes =async(datos,socket)=>{
    try{
        let resultado = await CrearSolicitud({
            body:{
                search:{
                    name:datos.contact_name
                },
                value:{
                    _id:datos._id,
                    name:datos.name
                }
            }
        })
        socket.to(resultado.socket).emit("recibir-notificacion",true);
        socket.to(resultado.socket).emit("nueva-solicitud",true);
    }catch(err){
        console.log(err);
    }
}
module.exports = CrearSolicitudes;