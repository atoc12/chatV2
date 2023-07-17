const User = require("../../usuario");
const ActualizarContacto =async (req,res)=>{// funcion que permite actualizar los contactos del usuario
    try{
        let { search, value } = req.body;
        let usuario = await User.findOne(search.User);
        if (!usuario)return res.json({ message: "Usuario no encontrado" });
        let contacto = usuario.contactos.find(contacto => contacto._id.toString() === search.contact._id.toString());
        if (!contacto)return res.json({ message: "Contacto no existente" });
        Object.assign(contacto, value);
        await usuario.save();
        res.json({ message: "Contacto actualizado" });
    }catch(err){console.log(err)}
}
module.exports = ActualizarContacto;