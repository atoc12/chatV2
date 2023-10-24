import { createContext, useContext } from "react";
export const notiContext = createContext();
export const useNotification =()=>{
    const {noti,setNoti} = useContext(notiContext);
    return{noti,setNoti};
}