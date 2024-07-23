// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near plane
  1000 // Far plane
);

// Set the camera position
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.5); // Soft white light
scene.add(ambientLight);

// Add spotlight to the scene
const spotLight = new THREE.SpotLight('rgb(255, 255, 255)');
spotLight.position.set(100, 1000, 1000);
spotLight.castShadow = true;
scene.add(spotLight);

// Declare variables
let cube;
let video;
let videoTexture;

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // Create a video element
    video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // Create a texture from the video element
    videoTexture = new THREE.VideoTexture(video);

    // Create the cube with the video texture
    const geometry = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    cube = new THREE.Mesh(geometry, material);

    // Add the cube to the scene
    scene.add(cube);

    // Start the animation
    draw();
  })
  .catch(error => {
    console.error('Error accessing the webcam: ', error);
  });

// Define the draw function
function draw() {
  // Rotate the cube
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);

  // Request the next frame
  requestAnimationFrame(draw);
}

// Handle window resize events
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  // Update the camera aspect ratio and the renderer size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
