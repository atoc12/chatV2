const Chat = require("../../chat.js");
const ObtenerChat = async (res,id)=>{ 
    try{
        let respons = await Chat.findById(id);
        if(res){
            res.json(!respons || respons.length <= 0 ? {message:"error"} : respons);
        }
        return respons;
    }catch(err){console.log(err)}
}

module.exports = ObtenerChat;