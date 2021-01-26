const canvas = document.getElementById('renderCanvas'); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = () => {
    
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 1.5, Math.PI / 2.2, 15, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

  BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
  
  const walk = function (turn, dist) {
      this.turn = turn;
      this.dist = dist;
  }
  
  const track = [];
  track.push(new walk(86, 7));
  track.push(new walk(-85, 14.8));
  track.push(new walk(-93, 16.5));
  track.push(new walk(48, 25.5));
  track.push(new walk(-112, 30.5));
  track.push(new walk(-72, 33.2));
  track.push(new walk(42, 37.5));
  track.push(new walk(-98, 45.2));
  track.push(new walk(0, 47))

  // Dude
  BABYLON.SceneLoader.ImportMeshAsync("him", "/scenes/Dude/", "Dude.babylon", scene).then((result) => {
      var dude = result.meshes[0];
      dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
          
      dude.position = new BABYLON.Vector3(-6, 0, 0);
      dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
      const startRotation = dude.rotationQuaternion.clone();    
          
      scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
          distance += step;
            
          if (distance > track[p].dist) {
                  
              dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
              p +=1;
              p %= track.length; 
              if (p === 0) {
                  distance = 0;
                  dude.position = new BABYLON.Vector3(-6, 0, 0);
                  dude.rotationQuaternion = startRotation.clone();
              }
          }
    
      })
  });
  
  return scene;
};
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