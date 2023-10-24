import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../config/context/user/userContext';
import './user.css';
import { useEffect, useState } from 'react';
// import { DeleteUser, GetUser, UpdateUser } from './function';
import { Icon } from '../components/profile-icon/icon';
import { appVar } from '../../config/var';
import { GetPost, GetUser } from './function';
import { Load } from '../components/load/load';
import { Post } from '../components/post/post';
import { OptionsUser } from './options/optionsUser';
import { socket } from '..';
import { useSolicitud } from '../../config/context/solicitud/solicitudContext';
import { useContactos } from '../../config/context/contactos/contactos';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
export const Accont = ()=>{
    const {user} = useUser();
    const {name} = useParams();
    const {solicitud} = useSolicitud();
    const {contactos} = useContactos();
    const [userInfo,setUserInfo] = useState(null);
    const [loadPub,setLoadPub] = useState(true);
    const [elements,setElements]  = useState([])
    const [filter,setFilter] = useState("post");
    const history = useNavigate();
    useEffect(()=>{
        socket.on("recive-user-update",(info)=>{
            setUserInfo(info);
        });
        socket.on("recive-user-change",(data)=>{
            GetUser(name).then(data=>setUserInfo(data.data[0]));    
        })
    },[])
    useEffect(()=>{
        GetUser(name).then(data=>setUserInfo(data.data[0]));
    },[name]);
    useEffect(()=>{
        setElements([])
        if(userInfo && userInfo[filter]?.length > 0 ){
            GetPost({_id:userInfo[filter]})
                .then(datos=>{
                   setElements(datos.data);
                   
                })
                .catch(err => console.log(err))
                .finally(()=>setLoadPub(false))
        }else{
            setLoadPub(false)
        }
        
    },[userInfo,filter])
    return(
        <div className="accont">
            <div className='accont-header' style={userInfo && {backgroundImage:`url(${appVar.ip+"/carpetas/usuario/icon/pic-"+userInfo._id+".jpg"})`}}>
                {
                    userInfo ? 
                        <>
                            <section className='accont-user-info'>
                                <section>
                                    <Icon data={userInfo}/>
                                </section>
                                <h1>{userInfo.name}</h1>
                            </section>
                            
                            <section className='accont-user-options'>
                                {
                                    user && userInfo._id != user._id && 
                                    <OptionsUser
                                         userInfo={userInfo} 
                                         contactos={contactos.length > 0  && contactos.filter(element=> userInfo._id == element._id)[0]}
                                         solicitud={solicitud.length > 0  && solicitud.reduce(element=> element._id === userInfo._id)}
                                         isMyRequest={userInfo.solicitud.includes(user._id)}
                                    />
                                }
                            </section>
                        </>
                    : null
                }
            </div>
            <div className='accont-options-div'>
                <section>
                    <button className='btn' onClick={()=>setFilter("post")}>Publicaciones</button>
                </section>
                <section>
                    <button className='btn' onClick={()=>setFilter("post_like")}>Me gusta</button>
                </section>
            </div>
            <div className='accont-content'>
                { loadPub ? 
                    <Load/> 
                    :
                    elements && elements.map((info,key)=> <Post key={key} data={info} /> )
                }               
            </div>
        </div>
    )
}