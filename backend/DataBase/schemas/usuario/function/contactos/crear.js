const User = require("../../usuario");
const AgregarContacto = async (req,res)=>{ // funcion que permite obtener datos de contactos
    try {
        let {search,value} = req.body;
        let usuario = await User.findOne(search);
        if(!usuario)return res.json({message:"Usuario no encontrado"});
        if(usuario.contactos.find(data => data._id == value._id))return res.json({ message: "El contacto ya existe" });
        let contacto = {
            _id:value._id,
            name:value.name
        };
        usuario.contactos.push(contacto);
        await usuario.save();
        res.json({ message: "Contacto agregado exitosamente" });
    } catch (err) {res.json({ message: "Error al agregar el contacto" });}
}      

module.exports = AgregarContacto;