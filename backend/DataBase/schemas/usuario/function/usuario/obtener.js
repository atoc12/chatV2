const idGenerator = require("../../../../../src/function/session");
const User = require("../../usuario");
const ObtenerUsuarios = async (req,res=null)=>{
    try{
        let {search,value} = req.body;
        let session = req.body.session ? req.body.session : null;
        let datos_value = value ? value.join(" ",",") : '';
        let resultado =await User.findOne(search).select(datos_value);
        if(session){
            if(!resultado){
                console.log("no se abre session");
            }else{
                var newId = idGenerator();
                await User.findOneAndUpdate(search,{session:newId,conexion:true},{new:true}); // se crea el id y luego se almacena
                resultado = {
                    _id:resultado._id,
                    email:resultado.email,
                    name: resultado.name,
                    solicitud:resultado.solicitud,
                    picture:resultado.picture
                }
                return res.json({message:"exito",data:resultado,session:newId});
            }
        }
        let mensaje = resultado ? {message:"exito",data:resultado} : {message:'usuario no encontrado'};
        if(!res) return mensaje;
        res.json(mensaje);

    }catch(err){
        console.log(err);
    }
}

module.exports = ObtenerUsuarios;