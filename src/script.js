import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap';

const canvas1 = document.querySelector('.webgl1')
const canvas2 = document.querySelector('.webgl2')

const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()

const gui = new GUI({
    width: 300,
    title: 'Cool debug',
    closeFolders: true
});

const gltfLoader = new GLTFLoader()

let mixer = null;
const animationObject = {
    actions: {

    }
}

gltfLoader.load(
    '/models/gamecontroller/controller.gltf',
    (gltf) => {

        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        console.log('Game Controller loaded successfully')
        console.log(gltf)
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        scene1.add(gltf.scene)
    },
)

gltfLoader.load(
    '/models/computer/computer-with-logo.glb',
    (gltf) => {
        console.log('Computer loaded successfully')
        console.log(gltf)
        scene2.add(gltf.scene)
        gsap.to(gltf.scene.position, {
            duration: 1,
            y: "+=0.1",
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut"
        })
    },
)

const sizes = {
    width: 500,
    height: 400
}

const camera1 = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera1.position.set(2, 1, 1)
scene1.add(camera1)

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera2.position.set(2, 2, 2)
scene2.add(camera2)

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene1.add(ambientLight);
scene2.add(ambientLight.clone());

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(7, 3, 2);
scene1.add(directionalLight);
scene2.add(directionalLight.clone());

const controls1 = new OrbitControls(camera1, canvas1)
controls1.enableDamping = true

const controls2 = new OrbitControls(camera2, canvas2)
controls2.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas1,
    antialias: true,
    alpha: true
})
const renderer2 = new THREE.WebGLRenderer({
    canvas: canvas2,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer2.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer){
    mixer.update(deltaTime);
    }

    // Update controls
    controls1.update()
    controls2.update()

    // Render scene 1
    renderer.render(scene1, camera1)

    // Render scene 2
    renderer2.render(scene2, camera2)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
