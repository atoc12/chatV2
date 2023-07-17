const Chat = require("../../chat");
const CrearChat = async(res=null)=>{
    try{
        let chat = new Chat();
        await chat.save();
        if(res){
            res.json(chat);
        }
        return chat;
    }catch(err){console.log(err)}
}
module.exports = CrearChat;