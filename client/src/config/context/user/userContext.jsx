import { createContext, useContext } from "react";

export const userContext = createContext();


export const useUser =()=>{
    const {user,setUser} = useContext(userContext);
    return{user,setUser};
}