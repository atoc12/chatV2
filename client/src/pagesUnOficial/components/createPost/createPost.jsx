import { useEffect, useState } from "react";
import "./crearPost.css";
import {AiOutlinePlus} from 'react-icons/ai'
import { BiCategoryAlt, BiWorld } from "react-icons/bi";
import { Icon } from "../profile-icon/icon";
import { createPostFunction } from "./functions/functions";
export const CreatePost = ({user,contentElements,setContentElements})=>{
    const [open,setOpen] = useState(false)
    const [content,setContent] = useState(null);
    const handlerSubmit=(e)=>{
        e.preventDefault();
        createPostFunction({value:{content:content},search:user}).then(datos=>{
            setContentElements([...contentElements,datos.data]);
            setOpen(false);
        }).catch(err=>console.log(err));
        
    }
    useEffect(()=>{
    },[content])
    return(
        <>
            {
                open ? 
                    <section id="post-from-section">
                        <div>
                            <section id="post-div-form">
                                    <form id="form-post" onSubmit={handlerSubmit}>
                                        <div>
                                            <Icon data={user} />
                                            <h4>{user.name}</h4>
                                        </div>
                                        <div id="form-post-text">
                                            <textarea name="" id="" placeholder="Contenido..." onChange={(e)=>setContent(e.target.value)}></textarea>
                                        </div>
                                        <div id="form-post-options">
                                            <section>
                                                <button className="btn">
                                                    <BiCategoryAlt/>
                                                    <span>
                                                        categorias
                                                    </span>
                                                </button>
                                                <button className="btn">
                                                    <BiWorld/>
                                                    <span>
                                                        Publico
                                                    </span>
                                                </button>
                                            </section>
                                            <section>
                                                <button type="submit" className="btn btn-primary">Enviar</button>
                                            </section>
                                        </div>
                                    </form>
                            </section>
                            <span onClick={()=>setOpen(!open)}></span>
                        </div>
                    </section>
                : null
            }

            <span id="btn-float-post">
                <button className="btn" onClick={()=>setOpen(!open)}>
                    <AiOutlinePlus/>
                </button>
            </span>
        </>
    )
}