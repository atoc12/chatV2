import { appVar } from "../var";

export const EatApi =async ({method="GET",datos=null,path="",url=appVar.ip,json=true})=>{
    var respons = null;
    if(method =="GET"){
        respons = await fetch(url+path);
    }else{
        respons = await fetch(url+path,{
            method:method,
            headers:{
                "Content-Type":"application/json",
            },
            body: json ? JSON.stringify(datos) : datos
        })
    }
    return await respons.json();
}