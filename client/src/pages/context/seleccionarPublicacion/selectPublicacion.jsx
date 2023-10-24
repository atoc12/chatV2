import { createContext, useContext } from "react";
export const SelectPubliContext = createContext();
export const useSelectPubli = ()=>{
    const {publiselect,setPubliSelect} = useContext(SelectPubliContext);
    return{publiselect,setPubliSelect};
}
