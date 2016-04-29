function LoadStarTexture( tex ) {
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load( tex, function(texture){
		glowTexture = texture;
		glowTextures.push(glowTexture);
		starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
		starAnimators.push(starAnimator);
	} );
}

function LoadTexBathroom( intestine, poster ) {
	// textures loading hope will work!!
		function graffiti_TLM (txt){
			txt.wrapS = txt.wrapT = THREE.RepeatWrapping;
			txt.repeat.set( 4, 4 );
		};
		var textureLoader = new THREE.TextureLoader();
		graffitiTex = textureLoader.load('images/graffitiS.png', graffiti_TLM);
		floorTex = textureLoader.load('images/floor.jpg', graffiti_TLM);
		doorTex = textureLoader.load('images/door.png');

	var texLoader = new THREE.TextureLoader();
	texLoader.load(intestine, function(texture){
		intestineTex = texture;
		intestineAnimator = new TextureAnimator( intestineTex, 3, 1, 4, 60, [0,1,2,1] );
		intestineMat = new THREE.MeshBasicMaterial({map: intestineTex});
		bigToiletAniMat = new THREE.MeshBasicMaterial({ map: intestineTex, transparent: true, opacity: 0.0, side: THREE.DoubleSide });

		var texLoader2 = new THREE.TextureLoader();
		texLoader2.load(poster, function(texture2){
			posterTex = texture2;
			posterMat = new THREE.MeshLambertMaterial({map: posterTex});

			// fucking model loading time
			loadModelBigToilet();
		});
	});
}

function LoadTexModelWave( tex, model ){
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load(tex, function(texture){
		waterwaveTex = texture;
		
		var loader = new THREE.JSONLoader();
		loader.load( model, function( geometry ) {
			var waterPos = 	new THREE.Vector3(0,-7,3);
			waterPos.add( toiletCenters[0] );

			waterwave = new AniObject( 0.3, waterKeyframeSet, waterAniOffsetSet, geometry,
									   new THREE.MeshBasicMaterial({ map: waterwaveTex, morphTargets: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
									   new THREE.Vector3(0,-12,3), 1.7 );

			// loadingCount();
			loadingCountText("water wave");
		});
	});
}

function LoadTexModelPoopHeart( tex, model ){
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load(tex, function(texture){
		poopHeartTex = texture;
		poopHeartMat = new THREE.MeshLambertMaterial({map: poopHeartTex});
		
		// MODEL_BODY
		var loader = new THREE.JSONLoader();
		loader.load( model, function( geometry ){
			poopHeartGeo = geometry.clone();
			poopHeartGeo.computeBoundingSphere();

			poopHeart = new THREE.Mesh(poopHeartGeo, poopHeartMat);

			// then create person!

			// loadingCount();
			loadingCountText("poop heart");
		});
	});
}

function LoadTexModelPoop( tex, model ){
	
	var poopStickGeo = new THREE.BoxGeometry(0.1,1,0.1);
	transY(poopStickGeo, 0.5);
	var poopStick = new THREE.Mesh( poopStickGeo, new THREE.MeshBasicMaterial({color: 0x000000}) );

	// TEXTURE
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load(tex, function(texture){
		poopTex = texture;
		poopMat = new THREE.MeshLambertMaterial({map: poopTex});
		
		// MODEL_BODY
		var loader = new THREE.JSONLoader();
		loader.load( model, function( geometry ){
			poopGeo = geometry.clone();
			// poopGeo.computeBoundingBox();
			poopGeo.computeBoundingSphere();

			poop = new THREE.Mesh(poopGeo, poopMat);
			poopHat = poop.clone();
			// poop.rotation.y += Math.PI;
			// poop.position.y += 0.3;

			var ps_RA = poopStick.clone();
			ps_RA.name = "right arm";
			ps_RA.position.set(0.6,0.3,0);
			ps_RA.rotation.z += Math.PI;
			poop.add(ps_RA);

			var ps_LA = poopStick.clone();
			ps_LA.name = "left arm";
			ps_LA.position.set(-0.6,0.3,0);
			poop.add(ps_LA);

			var ps_RL = poopStick.clone();
			ps_RL.position.set(0.3,-1,0);
			poop.add(ps_RL);

			var ps_LL = poopStick.clone();
			ps_LL.position.set(-0.3,-1,0);
			poop.add(ps_LL);

			// createBox();
			// loadingCount();
			loadingCountText("poop");

			CreatePoopRing();
		});
	});
}