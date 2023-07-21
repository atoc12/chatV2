const User = require("../../../usuario");
const Borrarsolicitud =async (req,res=null)=>{// funcion que permite eliminar solicitud
    try{
        let {search,value} = req.body;
        let usuario = await User.findOne(search);
        if(!usuario) return res ? res.json({message:"usuario no encontrado"}):{message:"usuario no encontrado"};
        let solicitud =usuario.solicitud.findIndex((solicitud)=> solicitud._id.toString() === value._id.toString());
        if(solicitud === -1) return res ? res.json({message:"solicitud no existente"}) : {message:"solicitud no existente"}; 
        usuario.solicitud.splice(solicitud,1)
        await usuario.save()
        let mensaje = {message:"solicitud eliminado"};
        res ? res.json(mensaje) : mensaje;
        
    }catch(err){console.log(err)}

}

module.exports = Borrarsolicitud;