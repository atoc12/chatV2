import { useEffect, useState } from "react";
import "./search.css";
import { Load } from "../components/load/load";
import { Post } from "../components/post/post";
import { GetPost, GetUser } from "./function";
import { ListUser } from "../components/userList/userlist";
import { useParams, useSearchParams } from "react-router-dom";
export const Search =()=>{

    const [queryParam,setQueryParam] = useSearchParams();
    const [load,setLoad] = useState(true);
    const [select,setSelect] = useState("user");
    const [content,setContent] =useState([]);
    const [search,setSearch] = useState(queryParam.get("q"));
    const [filter,setFilter] =useState({REGEX:search ?? ''});

    const handleChange =(e)=>{
        e.preventDefault();
        setSearch(e.target.value);
        setQueryParam({q:e.target.value});
    }

    useEffect(()=>{
        setContent([]);
        setLoad(true);
        if(select == 'post'){
            GetPost(search != "*" ?search : {}).then(contents=>{
                setContent(contents.data);
                setLoad(false);
            });
        }else{
            GetUser(search && search != "*" ?search :null,"name").then(contents=>{
                setContent(contents.data);
                setLoad(false);
            });
        }
    },[select,queryParam]);


    return(
        <div id="Search-index">
            <div className="search-form-div">                
                <input type="search" className="form-search" name="q" id="buscador" placeholder="Buscar" onChange={handleChange} value={search != "*" ? search : ''  } />
            </div>
            <div className="search-div">
                <section>
                    <div className={select == 'user' ? 'select-option' : 'select-option-disable'}>
                        <button className="btn" aria-label="filtro de usuario" onClick={()=>{setSelect('user');setContent([])}}>
                            Usuarios
                        </button>
                    </div>
                    <div className={select == 'post' ? 'select-option' : 'select-option-disable'}>
                        <button className="btn" aria-label="filtro de publicaciones" onClick={()=>{setSelect('post');setContent([])}}>
                            Publicaciones
                        </button>
                    </div>
                </section>
                <section className="search-div-content">
                    {
                        load ? <Load/> : 
                        <>
                            {
                                select == 'post' ? 
                                    <section>
                                        {
                                            content && content.length > 0  ? content.map((post,key) => <Post key={key} data={post} />) : null
                                        }
                                    </section> 
                                :null
                            }
                            {
                                select == 'user' ? 
                                    <section>
                                        {
                                            content && content.length > 0  ? content.map((user,key) => <ListUser data={user} key={key} /> ) : null
                                        }
                                    </section> 
                                :null
                            }
                        </>
                    }
                </section>
            </div>
        </div>
    )
}