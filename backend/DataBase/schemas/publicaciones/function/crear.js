const Publicacion = require("../publicaciones");

const CrearPublicacion = async(req,res=null)=>{
    try{
        const data = req.body;
        if(data.content.length > 1){
            let nueva_publicacion = new Publicacion(data).save();
            return {message:"publicacion creada"};
        }else{
            return {message:"debe ser mayor de un caracter"};
        }
    }catch(err){
        console.log(err);
    }
}

module.exports=CrearPublicacion;