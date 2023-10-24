import {Route, Routes , BrowserRouter, Navigate, Outlet} from 'react-router-dom'
import { userContext } from './context/user/userContext'
import { notiContext } from './context/notification/notificacionContext'
import { useEffect, useState } from 'react'
import { Home, socket } from '../pages/home/home';
// import { Index } from '../pages/home/index';
// import { Notificaciones } from '../pages/home/notificaciones/notificaciones';
// import { Session } from '../pages/session/session';
// import { Cuenta } from '../pages/home/cuenta/cuenta';
// import { Ajustes } from '../pages/home/ajustes/ajustes';
// import { PerfilAjuste } from '../pages/home/ajustes/perfil/perfil';
// import { Interfaz } from '../pages/home/ajustes/interfaz/interfaz';
// import { Soporte } from '../pages/home/ajustes/soporte/soporte';
// import { Buscador } from '../pages/home/buscador/buscador';
import { SolicitudContext } from './context/solicitud/solicitudContext';
import { ContactosContext } from './context/contactos/contactos';
import { TittleContext } from './context/tittle/tittlecontext';
// import { Nuevos } from '../pages/session/nuevos/nuevos';
// import { PublicaionPages } from '../pages/home/publicaciones/publicaciones';
import { AlertContext } from './context/alert/alert';
import { HomeTest } from '../pagesUnOficial/home/home';
import { Index } from '../pagesUnOficial';
import { Search } from '../pagesUnOficial/search/search';
import { PostIndex } from '../pagesUnOficial/post/post';
import { Accont } from '../pagesUnOficial/user/user';
import { Session } from '../pagesUnOficial/session/session';
import { ValidarToken } from './validations';
import { Nuevos } from '../pagesUnOficial/session/nuevos/nuevos';
import { Notificaciones } from '../pagesUnOficial/notificaciones/notificaciones';
import { ChatBody } from '../pagesUnOficial/PanelChats/chat/chat';
import { PanelChat } from '../pagesUnOficial/PanelChats/PanelChat';
import { ChatContext } from './context/chat/chat';
import { ThemesPage } from '../pages/home/themes/themes';

export const Rutas = ()=>{
    const [tittle,setTittle] = useState('home');
    const [user,setUser] = useState(()=>{try{return JSON.parse(localStorage.getItem("USER"));}catch(err){return null}});
    const [noti,setNoti] = useState(null);
    const [solicitud,setSolicitud] = useState([]);
    const [contactos,setContactos] = useState([]);
    const [chat,setChat] = useState([]);
    const validation = (data)=>{try{return Json.parse(data);}catch(err){return null}}
    const [alert,setAlert] = useState([]);
    useEffect(()=>{

        if(user){

           ValidarToken().then(result=>{
                    console.log(result);
                    if(result.type=="error"){
                        localStorage.removeItem("TOKEN");
                        localStorage.removeItem("USER");
                        setUser(null);
                    }
                }
            );
        }
    },[user]);
    useEffect(()=>{
        document.title = `${tittle} ${noti && noti.length>0 ? `(${noti.length})` :''  }`;
    },[tittle,noti]);
    return(
        <TittleContext.Provider value={{tittle,setTittle}}>
            <userContext.Provider value={{user,setUser}}>
                <notiContext.Provider value={{noti,setNoti}}>
                    <AlertContext.Provider value={{alert,setAlert}}>    
                        <SolicitudContext.Provider value={{solicitud,setSolicitud}}>
                            <ContactosContext.Provider value={{contactos,setContactos}}>
                                <ChatContext.Provider value={{chat,setChat}}>
                                    <BrowserRouter>
                                        {/* <Routes>
                                            <Route path='/home' element={<Home/>}>
                                                <Route path={''} element={<Index/>} action={"buscador"}/>
                                                {
                                                    user ? 
                                                    <>
                                                        <Route path='usuario/:id' element={<Cuenta usuario={user}></Cuenta>}/>
                                                        <Route path='notificaciones' element={<Notificaciones/>}/>
                                                        <Route path='chat' element={<>chat</>}/>
                                                        <Route path='contactos' element={<>contactos</>}/>
                                                        <Route path='ajustes' element={<Ajustes></Ajustes>}>
                                                            <Route path='perfil' element={<PerfilAjuste/>}/>
                                                            <Route path='interfaz' element={<Interfaz/>}/>
                                                            <Route path='soporte' element={<Soporte/>}/>
                                                        </Route>
                                                        <Route path='buscador' element={<Buscador></Buscador>}/>
                                                        <Route path='publicacion/:id' element={<PublicaionPages/>}/>              
                                                    </>
                                                    :<></>
                                                }
                                            </Route>
                                            <Route path='/session' element={user ? <Navigate to={"/home"} /> :null}>
                                                <Route path='login' element={<Session/>}/>
                                                <Route path='register' element={<Nuevos/>}/>
                                            </Route>
                                            <Route path='*' element={<Navigate to={"/home"}/>}/>
                                        </Routes> */}
                                        <Routes>
                                            <Route path='' element={<Index/>}>
                                                <Route path='home' element={<HomeTest/>}></Route>
                                                <Route path='search' element={<Search/>}></Route>
                                                <Route path=':name' element={<Accont/>}></Route>
                                                <Route path=':name/post/:id' element={<PostIndex/>}></Route>
                                                <Route path='alerts' element={<Notificaciones/>} ></Route>
                                                <Route path='chat' element={<Outlet/>}>
                                                    <Route path='' element={<PanelChat/>}></Route>
                                                    <Route path=':id' element={<ChatBody/>}></Route>
                                                </Route>
                                            </Route>
                                            <Route path='/themes' element={<ThemesPage/>}></Route>
                                            <Route path='/login' element={!user ? <Session/> : <Navigate to={"/home"}/>}></Route>
                                            <Route path='/register' element={!user ? <Nuevos/> : <Navigate to={"/home"}/>}></Route>
                                        </Routes>

                                    </BrowserRouter>    
                                </ChatContext.Provider>
                            </ContactosContext.Provider>
                        </SolicitudContext.Provider>
                    </AlertContext.Provider>
                </notiContext.Provider>
            </userContext.Provider>
        </TittleContext.Provider>
    )
}