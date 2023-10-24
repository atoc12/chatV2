import { socket } from "../../../../pages/home/home";
export const handleOpcion = (datos,valor,user)=>{
    socket.emit("confirmar-solicitud",{data:datos,value:valor,user:user});
}