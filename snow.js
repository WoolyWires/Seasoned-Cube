var flakeCount = 300;
var snowGroup = new THREE.Object3D();
var snowTexture = new THREE.TextureLoader().load( './textures/burst.png' );

for( var i = 0; i < flakeCount; i++ ) {
	    var flakeMaterial = new THREE.SpriteMaterial( { map: snowTexture, color: 0xffffff, fog: true } );
		
		var flake = new THREE.Sprite( flakeMaterial );
		flake.scale.set( 3, 3, 1.0 );
		flake.position.set( THREE.Math.randFloatSpread( 500 ), THREE.Math.randFloat( 50, 500 ), THREE.Math.randFloatSpread( 500 ) );
		
		flake.opacity = 0.80;
        flake.velocity = Math.random();
		
		snowGroup.add( flake );
}

function snowGen(){
    scene.add( snowGroup );
}


function snowFall(){
    for ( var c = 0; c < snowGroup.children.length; c ++ ) 
	{
        var flake = snowGroup.children[ c ];
        if(flake.position.y < 15){
            flake.position.y = 500;
            flake.position.x = THREE.Math.randFloatSpread( 500 );
            flake.position.z = THREE.Math.randFloatSpread( 500 );
            flake.velocity = Math.random();
        }
        flake.velocity += Math.random() * .002;
		flake.position.y -= flake.velocity;
	}
    
}

function snowStop(){
    scene.remove( snowGroup );
}