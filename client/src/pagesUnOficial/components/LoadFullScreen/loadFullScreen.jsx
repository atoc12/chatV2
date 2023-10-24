import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import './loadScreen.css'
export const LoadFullScreen = ()=>{
    const mountRef = useRef(null);

    useEffect(() => {

        const currentMount = mountRef.current

        const SCENE =new THREE.Scene();

        const CAM = new THREE.PerspectiveCamera(
            25,
            currentMount.clientWidth/currentMount.clientHeight,
            0.1,
            1000
            
        );

        const loader = new GLTFLoader();

        CAM.position.z = 4;

        SCENE.add(CAM);
        const Ligth = new THREE.AmbientLight(0xffff,1);

        SCENE.add(Ligth);

        const renderer = new THREE.WebGLRenderer({alpha:true}); // crea el renderizado 

        renderer.setSize(currentMount.clientWidth,currentMount.clientHeight); //establece el tamaño del render


        currentMount.appendChild(renderer.domElement); // agrega el canvas

        const controls = new OrbitControls(CAM,renderer.domElement);
        controls.enableDamping=true;

        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("assets/59-earth/textures/planeta.jpg");
        const cube = new THREE.Mesh(
            new THREE.SphereGeometry(0.5,32,100),
            new THREE.MeshStandardMaterial( // luz ambiental
                {
                    map:map
                }
            )
        )

        SCENE.add(cube);

        const animate = ()=>{
            controls.update();
            renderer.render(SCENE,CAM)
            requestAnimationFrame(animate);
        }

        animate();

        return ()=>{
            currentMount.removeChild(renderer.domElement);
        }

    }, []);

    return(
        <div 
            id="loading-container" 
            className='LoadScreen'
            ref={mountRef}
        >
        </div>
    )
}