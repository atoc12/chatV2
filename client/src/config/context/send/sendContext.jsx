import { createContext, useContext } from "react";
export const SendContext = createContext();
export const useSend =()=>{
    const {send,setSend} = useContext(SendContext);
    return{send,setSend};
}