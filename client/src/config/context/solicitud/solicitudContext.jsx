import { createContext, useContext } from "react";

export const SolicitudContext = createContext();


export const useSolicitud =()=>{
    const {solicitud,setSolicitud} = useContext(SolicitudContext);
    return{solicitud,setSolicitud};
}