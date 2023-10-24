const Publicacion = require("../../publicaciones");

const ObtenerComentarios =async (req,res=null)=>{
    try{
        const {search} = req.body;
        let response = await Publicacion.findById(search._id).select(`response`);
        console.log(response);
        
    }catch(err){
        console.log(err);
    }
}
module.exports = ObtenerComentarios;