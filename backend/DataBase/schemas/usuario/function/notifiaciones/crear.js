const User = require("../../usuario");

const CrearNotificacion =async (req,res=null)=>{
    try{
        const {search,value} = req.body;
        let resultado = await User.findOne(search).select("notificaciones");
        resultado.notificaciones.push(value);
        await resultado.save();

    }catch(err){console.log(err)}
}
module.exports = CrearNotificacion;