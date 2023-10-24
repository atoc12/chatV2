import { NavLink, Outlet } from 'react-router-dom';
import './ajustes.css';
import { useState } from 'react';
export const Ajustes =()=>{
    const [select,setSelect] =useState(null);
    return(
        <div id='ajustes'>
            <div>
                <ul>
                    <li className={select && select == 1 ? "select-primary" : ''}>
                        <NavLink to={"/home/ajustes/perfil"} >Perfil</NavLink>
                    </li>
                    <li className={select && select == 2 ? "select-primary" : ''}>
                        <NavLink to={"/home/ajustes/interfaz"}>Interfaz</NavLink>
                    </li>
                    <li className={select && select == 3 ? "select-primary" : ''}>
                        <NavLink to={"/home/ajustes/soporte"}>soporte</NavLink>
                    </li>
                </ul>
            </div>
            <div>
                <Outlet context={[select,setSelect]}/>
                
            </div>
        </div>
    )
}