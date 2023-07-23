const Borrarsolicitud = require("../../../../DataBase/schemas/usuario/function/contactos/solicitud/borrar");

const Borrarsolicitudes =async (datos,socket)=>{
    try{
        let res = await Borrarsolicitud({
            body:{
                search:{
                    _id:datos.data,
                },
                value:{
                    _id:datos.user._id
                }
            }
        })    
        console.log(res)
        console.log(datos);
        socket.join(datos.data._id);
        socket.to(datos.data._id).emit("nueva-solicitud",true);
        socket.leave(datos.data._id);
        socket.emit("actualizar-usuario-info",true);
    }catch(err){
        console.log(err);
    }
}
module.exports = Borrarsolicitudes;