import './post.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CreatePost, GetData, GetPost } from './function';
import { Publicaciones } from '../../api-client/functions/publicacion/publicacion';
import { useUser } from '../../config/context/user/userContext';
import { User } from '../../api-client/functions/usuarios/usuario';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { Post } from '../components/post/post';
import { Load } from '../components/load/load';
export const PostIndex = ()=>{
    const {user} =useUser();
    const {name,id} = useParams();
    const [userparam,setUserparams]=useState(false)
    const [load,setLoad] = useState(true);
    const [comments,setComments]= useState(false);
    const [postInfo,setPostInfo] = useState(null);
    const history = useNavigate();
    

    useEffect(()=>{
        
        setLoad(true);
        setComments(null);
        setPostInfo(null);

        GetPost({_id:id})
            .then(data=>setPostInfo(data.data[0]))
            .finally(()=>setLoad(false));

        GetPost({myresponse:id})
            .then(data=>setComments(data.data));

    },[name,id])



    const handlerSubmit = (e)=> {
        e.preventDefault();
        CreatePost(user._id,id,e.target["contenido"].value).then(data=>console.log(data));
    }
    
    return(
        <div id="Post-index">
            <button className='post-index-btn-back btn btn-and-tooltip' onClick={()=>history(-1)}>
                <MdOutlineArrowBackIosNew/>
                <span>
                    atras
                </span>
            </button>

            <div className='post-index-content-primary'>
                {
                    load && !postInfo ?
                        <Load/>
                    :
                        <Post data={postInfo} redirect={false} />
                }
            </div>

            <div className='post-index-form'>
                <form onSubmit={(e)=>handlerSubmit(e)} className='form-comment'>
                    <section>
                        <textarea name="contenido" placeholder='¿Algo que decir?'></textarea>
                    </section>
                    <section>


                        <button type='submit' className='btn btn-primary btn-send-comment'>Enviar</button>

                    </section>
                </form>
            </div>

            <div className='post-index-comments'>

                {
                    comments && comments.length > 0 
                    ? comments.map((coment,key)=><Post key={key} data={coment} response={false} />)
                    : "no hay comentarios"
                }



            </div>
                

        </div>
    )
}