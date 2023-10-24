import { createContext, useContext } from "react";

export const ChatContext = createContext();

export const useChat =()=>{
    const {chat,setChat} = useContext(ChatContext);
    return{chat,setChat};
}