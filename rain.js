var rainGroup;

function rainGen(rainCount){
    scene.remove( rainGroup );
    rainGroup = new THREE.Object3D;
    for( var i = 0; i < rainCount; i++ ) {
        var rainMaterial = new THREE.LineBasicMaterial( { color: 0xa0fcfa, transparent: true, opacity: 0.4 } );
        var rainGeometry = new THREE.Geometry();
        rainGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
        rainGeometry.vertices.push(new THREE.Vector3( 0, -10, 0) );
		
		var raindrop = new THREE.Line( rainGeometry, rainMaterial );
		raindrop.position.set( THREE.Math.randFloatSpread( 500 ), THREE.Math.randFloat( 50, 500 ), THREE.Math.randFloatSpread( 500 ) );
		
        raindrop.velocity = Math.random();
		
        rainGroup.add(raindrop);
    }
    scene.add( rainGroup );
}


function rainFall(){
    for ( var c = 0; c < rainGroup.children.length; c ++ ) 
	{
        var raindrop = rainGroup.children[ c ];
        if(raindrop.position.y < 50){
            raindrop.position.y = 500;
            raindrop.position.x = THREE.Math.randFloatSpread( 500 );
            raindrop.position.z = THREE.Math.randFloatSpread( 500 );
            raindrop.velocity = Math.random();
        }
        raindrop.velocity += Math.random() * 2;
		raindrop.position.y -= raindrop.velocity;
	}
    
}

function rainStop(){
    scene.remove( rainGroup );
}