import { useEffect, useState } from 'react';
import './nuevos.css';
// import { socket } from '../../home/home';
import { Link } from 'react-router-dom';
import { useUser } from '../../../config/context/user/userContext';
import { EatApi } from '../../../config/fetch/fetch';
import { appVar } from '../../../config/var';
import { User } from '../../../api-client/functions/usuarios/usuario';
export const Nuevos = ()=>{
    const {user,setUser} = useUser();
    const [mensaje,setMensaje] = useState(null);
    const [steps,setSteps] = useState(1);
    const [correo,setCorreo] = useState(null);
    const [icon,setIcon] =useState(null);
    const [pass,setPass] = useState(null);
    const [nombre,setNombre] =useState(null);
    const [invalid,setInvalid] = useState(null);
    useEffect(()=>{
        // socket.on("busqueda-resultado",(datos)=>{
        //     setMensaje(datos.length > 0 ? ()=>{setInvalid(true);return 'ya existe un usuario con esas credenciales';}: ()=>{setInvalid(false);return null;});
        // });
    },[])
    useEffect(()=>{
        setMensaje(null);
    },[steps])
    const HandleSubmit = async (e)=>{
        e.preventDefault();
        try{
            let resultado = await new User({value:{name:nombre,email:correo,password:pass}},"2").create().apply();
            if(resultado.data){
                const {session,...rest} = resultado.data;
                localStorage.setItem("TOKEN",session);
                localStorage.setItem("USER",JSON.stringify(rest));
                let formData = new FormData();
                formData.append('lol', icon[0],"pic-"+rest._id.toString());
                let response = await fetch(appVar.ip+'/subir/archivo', {method: 'POST',body: formData});
                if (response.ok) {
                    setMensaje('Bienvenido');
                    setTimeout(() => {
                        setUser(JSON.parse(localStorage.getItem("USER")));
                    }, 1000);
                }else {
                    console.error('Error al subir la imagen:', response.statusText);
                }
            }
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div id='nuevo-index'>
            {/* <Link className='btn-back'>{'< atras'}</Link> */}
            <div id='number-steps'>
                <div className={steps && steps >=1  ? 'step-div-complete' : 'step-div-incomplete'}>
                    <span className={steps && steps >= 1 ? 'step-complete' : 'step-incomplete'}>1</span>
                </div>
                <div className={steps && steps >= 2 ? 'step-div-complete' : 'step-div-incomplete'}>
                    <span className={steps && steps >= 2 ? 'step-complete' : 'step-incomplete'}>2</span>
                </div>
                <div className={steps && steps == 3 ? 'step-div-complete' : 'step-div-incomplete'}>
                    <span className={steps && steps == 3? 'step-complete' : 'step-incomplete'}>3</span>
                </div>
            </div>
            <div id='nuevo-content'>
                {
                    steps == 1 ?
                    <Step1 
                        mensaje={mensaje} 
                        setMensaje={setMensaje} 
                        step={steps} 
                        setSteps={setSteps} 
                        setCorreo={setCorreo}
                        correo={correo}
                        pass={pass}
                        setPass={setPass}
                        valid={invalid}
                        />
                        : steps == 2 ?
                            <Step2 
                                mensaje={mensaje} 
                                setMensaje={setMensaje} 
                                step={steps} 
                                setSteps={setSteps}
                                setNombre={setNombre}
                                nombre={nombre}
                                img={icon}
                                setImg={setIcon}
                                valid={invalid}
                            />
                                : steps == 3 ? 
                                    <Step3 
                                        mensaje={mensaje} 
                                        setMensaje={setMensaje} 
                                        step={steps} 
                                        setSteps={setSteps} 
                                        submit={HandleSubmit}/> :<>error</>
                }               
                <section>
                        <section className='d-f-c-n center-all gap-0-5'>
                            <span className='message-nuevos'>
                                {
                                    mensaje
                                }
                            </span>
                        </section>
                </section>
            </div>
       </div>
    )
}

const Step1 = ({mensaje,setMensaje,step,setSteps,correo,setCorreo,pass,setPass,valid})=>{
    useEffect(()=>{
        if(correo){
            // socket.emit("buscar-usuario",{search:{email:correo},busqueda:true});
        }
    },[correo])
    useEffect(()=>{

    },[pass])
    const HandleSubmit=(e)=>{
            e.preventDefault();
            if(!correo)return setMensaje('Ingrese correo electronico');
            if(!pass) return setMensaje('Ingrese una contraseña');
            if(pass.length < 8) return setMensaje('La contraseña debe tener más de ocho caracteres');
            if(valid) return setMensaje('datos invalidos');
            return setSteps(2);
    }
    return(
        <div id='step1' className='h-100'>
            <form onSubmit={(e)=>HandleSubmit(e)} className='d-f-c-n gap-3 justify-center aling-center h-100'>
                <h1 className='t-g t-g-1'>Registro</h1>
                <section className='d-f-c-n gap-1'>
                    <section className='d-f-c-n center-all gap-0-5'>
                        <input type="email" className='btn border-primary b-1  b-f-b b-s-s b-d-5 pad-1 input' autoComplete='enable' name="correo" id="correo"  placeholder='Correo' onChange={(e)=>setCorreo(e.target.value == '' ? null : e.target.value )}/>
                    </section>
                    <section className='d-f-c-n center-all gap-0-5'>
                        <input type="password" className='btn border-primary b-1  b-f-b b-s-s b-d-5 pad-1 input' autoComplete='off' name="pass" id="pass" placeholder='Contraseña' onChange={(e)=>setPass(e.target.value == '' ? null : e.target.value )}/>
                        <span className='message-nuevos'>
                        </span>
                    </section>
                </section>
                <section>
                    <button type='submit' className='btn btn-primary pad-1 b-d-5 font-color-primary'>Siguiente</button>
                </section>
            </form>            
        </div>
    )
}


const Step2 = ({mensaje,setMensaje,setps,setSteps,setNombre,nombre,setImg,img,valid})=>{
    const HandleSubmit=(e)=>{
        e.preventDefault();
        if(!nombre)return setMensaje('El nombre es necesario');
        if(!img) return setMensaje('Se debe agregar una imagen');
        if(valid) return setMensaje('datos invalidos');
        return setSteps(3);
    }
    useEffect(()=>{
        setMensaje(null);
        if(nombre){
            if(nombre.includes(' ')){
                setMensaje('No debe haber espacios');
            }
            else if( nombre.length <= 3){
                setMensaje('El nombre debe tener más de tres caracteres')
            }else{
                // socket.emit("buscar-usuario",{search:{name:nombre},busqueda:true});
            }
        }
    },[nombre])
    return(
        <div id='step1' className='h-100'>
            <form onSubmit={(e)=>HandleSubmit(e)} className='d-f-c-n gap-3 justify-center aling-center h-100'>
                <section  id='icono-nuevo'>
                    <span id='img-reader'>
                        <input type="file" name="img" id="img" accept="image/*" onChange={(e)=>{
                            let archivo = e.target;
                            setImg(e.target.files);
                            let imagenPrevia = document.getElementById('imagenPrevia');
                            let render = new FileReader();
                            render.onload=()=>{
                                imagenPrevia.setAttribute('src',render.result);
                            }
                            render.readAsDataURL(archivo.files[0]);
                        }} />
                            <img id="imagenPrevia" src=""/>
                    </span>
                </section>
                <section className='d-f-c-n center-all gap-0-5'>
                    <input type="text" className='btn b-1 border-primary b-f-b b-s-s b-d-5 pad-1 input' autoComplete='off' name="nombre" id="nombre" placeholder='Nombre de usuario' onChange={(e)=>setNombre(e.target.value == '' ? null : e.target.value )}/>
                </section>
                <section>
                    <button type='submit' className='btn btn-primary pad-1 font-color-primary b-d-5'>Siguiente</button>
                </section>
            </form>
        </div>
    )
}

const Step3 =({mensaje,setMensaje,setps,setSteps,submit})=>{
    return(
        <div id='step3'>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti repellendus ipsa, expedita illo voluptatibus praesentium sequi quos atque aliquid ipsum quisquam enim nostrum hic possimus, aliquam reprehenderit ducimus, tempore officiis!
                Sequi aliquam fuga perspiciatis veniam consequatur deserunt maiores labore et, laborum voluptate itaque similique totam necessitatibus consectetur hic eveniet perferendis exercitationem tempore officia commodi, error consequuntur sapiente ad sunt? Aut?
                Earum deserunt architecto suscipit iure quo cupiditate obcaecati, ipsum pariatur natus illo, ex mollitia. Quas culpa pariatur quidem ipsa optio ut facere eum quasi, ullam sed quae, quam, nobis quis.
                Qui, illum? Consequuntur illum voluptates corporis beatae sequi incidunt repellat eum ut, sapiente praesentium iste fugiat ducimus facilis quaerat. Dolorum iste nisi vel iure eos architecto modi voluptates, ab optio!
                Voluptas reiciendis enim inventore eius nobis mollitia necessitatibus exercitationem nam sed aut. Velit, vel neque vitae porro unde voluptatum quo nobis facere laudantium voluptates quis esse, atque libero, est tempore.
                Accusamus tenetur aperiam recusandae, officiis libero voluptates. Facilis perspiciatis optio explicabo ducimus deserunt corrupti pariatur eius eaque nulla? Eum esse tempora consequatur consectetur, impedit id sit atque non at adipisci!
                Qui obcaecati maiores quam, optio debitis quis ullam molestiae consequatur esse at assumenda ea dolorum pariatur suscipit dolores officiis expedita vero quas quos ipsa voluptatem quod! Accusantium optio voluptatem veniam.
                Perspiciatis odit reiciendis asperiores, aliquid quidem debitis consectetur hic accusantium! Nulla libero inventore tenetur? Delectus consequatur fugit quod voluptatibus maiores, quas temporibus non sunt nesciunt, ipsum beatae, laudantium deleniti odio.
                Magnam exercitationem nemo dolorum natus saepe sequi maiores adipisci nulla voluptatibus amet ducimus itaque, excepturi quis laudantium! A eos eius delectus recusandae, impedit accusamus aspernatur porro quasi vero nihil ad.
                Consequatur nobis sunt unde iure voluptas? Nostrum cupiditate porro natus, rerum repellat numquam atque obcaecati dolorem excepturi nesciunt tempore consequuntur. Assumenda dolores omnis enim nam non explicabo sapiente, deleniti distinctio.
            </div>
            <div className='d-f-r-n gap-1'>
                <Link className='btn' to={'/home'}>Cancelar</Link>
                <button className='btn' onClick={submit}>Aceptar</button>
            </div>
        </div>
    )
}