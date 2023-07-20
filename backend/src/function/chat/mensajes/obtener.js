const AgregarMensaje = require("../../../../DataBase/schemas/chat/function/message/obtener");
const ObtenerMensajes =async (userdata,msj,socket)=>{
    try{
        await AgregarMensaje(null,userdata.chatJoin,msj);
        socket.emit("recive-message",msj);
        socket.to(userdata.chatJoin).emit("recive-message",msj);
    }catch(err){
        console.log(err)
    }
}
module.exports= ObtenerMensajes;