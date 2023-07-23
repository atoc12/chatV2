const Publicacion = require("../publicaciones");

const BorrarPublicacion = async (req,res=null)=>{
    try{    
        const {search,user} = req.body;
        let res = await Publicacion.findOneAndDelete({_id:search._id}).where('creator').equals(user._id);
    }catch(err){    
        console.log(err);
    }
}

module.exports = BorrarPublicacion;