function Particle(type){
    this.type = type;
    this.particleGroup = new THREE.Object3D;
}

Particle.prototype.generate = function( count ){
    //scene.remove ( this.particleGroup )
    //this.particleGroup = new THREE.Object3D;
    var particle;
    var material;

    if ( this.type == 'Rain' ){
        var geometry = new THREE.Geometry();
        material =  new THREE.LineBasicMaterial( { color: 0xa0fcfa, transparent: true, opacity: 0.4 } );
        geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
        geometry.vertices.push(new THREE.Vector3( 0, -10, 0) );
        particle = new THREE.Line( geometry, material );
    }
    else{
        var texture = new THREE.TextureLoader().load( './textures/burst.png' );
        material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
        particle = new THREE.Sprite( material );
        particle.scale.set( 3, 3, 1.0 );
        particle.opacity = 0.80;
    }

    for( var i = 0; i < count; i++ ) {
        particle.position.set( THREE.Math.randFloatSpread( 500 ), THREE.Math.randFloat( 50, 500 ), THREE.Math.randFloatSpread( 500 ));
        particle.velocity = Math.random();
        this.particleGroup.add( particle );
    }
}

Particle.prototype.fall = function(){
    scene.add( this.particleGroup );
    var yLimit = 50;
    var vFactor = 2;

    if( this.type == 'Snow' ){
        yLimit = 15;
        vFactor = 0.002
    }

    for( var c = 0; c < this.particleGroup.children.length; c++ ){
        var particle = this.particleGroup.children[ c ];
        if(particle.position.y < yLimit){
            particle.position.y = 500;
            particle.position.x = THREE.Math.randFloatSpread( 500 );
            particle.position.z = THREE.Math.randFloatSpread( 500 );
            particle.velocity = Math.random();
        }
        particle.velocity += Math.random() * vFactor;
		particle.position.y -= particle.velocity;
    }
}

Particle.prototype.stop = function(){
    scene.remove( this.particleGroup );
}