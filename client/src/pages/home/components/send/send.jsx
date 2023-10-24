import { useEffect, useState } from 'react';
import { useContactos } from '../../../../config/context/contactos/contactos';
import { useUser } from '../../../../config/context/user/userContext';
import { Icon } from '../icon-user/icon-user';
import './send.css';
import { useSend } from '../../../../config/context/send/sendContext';
export const Send = ()=>{
    const {user,setUser} = useUser()
    const {setSend} = useSend()
    const {contactos,setContactos} = useContactos()
    const [filter,setFilter] = useState(contactos);
    const [search,setSearch] = useState(null);
    useEffect(()=>{
        setFilter(contactos);
    },[contactos])
    useEffect(()=>{
        if(search){
            setFilter(contactos.filter(data => data.name.includes(search) ? data : null));
        }else if(search == ''){
            setFilter(contactos);
        }
    },[search])
    return(
        <div id="send-components">
            <div onClick={()=>setSend(null)}></div>
            <section>
                <section>
                    <input type="search" name="" id="" placeholder='Buscar' onChange={(e)=>setSearch(e.target.value)}/>
                </section>
                <section>
                    <ul>
                        {
                            filter ?
                                filter.map((datos,key)=>{
                                    return(
                                        <li key={key}>
                                            <Icon data={datos}> </Icon>
                                            <h4>{datos.name}</h4>
                                            <button className='btn'>Enviar</button>
                                        </li>
                                    )
                                })    
                            :<></>
                        }
                    </ul>
                </section>
            </section>


        </div>
    )
}