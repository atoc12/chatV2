import { useEffect } from "react";
import { useOutletContext } from "react-router-dom"

export const Soporte = ()=>{
    const [select,setSelect] = useOutletContext();
    useEffect(()=>{
        setSelect(3);
    },[])
    return(
        <>
            soporte
        </>
    )
} 