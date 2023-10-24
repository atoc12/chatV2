import { Publicaciones } from "../../../../api-client/functions/publicacion/publicacion";

export async  function createPostFunction (data){
    try{
        return await new Publicaciones(data,"2").create().apply();
    }catch(Err){
        console.log(Err);
    }
}