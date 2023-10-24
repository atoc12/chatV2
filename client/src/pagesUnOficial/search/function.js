import { User } from "../../api-client/functions/usuarios/usuario";
import { Publicaciones } from "../../api-client/functions/publicacion/publicacion";

export const GetUser =async (search={})=>{
    return await new User({search:search ? {name:{$regex:search}}: {} },"2").read().apply();
}
export const GetPost = async (search={})=> {
    return await new Publicaciones({search:search ? {content:{$regex:search}}: {}},"2").read().apply();
}