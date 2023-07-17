const Chat = require("../../chat");
const AgregarMensaje = async (res,id,datos)=>{
    try{
        let chat = await Chat.findById(id);
        if(chat){
            let men = chat.messages.push({
                    content:datos.content,
                    sender:datos.sender,
                    name:datos.name
                });
            let resultado = await chat.save();
            console.log(resultado[resultado.length]);
        }
        if(res){
            res.json({message:"mensaje almacenado"});
        }
        return {message:"mensaje almacenado"};
    }catch(err){console.log(err)}
}

module.exports = AgregarMensaje;