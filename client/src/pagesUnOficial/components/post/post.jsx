import { CiBookmark } from 'react-icons/ci';
import './post.css';
import { LiaShareSolid } from 'react-icons/lia';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { socket } from '../../index.jsx';
import { Icon } from '../profile-icon/icon';
import { SlOptions } from 'react-icons/sl';
import { Delete, Update } from './function';
import { BiMessageSquare } from 'react-icons/bi';
import { Response } from './response/response';
import { Link } from 'react-router-dom';
import { useUser } from '../../../config/context/user/userContext';
import { useAlert } from '../../../config/context/alert/alert';
export const Post = ({data=null,redirect=true,response=true})=>{
    const [post,setPost]= useState(data);
    const {user} = useUser();
    const {alert,setAlert} =useAlert();
    const [status,setStatus] = useState(true);
    const timeRes = new Date(post.timestamp);
    const calculateTimeAgo = (timestamp) => {
        const currentDate = new Date();
        const postDate = new Date(timestamp);
    
        const timeDifference = currentDate - postDate;
        const secondsDifference = Math.floor(timeDifference / 1000);
    
        if (secondsDifference < 60) {
            return `hace ${secondsDifference}s`;
        } else if (secondsDifference < 3600) {
            const minutes = Math.floor(secondsDifference / 60);
            return `hace ${minutes}m`;
        } else if (secondsDifference < 86400) {
            const hours = Math.floor(secondsDifference / 3600);
            return `hace ${hours}h`;
        } else {
            const days = Math.floor(secondsDifference / 86400);
            const options = { year: '2-digit', month: 'numeric', day: 'numeric' };
            return postDate.toLocaleDateString('es-ES', options);
        }
    };

    const [time, setTime] = useState(calculateTimeAgo(post.timestamp));

    

    useEffect(()=>{
        socket.on("update-post-"+data._id,POST_UPDATE=>{
            setPost(POST_UPDATE);
        });
    },[])

    return(
        <div className='post'  style={status ? {} : {display:"none"}}>
            
            <div className='post-profile-icon'>

                    <div>       

                        <Icon data={post.creator}/>

                    </div>  

            </div>

            <div className='post-content-primary'>

                <div className='post-sup-bar'>

                    <section className='post-sup-info'>
                        <div>
                            <Link to={"/"+post.creator.name} className='link-user-post'>{post.creator.name}</Link>
                        </div>
                        <div>
                            <span className='timestamp-post'>{time}</span>
                        </div>
                    </section>

                    <section className='post-sup-options'>
                        <div>

                            <span><SlOptions/></span>

                            <div>

                                {
                                    user && post.creator._id === user._id ?
                                    <>
                                        <button onClick={()=>Delete(post).then(data=>{
                                            setStatus(false);
                                            setAlert([...alert,{content:data.message}])
                                        })}>delete</button>
                                        <button>edit</button>
                                        <button onClick={()=>Update(post,{specify:"status",value:!post.status})}>disable</button>
                                    </>
                                    :
                                        <button>reportar</button>
                                }
                            </div>

                        </div>

                    </section>

                </div>

                <div className='post-mid-bar'>

                    <section>
                        <p>
                        {post.content.split('\n').map((line, key) => (
                            <span key={key}> {line} <br /> </span>
                        ))}
                        </p>
                    </section>
                    {
                        response && post.myresponse && post.myresponse.length >0? 
                            <section>
                                <Response data={post.myresponse[0]} />
                            </section>
                        : null
                    }

                </div>

                <div className='post-bot-bar'>

                    <section>
                        <section>
                            <button className={`btn ${user && post.like.includes(user._id) && 'active-post'}`} onClick={()=>user && socket.emit("update-post",{search:post._id,value:user._id})}>
                                <AiOutlinePlusCircle/>
                            </button>
                            <span>{post.like.length}</span>
                        </section>
                        <section>
                            <button className='btn'>
                                <LiaShareSolid/>
                            </button>
                            <span>
                                0
                            </span>
                        </section>
                        <section>
                            <button className='btn'>
                                <BiMessageSquare/>
                            </button>
                            <span>
                                {post.response.length}
                            </span>
                        </section>
                        <section>
                            <button className='btn'>
                                <CiBookmark/>
                            </button>
                            <span>
                                
                            </span>
                        </section>
                    </section>
                </div>
            </div>

            {
                redirect && <Link to={`/${post.creator.name}/post/${post._id}`} draggable={false} className='post-redirect'/>
            }

        </div>
    )
}