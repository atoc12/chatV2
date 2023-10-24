import { createContext, useContext } from "react";
export const ContactosContext = createContext();
export const useContactos =()=>{
    const {contactos,setContactos} = useContext(ContactosContext);
    return{contactos,setContactos};
}