import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

export const InputSearch = ()=>{
    const history = useNavigate();
    const [search,setSearch] = useState('');
    const handeSubmit = (e)=>{
        e.preventDefault();
        history(`/search?q=${search ? search : '*'}&in=usuario`);
    }
    return(
        <form action="/search" method="post" className="form-home-sup" onSubmit={handeSubmit}>
            <input type="search" name="" id="" placeholder="Buscar" className="input-primary" aria-label="Buscador" onChange={(e)=>setSearch(e.target.value)}/>
        </form> 
    )
}