// tree.js
// Code for drawing tree trunks and leaves
// requires global variables from main: scene, tree_color, pine_color

function trunk( radius, height, x, z ){
    var texture = new THREE.TextureLoader().load( "./textures/bark.png" );
    var trunkGeometry = new THREE.CylinderGeometry( radius, radius*1.5, height, 32 );
    var trunkMaterial = new THREE.MeshPhongMaterial({ map: texture });
    var trunk = new THREE.Mesh( trunkGeometry, trunkMaterial );

    trunk.castShadow = true;
    trunk.receiveShadow = true;

    trunk.position.x = x;
    trunk.position.y = 25;
    trunk.position.z = z;

    return trunk;
}

function leaf( type, radius, height, x, y, z ) {
    if (type == "pine"){
        var texture = new THREE.TextureLoader().load( "./textures/vector.jpg",  function( texture ){
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 1 );
        } );
        var combined = new THREE.Geometry();
        var coneGeometry0 = new THREE.ConeGeometry( radius*1.6, height, 32) ;
        var coneGeometry1 = new THREE.ConeGeometry( radius*1.4, height, 32) ;
        var coneGeometry2 = new THREE.ConeGeometry( radius, height, 32) ;
        var material = new THREE.MeshLambertMaterial({ color: pine_color, map:texture });
        var t = height/2;

        coneGeometry0.translate( 0, height/2, 0 );
        combined.merge(coneGeometry0);
        coneGeometry1.translate( 0, height, 0 );
        combined.merge(coneGeometry1);
        coneGeometry2.translate( 0, height+height/2, 0 );
        combined.merge(coneGeometry2);
        
        var pine = new THREE.Mesh(combined, material);
        pine.geometry.computeVertexNormals();
        pine.position.x = x;
        pine.position.y = y;
        pine.position.z = z;

        pine.castShadow = true;
        pine.receiveShadow = true;

        return pine;
    }
    else {
        var texture = new THREE.TextureLoader().load( "./textures/vector.jpg" )
        var leafGeometry = new THREE.IcosahedronGeometry( radius, 1 );
        var leafMaterial = new THREE.MeshLambertMaterial( { color: tree_color, map: texture } );
            var leaf = new THREE.Mesh( leafGeometry, leafMaterial );

        leaf.position.x = x;
        leaf.position.y = y+radius;
        leaf.position.z = z;

        leaf.castShadow = true;
        leaf.receiveShadow = true;

        return leaf;
    }
}

// draws a tree of given type at the given location
function tree(type, trunk_radius, trunk_height, tree_radius, tree_height, x, y, z ){
    var t = trunk( trunk_radius, trunk_height, x, z );
    var f = leaf( type, tree_radius, tree_height, x, y, z );
    scene.add( t );
    scene.add( f );
}
