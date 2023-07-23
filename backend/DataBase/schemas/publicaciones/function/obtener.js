const ObtenerUsuarios = require("../../usuario/function/usuario/obtener");
const User = require("../../usuario/usuario");
const Publicacion = require("../publicaciones");

const ObtenerPublicacion =async (req,res=null)=>{
    try{
        const {search,user} = req.body;
        let resultado = await Publicacion.find(search ? search : {});
        let id = resultado.map(publi => publi.creator);
        let creador = await User.find({_id:{$in:id}}).select("_id name picture email");
        
        let estructura = resultado.flatMap(data=>{
            let ind = creador.filter(user => user._id.toString() === data.creator.toString())[0];
            if(ind){
                return {
                    _id:data._id.toString(),
                    creator:data.creator.toString(),
                    name: ind.name,
                    email: ind.email,
                    picture: ind.picture,
                    content:data.content,
                    like:data.like,
                    status:data.status,
                    channels: data.channels,
                    categories: data.categories,
                    timestamp: data.timestamp,
                };
            }
        })
        return estructura;
    }catch(err){
        console.log(err);
    }
}
module.exports= ObtenerPublicacion;