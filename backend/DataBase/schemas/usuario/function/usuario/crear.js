const idGenerator = require("../../../../../src/function/session");
const User = require("../../usuario");
const CrearUsuario = async(req,res=null)=>{// funcion que permite crear registros de usuarios
    try{
        let usuario_datos = await req.body.search;
        let usuario =await new User(usuario_datos);
        let session_value =idGenerator();
        console.log(usuario);
        if(req.body.session){
            usuario.conexion=true;
            usuario.session=session_value;
        }
        usuario.picture = `pic-${usuario._id.toString()}`;
        usuario.save();
        let mensaje = {message:"datos almacenados con exito",data:{_id:usuario._id.toString(),name:usuario.name,email:usuario.email,picture:usuario.picture},session:session_value};
        return res ? res.json(mensaje) : {mensaje};
    }catch(err){
        let errores=err.errors;
        if(errores){
            for(let campos in errores){
                let campoError = errores[campos];
                if(campoError.kind === 'required') return res ? res.json({message:`${campos} is required`}) :{message:`${campos} is required`};
                if(campoError.kind  === 'minlength') return res ? res.json({message:`${campos} need min ${campoError.properties.minlength} characters`}):{message:`${campos} need min ${campoError.properties.minlength} characters`};
            }
        }
        if(err.code === 11000) return res ? res.json({message:"email used"}) : {message:"email used"}
        console.log(err);
    }
}
module.exports =  CrearUsuario