import { visibleHeightAtZDepth, visibleWidthAtZDepth, lerp } from "../utils.js"
import { nextSlide, prevSlide } from "../main.js"

const raycaster = new THREE.Raycaster()
const objLoader = new THREE.OBJLoader()
let arrowBox = null
let arrowBoxRotation = 0

let prevBox = null
let prevBoxRotation = 0

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.append(renderer.domElement)

const screenBorders = {
  right: visibleWidthAtZDepth(-10, camera) / 2,
  bottom: -visibleHeightAtZDepth(-10, camera) / 2
}

objLoader.load(
  'models/cube.obj',
  ({ children }) => {
    addGenericCube(children[0], nextSlide, screenBorders.right - 1.5, screenBorders.bottom + 1)
    animate()
  }
)

objLoader.load(
  'models/prevCube.obj',
  ({ children }) => {
    addGenericCube(children[0], prevSlide, screenBorders.right - 2.5, screenBorders.bottom + 1, true)
    animate()
  }
)

const addGenericCube = (object, callbackFn, x, y, reversed) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, 0)

  const boundingBox = new THREE.Mesh(
    new THREE.BoxGeometry(.7, .7, .7),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
  )

  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  reversed ?
    prevBox = boundingBox : arrowBox = boundingBox
  scene.add(boundingBox)
}


const animate = () => {
  arrowBoxRotation = lerp(arrowBoxRotation, 0, .07)
  arrowBox.rotation.set(THREE.Math.degToRad(arrowBoxRotation), 0, 0)

  prevBoxRotation = lerp(prevBoxRotation, 0, .07)
  prevBox.rotation.set(THREE.Math.degToRad(prevBoxRotation), 0, 0)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

export const handleThreeAnimation = () => {
  arrowBoxRotation = 360
}

export const handlePrevAnimation = () => {
  prevBoxRotation = - 360
}

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycaster.intersectObjects([arrowBox, prevBox])
  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})