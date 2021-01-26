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
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  //Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  //Create Village ground
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
  groundMat.diffuseTexture.hasAlpha = true;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width:24, height:24 });
  ground.material = groundMat;

  //large ground
  const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;

  const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palm.png", 2000, {width: 512, height: 1024}, scene);

  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (-30);
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * (25) + 7;
    tree.position.z = Math.random() * -35  + 8;
    tree.position.y = 0.5;
  }

  const spriteManagerUFO = new BABYLON.SpriteManager("UFOManager","https://assets.babylonjs.com/environments/ufo.png", 1, {width: 128, height: 76});
  const ufo = new BABYLON.Sprite("ufo", spriteManagerUFO);
  ufo.playAnimation(0, 16, true, 125);
  ufo.position.y = 5;
  ufo.position.z = 0;
  ufo.width = 2;
  ufo.height = 1;

  BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");

  BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
    const car = scene.getMeshByName("car");
    car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const carKeys = []; 

    carKeys.push({
      frame: 0,
      value: 10
    });


    carKeys.push({
      frame: 200,
      value: -15
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
      
    //wheel animation
    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");
      
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
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