import { NavLink } from 'react-router-dom';
// import './menu.css';
import { AiOutlineHome, AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { RiContactsLine } from 'react-icons/ri'
import { BsChatSquareDots, BsDoorOpenFill } from 'react-icons/bs'
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useUser } from '../../../../config/context/user/userContext';
export const Menu = ({center,setCenter})=>{
    const [open,setOpen] = useState(true);
    const {user,setUser} = useUser();
    return(
        <div id='slider-menu' style={open ? {} : {transform:"translateX(-100%)",position:"fixed",height:"100%"}}>
                {
                    user ? 
                        <MenuOp1 setCenter={setCenter} center={center} setOpen={setOpen} open={open}/>
                    : <>
                        <button id='menu-btn' onClick={()=>setOpen(!open)}><AiOutlineMenu/></button>
                        <NavLink to={"/session/login"}>Iniciar session</NavLink>
                    </>
                }
        </div>
    )
}


const MenuOp1 = ({setCenter,center,setOpen,open})=>{
    const {user,setUser} = useUser();
    return(
        <>
        <section>
                    <h1>Menu</h1>
                    <section>
                        <nav>
                            <ul>
                                <li>
                                    <NavLink to={"/home"} onClick={()=>setCenter(true)}>
                                        <div>
                                            <AiOutlineHome/>                              
                                        </div>
                                        <div>
                                            Inicio
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/home/contactos"}onClick={()=>setCenter(true)}>
                                        <div>
                                            <RiContactsLine/>             
                                        </div>
                                        <div>
                                            contactos
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/home/chats"}onClick={()=>setCenter(true)}>
                                        <div>
                                            <BsChatSquareDots/>              
                                        </div>
                                        <div>
                                            chats
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/home/notificaciones"}onClick={()=>setCenter(true)}>
                                        <div>
                                            <HiOutlineBellAlert/>
                                        </div>
                                        <div>
                                            notificaciones
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/home/cuenta"}onClick={()=>setCenter(true)}>
                                        <div>
                                            <AiOutlineUser/>  
                                        </div>
                                        <div>
                                            cuenta
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </section>
                </section>
                <button id='menu-btn' onClick={()=>setOpen(!open)}><AiOutlineMenu/></button>
                <section>
                    <ul>
                        <li>
                            <button>
                                <div>
                                    <IoSettingsOutline/>         
                                </div>
                                <div>
                                    ajustes
                                </div>
                            </button>
                        </li>
                        <li>
                            <button onClick={()=>{
                                localStorage.removeItem("USER");
                                localStorage.removeItem("TOKEN");
                                setUser(null);
                            }}>
                                <div>
                                    <BsDoorOpenFill/>
                                </div>
                                <div>
                                    cerrar session
                                </div>
                            </button>
                        </li>
                    </ul>
                </section>
        
        
        
        </>
    )
}