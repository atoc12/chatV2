const CrearChat = require("../../../../chat/function/chat/crear");
const User = require("../../../usuario");
const opcionSolicitud =async (req,res=null)=>{
    try{
        const {search,value,option} = req.body;
        let usuario = await User.findOne(search);
        if(!usuario) return res.json({message:"usuario no encontrado"});
        let validation =usuario.solicitud.findIndex((solicitante)=> solicitante._id.toString() === value._id.toString());
        if(validation === -1) return {message:"contacto no existente"};
        usuario.solicitud.splice(validation,1);
        if(!option) {await usuario.save(); return {message:"se ha rechazado con exito"}};
        let usuario2 = await User.findOne({_id:value._id});
        let chat =await CrearChat();
        usuario.contactos.push({
            _id:usuario2._id,
            conexion:usuario2.conexion,
            name:usuario2.name,
            socket_id:usuario2.socket_id,
            chat_id:chat._id.toString()
        })
        usuario.notificaciones.push({
            sender:usuario2._id,
            name:usuario2.name,
            content:`${usuario2.name} se ha añadido a tus contactos`
        })
        usuario2.contactos.push({
            _id:usuario._id,
            conexion:usuario.conexion,
            name:usuario.name,
            socket_id:usuario.socket_id,
            chat_id:chat._id.toString()
        })
        usuario2.notificaciones.push({
            sender:usuario._id,
            name:usuario.name,
            content:`${usuario.name} se ha añadido a tus contactos`
        })
        chat.participants.push(usuario);
        chat.participants.push(usuario2);
        await usuario.save();
        await usuario2.save();
        await chat.save();
        return {message:"contacto añadido",socket:usuario.socket_id};


    }catch(err){
        console.log(err)
    }
}

module.exports = opcionSolicitud;