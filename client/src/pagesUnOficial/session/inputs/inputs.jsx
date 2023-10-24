import './input.css';
export const InputSession =({nombre,type="text",children,onChange,status=null,autoComplete='off'})=>{
    return(
        <section className='input-s'>
            <input type={type} name={nombre} id={nombre} onChange={onChange} autoComplete={autoComplete} required/>
            <label htmlFor={nombre}>{children}</label>
            {
                status === null ? <></>:
                <span className={
                    status ? 'valid' : 'invalid'
                }></span>
            }
        </section>
    )
}