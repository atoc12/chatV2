import { Publicaciones } from "../../api-client/functions/publicacion/publicacion";
import { User } from "../../api-client/functions/usuarios/usuario"


export const GetData = async (search)=>{
    return await new User({search:{name:search}},"2").read().apply();
}

export const GetPost = async (search)=>{
    return await new Publicaciones({search:search},"2").read().apply();
}
export const CreatePost = async (search,idPostResponse,content)=>{
    return await new Publicaciones({search:{_id:search},value:{myResponse:idPostResponse,content:content}},"2").create().apply();
}