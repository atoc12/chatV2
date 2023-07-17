const User = require("../../usuario");
const ObtenerNotifiaciones = async (req,res)=>{
    try{
        let datos= req.body;
        let datos_search= datos.search;
        let resultado=await User.findOne(datos_search,`notificaciones`);
        if(res)return res.json(resultado);
        return resultado;
    }catch(err){console.log(err)}
}

module.exports = ObtenerNotifiaciones;