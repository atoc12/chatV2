import { User } from "../api-client/functions/usuarios/usuario";

export const ValidarToken =async ()=>{
    try{
        const TOKEN = localStorage.getItem("TOKEN");
        const RESULT= await new User({search:{session:TOKEN}},"2").read().apply();
        return RESULT
    }catch(err){
        console.log(err);
    }
}