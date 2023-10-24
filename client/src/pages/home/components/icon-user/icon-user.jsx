import { useEffect, useState } from 'react';
import { appVar } from '../../../../config/var';
import './icon-user.css';
export const Icon = ({data,children})=>{
    const [load,setLoad] = useState(false);
    return(
        <>
            {
                <span className={'icon '+(load ? '' : 'load')}> 
                    {
                        data ?
                            <>
                                <img loading='lazy' onLoad={()=>setLoad(true)} src={`${appVar.ip+"/carpetas/usuario/icon/pic-"+(data.creator || data.sender ? (data.creator ? data.creator : data.sender) : data._id )+".jpeg"}`} alt='icon'/> 
                            </>
                        :<></>
                    }
                    {children}
                </span>
            }
        </>
    )
}