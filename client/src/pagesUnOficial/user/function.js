import { Publicaciones } from "../../api-client/functions/publicacion/publicacion";
import { User } from "../../api-client/functions/usuarios/usuario";

export const GetUser =async (search)=>{
    return await new User({search:{name:search}},"2").read().apply();
}

export const UpdateUser = async (value)=>{
    return await new User({specify:'solicitud',value:value},'2').update().apply();
}

export const GetPost = async (value)=>{
    return await new Publicaciones({search:value},"2").read().apply();
}