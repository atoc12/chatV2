import { Publicaciones } from "../../api-client/functions/publicacion/publicacion"

export const GetPost = async ()=>{
    const POST =await new Publicaciones({search:{status:true},response:true},"2").read().apply();
    return POST;
}