import { createContext, useContext } from "react";
export const AlertContext = createContext();
export const useAlert =()=>{
    const {alert,setAlert} = useContext(AlertContext);
    return{alert,setAlert};
}