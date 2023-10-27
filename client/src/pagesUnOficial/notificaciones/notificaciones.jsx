import { useEffect, useState } from 'react';
import './notificaciones.css';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { Load } from '../components/load/load';
import { socket } from '..';
import { useNotification } from '../../config/context/notification/notificacionContext';
import { useUser } from '../../config/context/user/userContext';
import { useTittle } from '../../config/context/tittle/tittlecontext';
import { useAlert } from '../../config/context/alert/alert';
export const Notificaciones=()=>{
    const {tittle,setTittle} = useTittle();
    const {user,setUser} = useUser()
    const {noti,setNoti} = useNotification()
    const [list,setList] = useState([]);
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        setTittle("notificaciones")
    },[]);
    useEffect(()=>{
        if(user){
            setList(noti);
            setLoad(false);
        }else{
            setLoad(true);
        }
    },[noti]);

    return(
        <div id="notfi-div">
            <section>
                <ul>
                    {   load ?
                            <Load/>
                        :
                        list && list.length > 0 ?
                        list.map((data,key)=>{
                            return(
                                <li key={key}>
                                    <ListNoti data={data}></ListNoti>
                                </li>
                            )
                        }):
                        <p style={{
                            position:"absolute",
                            top:"50%",
                            left:"50%",
                            transform:"translate(-50%,-50%)"
                        }}>No hay notificaciones</p>
                    }
                </ul>
            </section>
        </div>
    )
}



const ListNoti =({data})=>{
    const fecha = new Date(data.timestamp);
    const {user} = useUser();
    const [status,setStatus] = useState(true);
    const {alert,setAlert} = useAlert()
    return(
        <div className='list-noti' style={status ? {} :{display:"none"}}>
            <section>
                <section>
                    <h1>
                        {data.name}
                    </h1>
                </section>
                <section>
                    {`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}  ${fecha.getHours()}:${fecha.getMinutes()}`}
                </section>
            </section>
            <section>
                {data.content}
            </section>
            <div className='list-noti-buttons'>
                <button onClick={()=> socket.emit("delete-noti",{user:user._id,notificacion:data._id,})}><BsTrash/></button>
                {/* <button><AiOutlineCheck/></button> */}
            </div>
        </div>

    )
}