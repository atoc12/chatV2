import { useEffect, useRef, useState } from 'react';
import { Publicacion } from '../index/Publicaciones/publicacion';
import './cuenta.css';
import { useUser } from '../../../config/context/user/userContext';
import { appVar } from '../../../config/var';
import { socket } from '../home';
import { useParams } from 'react-router-dom';
import { HandeDelete } from '../../../config/functions/usuarios/contactos/borrar';
import { handleOpcion } from '../../../config/functions/usuarios/contactos/confirmar';
import { Icon } from '../components/icon-user/icon-user';
import { useSolicitud } from '../../../config/context/solicitud/solicitudContext';
import { useContactos } from '../../../config/context/contactos/contactos';
import { HandleDeleteSolicitud } from '../../../config/functions/usuarios/solicitud/borrar';
import { useTittle } from '../../../config/context/tittle/tittlecontext';
export const Cuenta = ()=>{
    const {id} = useParams();
    const {user,setUser} = useUser()
    const {solicitud,setSolicitud} = useSolicitud()
    const {contactos,setContactos} = useContactos();
    const {tittle,setTittle} = useTittle();
    const [select,setSelect] = useState(0);
    const [usuario,setUsuario] = useState(null);
    const [confirm,setConfirm] = useState(false);
    const [iscontact,setIsContact] = useState(undefined);
    const scrolldiv = useRef(null);
    const [publicaciones,setPublicaciones] = useState([]);
    useEffect(()=>{
        scrolldiv.current.addEventListener("scroll",(e)=>{
            const scrollDiv = scrolldiv.current;
            const scrollPosition = scrollDiv.scrollLeft;
            const containerWidth = scrollDiv.clientWidth;
            const contentWidth = scrollDiv.scrollWidth;
            if (scrollPosition > contentWidth / 2 - containerWidth / 2) {
                setSelect(1);
            }else{
                setSelect(0);
            }
        });
    },[])
    useEffect(()=>{
        setTittle(`${id}`);
        socket.emit("obtener-usuario",{datos:id,user:user});
        socket.on("actualizar-usuario-info",()=>socket.emit("obtener-usuario",{datos:id,user:user}))
    },[id]);
    useEffect(()=>{
        socket.on("recibir-informacion-usuario",data=>setUsuario(data));
        socket.on("recibir-publicacion",datos=>setPublicaciones(datos));
        if(usuario){
            socket.on("actualizar-usuario-info",()=>socket.emit("obtener-usuario",{datos:id,user:user}))
            socket.emit("obtener-publicacion",{creator:usuario._id});
            setIsContact(contactos.filter(contacto=> contacto._id == usuario._id).length >0  ? true :false);
            let soli = solicitud.filter(solicitud=> solicitud._id == usuario._id);
            setConfirm(soli.length > 0 ? soli[0]: false);
        }
    },[usuario,id])
    useEffect(()=>{
        if(usuario){
            let soli = solicitud.filter(solicitud=> solicitud._id == usuario._id);
            setConfirm(soli.length > 0 ? soli[0]: false);
        }
    },[solicitud])

    useEffect(()=>{
        if(usuario){
            setIsContact(contactos.filter(contacto=> contacto._id == usuario._id).length >0  ? true :false);
        }
    },[contactos])
    return(
        <div id='cuenta'>
            <div id='cuenta-banner'>
                <div>
                    <div className={`banner ${ usuario && usuario.picture ? '' : 'load'}`}>
                        {
                            usuario && usuario.picture ?
                                <img src={`${appVar.ip+"/carpetas/usuario/icon/pic-"+usuario._id+".jpeg"}`} alt="" className='banner' />
                            :<></>
                        }
                    </div>
                    <section>
                        <section id='cuenta-img'>
                                <Icon data={usuario}></Icon>
                        </section>
                        <section>
                            <section>{usuario ? usuario.name : ''}</section>
                        </section>
                    </section>
                    <section>
                        {
                            usuario && usuario._id  != user._id  ? <>
                                {   
                                    usuario.solicitud ? 
                                        <button className='btn' onClick={()=>HandleDeleteSolicitud(usuario,user)}>Cancelar solicitud</button> 
                                    : confirm ? <>
                                        <button className='btn' onClick={()=>handleOpcion(usuario,false,user)}>rechazar</button>
                                        <button className='btn' onClick={()=>handleOpcion(usuario,true,user)}>aceptar</button>
                                    </> 
                                    :
                                    iscontact ?
                                        <button className='btn' onClick={()=>HandeDelete(usuario,user)}>
                                            Eliminar
                                        </button>
                                    : 
                                        <button className='btn' onClick={()=>{socket.emit("enviar-solicitud",{_id:user._id,name:user.name,contact_name:usuario.name})}}>
                                            Agregar
                                        </button> 
                                }
                                
                                <button className='btn'>Seguir</button>
                            </>:<></>
                        }
                        
                    </section>
                </div>
            </div>
            <div>
                <a href="#misPublicaciones" onClick={()=>setSelect(0)} style={{borderBottom:`2px solid ${select == 0 ? 'cyan' : 'transparent'}`}}>publicaciones</a>
                <a href="#MeGusta"onClick={()=>setSelect(1)} style={{borderBottom:`2px solid ${select == 1 ? 'cyan' : 'transparent'}`}}>Me gusta</a>
            </div>
            <div ref={scrolldiv}>
                <div id='misPublicaciones'>
                    {
                        publicaciones.map((data,key)=>{
                            return(
                                <Publicacion data={data} respuesta={true} key={key}/>    
                            )
                        })
                    }
                </div>
                <div id='MeGusta'>
                        
                </div>
            </div>
        </div>
    )
}