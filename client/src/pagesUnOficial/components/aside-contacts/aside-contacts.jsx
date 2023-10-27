import { useEffect, useState } from 'react';
import './aside-contacts.css';
import { useContactos } from '../../../config/context/contactos/contactos';
import { Load } from '../load/load';
import { useSolicitud } from '../../../config/context/solicitud/solicitudContext';
import { Request } from './request/request';
import { Contact } from './contacts/contacts';
import { AiOutlineClose } from 'react-icons/ai'
import { LuPanelLeftClose } from 'react-icons/lu'
export const AsideContacts = ()=>{
    const [open,setOpen] = useState(false);
    const {contactos} =useContactos();
    const {solicitud} = useSolicitud();
    const [option,setOption] = useState('contacts');
    const [content,setContent] = useState(contactos);
    const [load,setLoad] = useState(true);
    const [filter,setFilter] = useState('');
    useEffect(()=>{
        if(content ){
            setLoad(false);
        }
    },[content])
    return(
        <>  
            <button className={`btn-aside-contact btn ${open ? 'd-n' : 'op-1 d-f'}` } onClick={()=>setOpen(!open)}> <LuPanelLeftClose/> </button>
            <div id='aside-contacts' className={open ? "active-aside" : "disable-aside"}>
                <div className='aside-contacts-options'>
                    <button className='btn' onClick={()=>setOpen(!open)}>
                        <AiOutlineClose/>
                        <span>
                            Mi panel
                        </span>
                    </button>
                    <section>
                        <div className={`${option == "contacts" ? "active-aside-contacts" : 'disable-aside-contacts'}`}>
                            <button className='btn' onClick={()=>setOption('contacts')}>
                                Contactos
                            </button>
                        </div>
                        <div className={`${option == "request" ? "active-aside-contacts" : 'disable-aside-contacts'}`}>
                            <button className='btn' onClick={()=>setOption('request')}>
                                Solicitud
                            </button>
                        </div>
                    </section>
                </div>
                <div className='aside-contacts-content'>
                    <form>
                        <input type="search" className='form-search' placeholder='Buscar' onChange={(e)=>setFilter(e.target.value)} />
                    </form>
                    <div>
                        {
                            load ? 
                                <Load/>
                            :
                            option == "request" ?  
                                solicitud.filter(data=> data.name?.includes(filter)).map((data,key)=>{
                                    return <Request data={data} key={key}/>
                                })
                            :
                            option == "contacts" ?
                                contactos.filter(data=> data.name.includes(filter)).map((data,key)=>{
                                    return <Contact data={data} key={key}/>
                                })
                            :null

                        }
                    </div>
                </div>
            </div>
        </>
    )
}