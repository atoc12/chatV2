const User = require("../../usuario");
const BorrarContacto =async (req,res=null)=>{// funcion que permite eliminar contactos
    try{
        let {search,value} = req.body;
        let usuario = await User.findOne(search);
        if(!usuario) return res ? res.json({message:"usuario no encontrado"}):{message:"usuario no encontrado"};
        let contacto =usuario.contactos.findIndex((contactos)=> contactos._id.toString() === value._id.toString());
        if(contacto === -1) return res ? res.json({message:"contacto no existente"}) : {message:"contacto no existente"}; 
        usuario.contactos.splice(contacto,1)
        await usuario.save()
        let mensaje = {message:"contacto eliminado"};
        res ? res.json(mensaje) : mensaje;
        
    }catch(err){console.log(err)}

}

module.exports = BorrarContacto;