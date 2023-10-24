import './crearPublicacion.css';
import { useUser } from "../../../../../config/context/user/userContext";
import { appVar } from "../../../../../config/var";
import { socket } from '../../../home';
import { Icon } from '../../../components/icon-user/icon-user';
import { useEffect, useState } from 'react';
export const CrearPublicacion =({add,setAdd})=>{
    const {user,setUser} = useUser()
    const [valueCategorias,setValueCategorias] = useState(['Entretenimiento','informacion','comedia','game','stream','politica','cine'])
    const [categorias,setCategorias] = useState([]);
    useEffect(()=>{
        
    },[])
    return(
        <>
           <div id='crear-publicacion'>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        let text = document.getElementById("texto-publicacion").value;
                        if(text.length > 0){
                            let publicacion = {
                                user:user,
                                publicacion:{
                                    content:text,
                                    categories:categorias,
                                    timestap:new Date(),
                                }
                            }
                            socket.emit("crear-publicacion",publicacion);
                            socket.emit("obtener-publicacion",{});
                            setAdd(false);
                        }
                    }}>
                        <div className='publicacion'>
                            <div>
                                <Icon data={user}></Icon>
                                <p>
                                    {user.name}
                                </p>
                                <div className='categorias-publicacion'>
                                    <ul>
                                        {
                                            categorias.map((datos,key)=>{
                                                return(
                                                    <li key={key} onClick={()=>{
                                                        setCategorias(categorias.filter((categoria) => categoria !== datos))
                                                        setValueCategorias([...valueCategorias,datos]);    
                                                    }}>
                                                        {datos}
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <textarea name="" id="texto-publicacion"></textarea>
                                </div>
                                <div>
                                    <span>{`xx/xx/xx`}</span>
                                    <span>{`xx:xx`}</span>
                                </div>
                            </div>
                        </div>        
                        <section id='publicacion-options'>
                            <div className='categorias-div'>
                                <h1>categorias</h1>
                                <section className='publicacion-option-select'>
                                    {
                                        valueCategorias.map((datos,key)=>{
                                            return(
                                                <section className='checkbox-categorias' key={key}>
                                                    <input type="checkbox" name={datos} id={datos} value={datos} onClick={()=>{
                                                        setValueCategorias(valueCategorias.filter((categoria) => categoria !== datos))
                                                        setCategorias([...categorias,datos]);
                                                    }}/>
                                                    <label htmlFor={datos}>{datos}</label>
                                                </section>
                                            )
                                        })
                                    }
                                </section>
                            </div>
                            <button type="submit" className='btn'>Enviar</button>
                        </section>
                    </form>
                </div>       
        </>
    )
}