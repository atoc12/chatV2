import { NavLink } from 'react-router-dom';
import './menuv2.css';
import { AiOutlineArrowRight, AiOutlineHome, AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { RiContactsLine } from 'react-icons/ri'
import { BsChatSquareDots, BsDoorOpenFill } from 'react-icons/bs'
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useUser } from '../../../../config/context/user/userContext';
import { useNotification } from '../../../../config/context/notification/notificacionContext';
import texto from '../../../../config/interfaz/texto/menu.json';
import { socket } from '../../home';
export const Menuv2 = ({center,setCenter})=>{
    const [open,setOpen] = useState(false);
    const {user,setUser} = useUser();
    return(
        <div id='slider-menu' style={{maxWidth:!open ? "100px" : "250px",minWidth: !open ? "100px" : "250px"}}>
                {
                    user ? 
                        <MenuOp1 setCenter={setCenter} center={center} setOpen={setOpen} open={open}/>
                    : <>
                        {/* <button id='menu-btn' onClick={()=>setOpen(!open)}><AiOutlineMenu/></button> */}
                        <NavLink to={"/session/login"}>Iniciar session</NavLink>
                    </>
                }
        </div>
    )
}


const MenuOp1 = ({setCenter,center,setOpen,open})=>{
    const {user,setUser} = useUser();
    const {noti,setNoti} = useNotification()
    const [select,setSelect] = useState(false);
    return(
        <>
        <section>
                    <h1 className='t-g-1'>{texto.tittle}</h1>
                    <section>
                        <nav>
                            <ul>
                                <li className={open ? 'borderRadius-1' : "borderRadius-0"}>
                                    <NavLink to={"/home"} onClick={()=>setCenter(true)} aria-label={texto.options1.start}>
                                        <div>
                                            <AiOutlineHome/>                              
                                        </div>
                                        <div style={{display:open ? 'block' : "none"}}>
                                            {texto.options1.start}
                                        </div>
                                    </NavLink>
                                </li>
                                <li className={open ? 'borderRadius-1' : "borderRadius-0"}>
                                    <NavLink to={"/home/chats"}onClick={()=>setCenter(true)} aria-label={texto.options1.chats}>
                                        <div>
                                            <BsChatSquareDots/>              
                                        </div>
                                        <div style={{display:open ? 'block' : "none"}}>
                                            {texto.options1.chats}
                                        </div>
                                    </NavLink>
                                </li>
                                <li className={open ? 'borderRadius-1' : "borderRadius-0"}>
                                    <NavLink to={"/home/notificaciones"}onClick={()=>setCenter(true)} aria-label={texto.options1.notificaction}>
                                        <div>
                                            <HiOutlineBellAlert/>
                                        </div>
                                        <div style={{display:open ? 'block' : "none"}}>
                                            {texto.options1.notificaction}
                                        </div>
                                        {
                                            noti && noti.length >0 ? <span className='noti-alert'></span>:<></>
                                        }
                                        
                                    </NavLink>
                                </li>
                                <li className={open ? 'borderRadius-1' : "borderRadius-0"}>
                                    <NavLink to={"/home/usuario/"+user.name}onClick={()=>setCenter(true)} aria-label={texto.options1.accont}>
                                        <div>
                                            <AiOutlineUser/>  
                                        </div>
                                        <div style={{display:open ? 'block' : "none"}}>
                                            {texto.options1.accont}
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </section>
                </section>
                <button id='menu-btn' aria-label="Boton de menu" onClick={()=>{setOpen(!open)}}><AiOutlineArrowRight style={{rotate:`${open ? '180' : '0'}deg`}}/></button>
                <section>
                    <ul>
                        <li>
                            <NavLink to={"/home/ajustes"}onClick={()=>setCenter(true)} className={`btn-settings ${open ? 'borderRadius-1' : "borderRadius-0"}`} aria-label={texto.options2.settings}>
                                <div>
                                    <IoSettingsOutline/>         
                                </div>
                                <div style={{display:open ? 'block' : "none"}}>
                                    {texto.options2.settings}
                                </div>
                            </NavLink>
                        </li>
                        <li className={open ? 'borderRadius-1' : "borderRadius-0"}>
                            <button className={`btn-settings ${open ? 'borderRadius-1' : "borderRadius-0"}`} onClick={()=>{
                                socket.emit("cerrar",user);
                                localStorage.removeItem("USER");
                                localStorage.removeItem("TOKEN");
                                setUser(null);
                            }} aria-label={texto.options2.close} >
                                <div>
                                    <BsDoorOpenFill/>
                                </div>
                                <div style={{display:open ? 'block' : "none"}}>
                                    {texto.options2.close}
                                </div>
                            </button>
                        </li>
                    </ul>
                </section>
        
        
        
        </>
    )
}