const canvas = document.getElementById('renderCanvas'); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.angularSensibilityX = 2000;
  camera.angularSensibilityY = 2000;
  camera.cameraAcceleration = 0.00005;
  camera.speed = 0.5;
  camera.maxCameraSpeed = 0.5;
  camera.attachControl(canvas, true);
  
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0)
  );

  //create a sphere
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.25});
  sphere.position = new BABYLON.Vector3(2, 0, 2);

  //draw lines to form a triangle
  const points = [];
  points.push(new BABYLON.Vector3(2, 0, 2));
  points.push(new BABYLON.Vector3(2, 0, -2));
  points.push(new BABYLON.Vector3(-2, 0, -2));
  points.push(points[0]); //close the triangle;

  BABYLON.MeshBuilder.CreateLines("triangle", {points: points})
  
  const slide = function (turn, dist) { //after covering dist apply turn
    this.turn = turn;
    this.dist = dist;
  }

  const track = [];
  track.push(new slide(Math.PI / 2, 4));
  track.push(new slide(3 * Math.PI / 4, 8));
  track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2)));

  let distance = 0;
  let step = 0.05;
  let p = 0;

  scene.onBeforeRenderObservable.add(() => {
    sphere.movePOV(0, 0, step);
    distance += step;
              
    if (distance > track[p].dist) {        
      sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
      p +=1;
      p %= track.length;
      if (p === 0) {
        distance = 0;
        sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
        sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
      }
    }
  });

  return scene;
}
// Add your code here matching the playground format
const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});