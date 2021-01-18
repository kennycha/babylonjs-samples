const canvas = document.getElementById('renderCanvas'); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const buildGround = () => {
  //color
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:15, height:16});
  ground.material = groundMat;
};

const buildBox = (width) => {
  //texture
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  if (width == 2) {
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png") 
  }
  else {
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
  }


  //options parameter to set different images on each side
  const faceUV = [];
  if (width == 2) {
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
  }
  else {
      faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
  }
  // top 4 and bottom 5 not seen so not set


  /**** World Objects *****/
  const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
};

const buildRoof = (width) => {
  //texture
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
};

const buildHouse = (width) => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
};

const buildDwellings = () => {
  const ground = buildGround();

  const detachedHouse = buildHouse(1);
  detachedHouse.rotation.y = -Math.PI / 16;
  detachedHouse.position.x = -6.8;
  detachedHouse.position.z = 2.5;

  const semiHouse = buildHouse(2);
  semiHouse.rotation.y = -Math.PI / 16;
  semiHouse.position.x = -4.5;
  semiHouse.position.z = 3;

  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
  places.push([2, -Math.PI / 16, -4.5, 3 ]);
  places.push([2, -Math.PI / 16, -1.5, 4 ]);
  places.push([2, -Math.PI / 3, 1.5, 6 ]);
  places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
  places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
  places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
  places.push([1, 5 * Math.PI / 4, 0, -1 ]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
  places.push([2, Math.PI / 1.9, 4.75, -1 ]);
  places.push([1, Math.PI / 1.95, 4.5, -3 ]);
  places.push([2, Math.PI / 1.9, 4.75, -5 ]);
  places.push([1, Math.PI / 1.9, 4.75, -7 ]);
  places.push([2, -Math.PI / 3, 5.25, 2 ]);
  places.push([1, -Math.PI / 3, 6, 4 ]);

  //Create instances from the first two that were built 
  const houses = [];
  for (let i = 0; i < places.length; i += 1) {
    if (places[i][0] === 1) {
        houses[i] = detachedHouse.createInstance("house" + i);
    }
    else {
        houses[i] = semiHouse.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }

};

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  // Load the sound and play it automatically once ready
  // const music = new BABYLON.Sound("cello", "sounds/cellolong.wav", scene, null, { loop: true, autoplay: true });

  buildDwellings();

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