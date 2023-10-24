import { useEffect, useState } from "react"
import './home.css';
import { Load } from "../components/load/load";
import { GetPost } from "./functions";
import { Post } from "../components/post/post";
import { InputSearch } from "../components/inputsearch/inputsearch";
import { CreatePost } from "../components/createPost/createPost";
import { useUser } from "../../config/context/user/userContext";
import { useNotification } from "../../config/context/notification/notificacionContext";
import { AlertsMessage } from "../components/alerts/alerts";

export const HomeTest = ()=>{
    const {user,setUser}= useUser();
    const {noti,setNoti} = useNotification();
    const [contet,content] = useState([]);
    const [elements,setElements] = useState([]);
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        GetPost().then(post=>{
            setElements(post.data);
            setLoad(false);
        });
    },[]);
    return(
        <div id="home">

            <div>
                <InputSearch/>
            </div>

            <div>
                {
                    load ? 
                        <Load/>
                    : elements && elements.length > 0 ?
                        elements.map((element,key) => <Post data={element} key={key}/>)
                    :<div className="text-center">No hay publicaciones</div>
                }
            </div>

            {user && <CreatePost user={user} contentElements={elements} setContentElements={setElements}/>}


            <section id="section-messages-alert">

            </section>

        </div>
    )
}