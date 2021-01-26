const canvas = document.getElementById('renderCanvas'); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  scene.createDefaultVRExperience();

  const light = new BABYLON.DirectionalLight(
    'dir01',
    new BABYLON.Vector3(0, -1, 1),
    scene
  );
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
    
    //Skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:100}, scene);
	  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;

    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");

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