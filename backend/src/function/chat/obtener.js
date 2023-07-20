const ObtenerChat = require("../../../DataBase/schemas/chat/function/chat/obtener");
const ObtenerChats =async(userdata,datos,socket)=>{
    try{
        let chat = await ObtenerChat(null,datos.chat_id);
        if(userdata.chatJoin){
            socket.leave(userdata.chatJoin);
        }
        socket.join(datos.chat_id);
        socket.emit("recive-chat-info",chat.messages);
        return datos.chat_id
    }catch(err){
        console.log(err);
    }        
}
module.exports = ObtenerChats;