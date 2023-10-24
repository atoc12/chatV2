import { Link } from 'react-router-dom';
import './menu.css';
import { AiOutlineHome, AiOutlineMenu, AiOutlineUser} from 'react-icons/ai';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import {MdOutlineColorLens}  from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { BsChatSquareDots, BsDoorClosed} from 'react-icons/bs';
import textMenu from '../../../config/interfaz/texto/menu.json';
import { useUser } from '../../../config/context/user/userContext';
import { socket } from '../../index';


export const Menu = ()=>{
    const {user,setUser} = useUser();
    const [open,setOpen]= useState(false);
    return(
        <div id="menu" className={`${open ? "enable-labels-menu" : "disable-labels-menu"}`}>
            <div>

                <div className='menu-title'>
                    <span>
                        <h1 className='t-g-2'>{textMenu.tittle}</h1>
                    </span>
                    <button className='btn' onClick={()=>setOpen(!open)} aria-label={open ? "close menu" : "open menu"}>
                        <AiOutlineMenu/>
                    </button>
                </div>
                <div className={`nav-menu`}>
                    <section>
                        <Link to={"/home"} aria-label={textMenu.options1.start}>
                            <AiOutlineHome/>
                            <span>{textMenu.options1.start}</span>
                        </Link>
                    </section>
                    <section>
                        <Link to={"/search?q="} aria-label={textMenu.options1.search}>
                            <BiSearch/>
                            <span>
                                {textMenu.options1.search}
                            </span>
                        </Link>
                    </section>
                    <section>
                        <Link to={"/alerts"} aria-label={textMenu.options1.alerts}>
                            <HiOutlineBellAlert/>
                            <span>{textMenu.options1.alerts}</span>
                        </Link>
                    </section>
                    <section>
                        <Link to={"/chat"} aria-label={textMenu.options1.chats}>
                            <BsChatSquareDots/>
                            <span>{textMenu.options1.chats}</span>
                        </Link>
                    </section>
                </div>
            </div>

            <div className='nav-menu-2'>

                <div>
                    <Link className='btn-menu' to={`/${user.name}`}>
                        <AiOutlineUser/>
                        <span>
                            cuenta
                        </span>
                    </Link>
                </div>

                <div>
                    <Link className='btn-menu' to={`/themes`}>
                        <MdOutlineColorLens/>
                        <span>
                            temas
                        </span>
                    </Link>
                </div>

                <div>
                    <button className='btn btn-menu' aria-label={textMenu.options2.close} onClick={()=>{
                                socket.emit("cerrar",user);
                                localStorage.removeItem("USER");
                                localStorage.removeItem("TOKEN");
                                setUser(null);
                            }}>
                        <BsDoorClosed/>
                        <span>
                            {textMenu.options2.close}
                        </span>                       
                    </button>
                </div>
                
            </div>

        </div>
    )
}