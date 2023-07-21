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
        socket.to(datos.data).emit("actualizar-usuario-info",true);
        socket.emit("actualizar-usuario-info",true);
    }catch(err){
        console.log(err);
    }
}
module.exports = Borrarsolicitudes;