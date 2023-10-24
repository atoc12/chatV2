import { useEffect } from "react";
import { socket } from "../..";
import { useSolicitud } from "../../../config/context/solicitud/solicitudContext";
import { useUser } from "../../../config/context/user/userContext"
import { useContactos } from "../../../config/context/contactos/contactos";

export const OptionsUser = ({userInfo,contactos,solicitud,isMyRequest})=>{
    const {user} = useUser();
    const handlerToggleRequest = (here=true)=>{
        socket.emit("send-request",
            {
                user:userInfo._id,
                user2:user._id
            }
        );
    }
    const handlerSelect = ()=>{
        socket.emit('add-contact',
            {
    
                user:user._id,
                value:userInfo._id
            }
        )
    }

    const handleRemove = ()=>{
        socket.emit('remove-contact',
            {
                user:userInfo._id,
                value:user._id
            }   
        )  
    }
    useEffect(()=>{
        // console.log(contactos,solicitud,isMyRequest)
    })
    return (
        <section>

            {
                !contactos && !solicitud && !isMyRequest ? 
                    <button className="btn" onClick={handlerToggleRequest}>Añadir</button>
                :
                isMyRequest ?
                    <button className="btn" onClick={handlerToggleRequest}>Cancelar</button>
                :
                solicitud ? 
                    <>
                        <button className="btn" onClick={handlerSelect}>Aceptar</button>
                        <button className="btn" onClick={handlerToggleRequest}>Rechazar</button>
                    </>
                :
                contactos ? 
                    <button className="btn" onClick={handleRemove}>Eliminar</button>
                :null
                
            }






            {/* {
                user && contactos.includes(userInfo._id) ? 
                        <button 
                            className="btn"
                            onClick={()=>{
                                socket.emit('remove-contact',
                                        {
                                            user:userInfo._id,
                                            value:user._id
                                        }
                                    )  
                                }
                            }
                        >
                            Eliminar
                        </button> 
                :
                    user && solicitud.includes(userInfo._id) && !contactos.includes(userInfo._id) ?
                        <>
                            <button 
                                className="btn" 
                                onClick={()=>{
                                    socket.emit('add-contact',
                                            {
                                                    user:userInfo._id,
                                                    value:user._id
                                            }
                                        )
                                    }
                                }
                            >
                                Rechazar
                            </button>

                            <button 
                                className="btn"
                                onClick={()=>{
                                        socket.emit('add-contact',
                                            {
                                    
                                                user:user._id,
                                                value:userInfo._id
                                            }
                                        )
                                    }
                                }
                            >
                                Aceptar
                            </button>
                        </>
                        :
                        <button> 
                            { userInfo.solicitud.includes(user._id) ? "Cancelar" : "Añadir" }
                        </button>
            } */}
        </section>
    )
}

