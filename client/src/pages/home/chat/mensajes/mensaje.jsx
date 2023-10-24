import { useEffect } from 'react';
import './mensajes.css';
import { appVar } from '../../../../config/var';
import { useUser } from '../../../../config/context/user/userContext';
import { Icon } from '../../components/icon-user/icon-user';
export const Mensaje =({sender=false,content="content",data,contacto})=>{
    const {user,setUser} = useUser();
    let fecha = new Date(data.timestamp);
    useEffect(()=>{
        console.log(data);
    },[])
    return(
        <div className='mensaje-div' style={{justifyContent:sender ?"end" :"start"}}>
            <div style={{order: sender ? "2" : "1"}}>
                <Icon data={sender ? user : data} />
            </div>
            <div 
                style={ 
                    sender ? 
                        {right:"0",justifyContent:"end"} 
                    : 
                    {left:"0"}} 
            >
                {
                    data.timestamp ? <>
                        <span>
                            {`${fecha.getHours()}:${fecha.getMinutes()}`}
                        </span>
                    </>
                    : "reciente"
                }
            </div>
            <div style={{order: sender ? "1" : "2"}} >
                <p>
                    {content}
                </p>
            </div>
        </div>
    )
}