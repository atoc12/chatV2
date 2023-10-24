import { socket } from "../../../../pages/home/home"

export const HandleDeleteSolicitud =(data,user)=>{
       socket.emit("borrar-solicitud",{data,user}) 
}