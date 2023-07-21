const Publicacion = require("../publicaciones");

const CrearPublicacion = async(req,res=null)=>{
    try{
        const data = req.body;
        let nueva_publicacion = new Publicacion(data).save();
        return {message:"publicacion creada"};
    }catch(err){
        console.log(err);
    }
}

module.exports=CrearPublicacion;