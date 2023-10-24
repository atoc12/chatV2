import { createContext, useContext } from "react";
export const TittleContext = createContext();
export const useTittle =()=>{
    const {tittle,setTittle} = useContext(TittleContext);
    return{tittle,setTittle};
}