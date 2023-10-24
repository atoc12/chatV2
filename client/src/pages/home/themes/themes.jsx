import { useNavigate } from 'react-router-dom';
import './themes.css';
import { useState } from "react"
import { HiArrowLeft } from 'react-icons/hi2';
import { InputSearch } from '../../../pagesUnOficial/components/inputsearch/inputsearch';

export const ThemesPage = ()=>{
    const [theme,setTheme] = useState();

    const history =useNavigate();


    return(
        <div id='theme-page'>
            <button className='btn' onClick={()=>history(-1)}><HiArrowLeft/></button>

            <div id='example-menu'>
                example menu bar
            </div>

            <div id='example-main flex'>
                <section>
                    <InputSearch/>
                </section>

                <section>


                </section>
            </div>

            <div id='example-contact'>
                example slider contact
            </div>


            
        </div>
    )


}