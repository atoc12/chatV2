const User = require("../../../usuario");
const CrearSolicitud =async (req,res=null)=>{
    try{
        let {search,value} = req.body;
        let respons = await User.findOne(search);
        if(!respons) return {message:"usuario no encontrado"};
        if(respons.solicitud.find(data => data._id.toString() == value._id.toString())) return {message:"la solicitud ya ha sido enviada",client:null};
        let message = {
            sender:value._id,
            name:value.name,
            content:`${value.name} te ha enviado una solicitud`
        }
        respons.solicitud.push({_id:value._id,name:value.name});
        respons.notificaciones.push(message);
        await respons.save();
        if(res){
            res.json({ message: "Contacto agregado exitosamente" });
        }
        return {socket:respons._id.toString(),body:message};
    }catch(err){
        console.log(err)
    }
}

module.exports = CrearSolicitud;