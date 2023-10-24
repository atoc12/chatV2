import './publicaciones.css';
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../config/context/user/userContext";
import { NavLink, useNavigate} from 'react-router-dom';
import { Icon } from '../../components/icon-user/icon-user';
import { socket } from '../../home';
import { SlOptionsVertical } from 'react-icons/sl';
import { LiaShareSolid } from 'react-icons/lia'
import {CiBookmark, CiRepeat} from 'react-icons/ci'
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Send } from '../../components/send/send';
import { useSend } from '../../../../config/context/send/sendContext';
import { BsBookmark } from 'react-icons/bs';
export const Publicacion = ({data,page=false,respuesta=false})=>{
    const {user,setUser} = useUser();
    const {send,setSend} = useSend()
    const [post,setPost] = useState(data)
    const history = useNavigate();
    const [ocultar,setOcultar] = useState(!data.status);
    const fecha =new Date(data.timestamp);
    const [like,setLike] = useState(user ? data.like.filter(like => like._id).length > 0 ? true : false : false);
    useEffect(()=>{
        socket.on("recive-post-update-"+data._id,(data)=>{
                if(data.data){
                    setPost(data.data);
                }
        });
    },[])
    return(
        <div className='publicacion'>
            <span style={{display:ocultar ? 'flex' : 'none'}}>Publicacion oculta</span>
            <div>
                <Icon data={data}></Icon>
                <div className='option-publicacion'>
                        <section>
                            <span><SlOptionsVertical></SlOptionsVertical></span>
                            {
                                user ?     
                                    <ul>
                                        <li><button className='btn'>reportar</button></li>
                                        {
                                            post.creator  == user._id ? 
                                            <>
                                                <li>
                                                    <div className='option-publicacion-user'>
                                                        {
                                                            post.creator === user._id ? <div><BtnOption option={ocultar} setOption={setOcultar}></BtnOption></div>
                                                            : <></>
                                                        }
                                                        
                                                    </div>
                                                </li>
                                                <li>
                                                    <button className='btn' onClick={()=>socket.emit("borrar-publicacion",{publicacion:data._id,user:user,})}>borrar</button>
                                                </li>
                                                <li>
                                                    <button className='btn'>editar</button>
                                                </li>
                                            </>:
                                            <></>
                                        }
                                    </ul>
                                :<></>
                            }
                    </section>
                </div>
                <NavLink to={"/home/usuario/"+data.name}>
                    {data ? data.name : ''}
                </NavLink>
                <div className='categorias-publicacion'>
                    <ul>
                        {
                            data && data.categories ? 
                                data.categories.map((datos,key)=>{
                                    return(
                                        <li key={key}>
                                            {datos}
                                        </li>
                                    )
                                })
                            :<></>
                        }

                    </ul>
                </div>
                
            </div>            
            <div className='redirect-public' onClick={()=>{ page ? null  : history('/home/publicacion/'+data._id)}}></div>
            <div className={`mid-public ${data.categories && data.categories.includes('respuesta') && !respuesta == false ?'respuesta' :''}`}>
                <div>
                    <p>
                        {post.content}
                    </p>
                    {
                        data.categories && data.categories.includes('respuesta') && !respuesta == false ? data.myresponse ? 
                            <Publicacion data={data.myresponse}></Publicacion>
                            :<div className='error-publicacion'>No se ha encontrado la publicacion</div>
                        :
                            null
                    }
                </div>
                <div>
                    {
                        respuesta ? <>    
                            <section>
                                <section className={`btn ${like ? 'use-btn-post' : 'button-font-color-post'}`}>
                                    <button className='btn' onClick={()=>{
                                        socket.emit(like ? 'delete-post' : 'update-post',{search:{_id:data._id},value:{_id:user._id},specify:'like'});
                                        setLike(!like);
                                    }}><AiOutlinePlusCircle/></button>
                                    <span>{post.like.length}</span>
                                </section>
                                <section>
                                    <button className='btn button-font-color-post'><CiRepeat/></button>
                                    <span>0</span>
                                </section>
                                <section>
                                    <button className='btn button-font-color-post' onClick={()=>setSend(data._id)}>
                                        <LiaShareSolid/>                         
                                    </button>
                                </section>
                                <section>
                                    <button className='btn button-font-color-post'><CiBookmark/></button>
                                </section>
                            </section>
                        </> : <></>
                    }
                    <section>
                        <span>{`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`}</span>
                        <span>{`${fecha.getHours()}:${fecha.getMinutes()}`}</span>
                    </section>
                </div>
            </div>
        </div>
    )
}

const BtnOption = ({option,setOption})=>{
    return(
        <section className='btn-option' onClick={()=>{setOption(!option)}}>
            <button className='btn' style={{transform:`translateX(${!option ? '0' : '100' }%)`}}></button>
        </section>
    )
}