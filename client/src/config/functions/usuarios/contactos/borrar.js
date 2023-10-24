import { socket } from "../../../../pages/home/home";
export const HandeDelete=(data,user)=>{
    socket.emit("borrar-contacto",{
        contacto:{
            _id:data._id,
            name:data.name
        },
        user:user
    })
    console.log("borrar "+data._id);
}