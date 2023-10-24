import { useEffect, useState } from 'react';
import { Publicacion } from '../publicacion';
import './SelectPublicacion.css';
import { useUser } from '../../../../../config/context/user/userContext';
import { socket } from '../../../home';
import { useParams } from 'react-router-dom';
export const SelectPublicacion = ({select,setSelect})=>{
    const {id} = useParams()
    const {user,setUser} = useUser();
    const [content,setContent] = useState(null);
    const [comentarios,setComentarios] = useState(null);
    const HandleSubmit = (e)=>{
        e.preventDefault();
        socket.emit("crear-comentario",{
            search:{
                _id:id
            },
            value:{
                sender:user._id,
                content:content,
                categories:['respuesta'],
                timestamp:new Date()
            }
        })
    }
    useEffect(()=>{
        setComentarios(null);
    },[select])
    useEffect(()=>{
        // socket.emit("obtener-comentarios",{search:select._id});
        // socket.on("recibir-comentarios",(datos)=>{
        //     console.log(datos);
        //     setComentarios(datos);
        // })
        // socket.on("recargar-comentarios",(data)=>socket.emit("obtener-comentarios",{search:select._id}))
    },[])
    return(
        <div id='Publicacion-select'>
            <div id='Publicacion-select-content'>
                <section id='Publicaciones'>
                    <Publicacion data={select}></Publicacion>    
                </section>
                <section id='comentarios'>
                        <section>
                            <form onSubmit={(e)=>HandleSubmit(e)}>
                                <input type="text" name="" id="" placeholder='Responder' onChange={(e)=>setContent(e.target.value)} />
                                <button type="submit">Enviar</button>
                            </form>
                        </section>
                        <ul>
                            {/* {
                                comentarios && comentarios.length > 0 ? 
                                    comentarios.map((data,key)=>{
                                        return(
                                            data.status ? 
                                            <li key={key}>
                                                <Publicacion data={data}></Publicacion>
                                            </li>
                                            :null
                                        )
                                    })
                                    :<></>
                            } */}
                        </ul>
                </section>
            </div>
            <div onClick={()=>setSelect(null)}></div>
        </div>
    )
}