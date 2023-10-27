import { Publicaciones } from "../../../api-client/functions/publicacion/publicacion";

export async function Update (post,{specify,value}){
    const POST = await new Publicaciones({search:{_id:post._id},specify:specify,value:value},"2").update().apply();
    console.log(POST);
}

export async function Delete(post){
    const POST = await new Publicaciones({search:{_id:post._id}},"2").delete().apply();
    return POST;
}