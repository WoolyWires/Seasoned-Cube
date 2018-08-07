// main.js
// Initializes and runs code.

var scene, camera, renderer, controls, clock;
var tree_color = "#FFA3B0";
var pine_color = "#006a00";
var grass_color = "#4DBD33";
var season;
var isPrecipitation;
var fogDensity = 0;
var rainFall = new Particle('Rain');
var snowFall = new Particle('Snow');

///////////// SETUP ////////////////////////
// Funtion to setup scene
function setup(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    const FOV = 45; // field of view, angle that the seen from camera
    const near_view = 0.1; // how close the clipping plane is
    const far_view = 11000; // how far the clipping plane is

    // Time
    clock = new THREE.Clock();

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    // Shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    scene = new THREE.Scene;

    // Fog
    scene.fog = new THREE.FogExp2(0xDCDBDF, fogDensity);

    // Camera
    camera = new THREE.PerspectiveCamera( FOV, width / height, near_view, far_view );
    camera.position.y = 160;
    camera.position.z = 500;
    camera.lookAt( scene.position );

    scene.add( camera );

    // Camera Controls

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.rotateSpeed = 2.0;
    controls.staticMoving = false;
    controls.minDistance = 500;
    controls.maxDistance = 2000;

    // Lighting

    var directionalLight = new THREE.DirectionalLight();
        directionalLight.position.copy(new THREE.Vector3( -70, 65, 50 ));
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = near_view;
        directionalLight.shadow.camera.far = far_view;
        directionalLight.shadow.camera.left = -500;
        directionalLight.shadow.camera.right = 500;
        directionalLight.shadow.camera.top = 500;
        directionalLight.shadow.camera.bottom = -500;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    // Skybox

    var skyboxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var c1 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/front.png" ), side: THREE.DoubleSide, fog: false });
    var c2 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/back.png" ), side: THREE.DoubleSide, fog: false });
    var c3 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/up.png" ), side: THREE.DoubleSide, fog: false });
    var c4 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/down.png" ), side: THREE.DoubleSide, fog: false });
    var c5 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/right.png" ), side: THREE.DoubleSide, fog: false });
    var c6 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "./textures/left.png" ), side: THREE.DoubleSide, fog: false });
    var skyboxMaterial = [c1,c2,c3,c4,c5,c6];
    var skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterial );

    scene.add( skybox );
}
// Function to render objects into the scene.
function draw(){

    // Ground

    var groundTexture = new THREE.TextureLoader().load( "./textures/vector.jpg")

    var groundGeometry = new THREE.CubeGeometry(500, 30, 500);
    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture, color: grass_color });
    var ground = new THREE.Mesh( groundGeometry, groundMaterial );

    ground.receiveShadow = true;

    scene.add( ground );

    // Trees
    
    tree("pine", 5, 30, 25, 40, 150, 40, 150 );
    tree("pine", 5, 30, 40, 70, 150, 40, -150 );
    tree("pine", 4, 50, 15, 50, -200, 50, 190 );
    tree("pine", 4, 50, 15, 50, -80, 50, -190 );
    tree("pine", 4, 60, 15, 50, -160, 50, -50 );
    tree("pine", 5, 30, 20, 40, -90, 40, -90 );
    tree("", 5, 30, 60, 0, 50, 30, 40 );
    tree("", 5, 40, 45, 0, 180, 40, 20 );
    tree("", 5, 40, 60, 0, -180, 40, -180 );

    if(season == "fall"){
        rainFall.generate(300);
        snowFall.generate(0);
    }
    else if(season == "summer"){
        rainFall.generate(50);
        snowFall.generate(0);
    }
    else if(season == "winter"){
        snowFall.generate(300);
        rainFall.generate(0);
    }else{
        rainFall.generate(10);
        snowFall.generate(0);
    }
}

///////////// ANIMATE ////////////////////////
// Renders the scene and updates the render as needed.

function animate(){
    var delta = clock.getDelta();
    controls.update( delta );

     if(isPrecipitation){
        scene.fog.density = fogDensity;
        if(season == "winter"){
            rainFall.stop();
            snowFall.fall();
        }
        else{
            rainFall.fall();
            snowFall.stop();
        }
    }
    else{
        scene.fog.density = 0;
        rainFall.stop();
        snowFall.stop();
    }

    renderer.render( scene, camera );

    requestAnimationFrame( animate );
};

/////////// GUI /////////////////////////////
// Creates a user interface to alter season and precipitation settings

var seasonShift = function() {
    this.Season = 0;
    this.Precipitation = false;
    this.Recenter = function(){
        controls.reset();
        console.log("Camera Centered");
        };
};

    var theSeason = new seasonShift();
    var gui = new dat.GUI( { autoPlace: false } );
    
    seasons = [{
        Spring: 0,
        Summer: 1,
        Autumn: 2,
        Winter: 3,
    }];

    gui.add(theSeason, 'Season', seasons[0]).onChange(function(value){
        if(value == 0){
            tree_color = "#FFA3B0";
            pine_color = "#006a00";
            grass_color = "#4DBD33";
            season = "spring";
            fogDensity = 0;
        }
        else if(value == 1){
            tree_color = "#55AE3A";
            pine_color = "#05662d";
            grass_color = "#1d904b";
            season = "summer";
            fogDensity = 0;
        }
        else if(value == 2){
            tree_color = "#D1651D";
            pine_color = "#416e0f";
            grass_color = "#cab326";
            season = "fall";
            fogDensity = 0.001;
        }
        else if(value == 3){
            tree_color = "#9c7b53";
            pine_color = "#05664a";
            grass_color = "#FFFFFF";
            season = "winter";
            fogDensity = 0.002;
        }
        console.log("Season:  ", season);
        draw();
    });
    gui.add(theSeason, 'Precipitation').onChange(function(value){
        console.log("Precipitation:  ", value);
        isPrecipitation = value;
        draw();
    });

    gui.add(theSeason, 'Recenter');

    document.getElementById('dat-gui-holder').appendChild(gui.domElement);

///////////// RUN FUNCTIONS ////////////////////////

setup();
draw();
animate();
