const User = require("../../usuario");
const ObtenerContacto = async (req,res=null)=>{
    try{
        let datos= req.body;
        let datos_search= datos.search;
        let resultado=await User.findOne(datos_search,`contactos`);
        if(res)return res.json(resultado);
        return resultado;
    }catch(err){console.log(err)}
}
module.exports = ObtenerContacto;