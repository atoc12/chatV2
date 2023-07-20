const ObtenerUsuarios = require("../../../../DataBase/schemas/usuario/function/usuario/obtener");

const ObtenerSolicitudes = async (datos,socket)=>{
    try{
        let req = {
            body:{
                search:{
                    _id:datos._id.toString()
                },
                value:["solicitud"]
            }
        };
        let res = await ObtenerUsuarios(req,null);
        socket.emit("solicitudes",res.data.solicitud);
    }catch(err){console.log(err)}
}
module.exports = ObtenerSolicitudes;