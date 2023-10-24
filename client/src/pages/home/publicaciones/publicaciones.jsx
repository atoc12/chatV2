import { useEffect, useState } from 'react';
import './publicacion.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../config/context/user/userContext';
import { Publicacion } from '../index/Publicaciones/publicacion';
import { socket } from '../home';
import { AiOutlineArrowLeft, AiOutlineSend } from 'react-icons/ai';
export const PublicaionPages = ({select,setSelect,respusta=true})=>{
    const {id} = useParams()
    const {user,setUser} = useUser();
    const history = useNavigate();
    const [publicacion,setPublicacion]=useState(null);
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
        e.target["text-content"].value='';
        setContent(null)
    }
    useEffect(()=>{
        setComentarios(null);
    },[select])
    useEffect(()=>{
        socket.emit("obtener-publicacion",{_id:id});
        socket.on("recibir-publicacion",(data)=>setPublicacion(data[0]));
        socket.on("recargar-comentarios",(data)=>socket.emit("obtener-comentarios",{search:{_id:id}}));
        socket.on("recibir-comentarios",(datos)=>{
            setComentarios(datos);
        });
        socket.on("recive-update-"+id,()=>{
            console.log(a);
        });
    },[id])
    useEffect(()=>{
        if(publicacion){
            socket.emit("obtener-comentarios",{search:publicacion._id});
        }
    },[publicacion])
    return(
        <div id='Publicacion-select'>
            <div id='Publicacion-select-content'>
                <div>
                    <button onClick={()=>history(-1)} className='btn'><AiOutlineArrowLeft/></button>
                </div>
                <section id='Publicaciones'>
                    {publicacion ? <Publicacion data={publicacion} respuesta={true} page={true}></Publicacion>:<>cargando...</>}
                </section>
                <section id='comentarios'>
                        <section id='send-comment'>
                            <form onSubmit={(e)=>HandleSubmit(e)}>
                                <input type="text" name="text-content" id="" placeholder='Responder' onChange={(e)=>setContent(e.target.value)} className='btn' />
                                <button type="submit" className='btn'><AiOutlineSend/></button>
                            </form>
                        </section>
                        <ul>
                            {
                                comentarios && comentarios.length > 0 ? 
                                    comentarios.map((data,key)=>{
                                        return(
                                            data.status ? 
                                            <li key={key}>
                                                <Publicacion data={data} respuesta={false} ></Publicacion>
                                            </li>
                                            :null
                                        )
                                    })
                                    :<></>
                            }
                        </ul>
                </section>
            </div>
        </div>
    )
}