function init_v0() 
{	
	console.log("init!");
	document.body.addEventListener('touchmove', noScrolling, false);
	clock.start();

	// create stars
	for(var i=0; i<50; i++){
		mat = new THREE.SpriteMaterial({map: glowTextures[i%4], color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		var st = new THREE.Sprite(mat);
		st.position.set( Math.random()*(myStartX+400)-(myStartX+200), Math.random()*-100+400, Math.random()*(myStartZ+400)-(myStartZ+200) );
		st.rotation.y = Math.random()*Math.PI;
		st.scale.set(7,7,7);
		scene.add(st);
		stars.push(st);
	}

	// hide poop ring
	for(var i=0; i<poopTowers.length; i++){
		poopTowers[i].visible = false;
	}

	// emitter.start();

	// EFFECT
		// if(isItVR){
		// 	effect = new THREE.StereoEffect(renderer);
		// 	effect.seperation = 0.2;
		// 	effect.targetDistance = 50;
		// 	effect.setSize(window.innerWidth, window.innerHeight);
		// }

	// window.addEventListener('click', fullscreen, false);

	// Controls
		controls = new THREE.DeviceControls(camera, myWorldCenter, true);
		scene.add( controls.getObject() );

	setTimeout(function(){
		//
		bathroom.position.copy( myPosition );

		// firstGuy = createSimplePlayer( myPosition, myColor, whoIamInLife );
		//v1
		// firstGuy = createSitPlayer( myPosition, myColor, whoIamInLife );
		// dailyLifePlayers.push(firstGuy);
		//v2
		firstGuy = new Person( myPosition, myColor, whoIamInLife, playerNName );
		dailyLifePlayerDict[ whoIamInLife ] = firstGuy;
		// firstGuy.wordTexture.clear('cyan').drawText(firstGuy.nname, undefined, 200, 'red');
		console.log("Me built!");
		// UpdatePplCount( Object.keys(dailyLifePlayerDict).length, totalPplInWorldsCount );

		// secondGuy = createPlayer( new THREE.Vector3(0,0,-3), yourMat );
		// dailyLifePlayers.push(secondGuy);

		// use vrmanager instead
		// window.addEventListener('click', fullscreen, false);

		pplCount.rotation.y = controls.rotY();
		flushHandler.rotation.y = controls.rotY();

	},1000);

	// animate();
	animate(performance ? performance.now() : Date.now());
}

function superInit_v0(){

	if(isMobile){
		optimizePoopSize = 10;
	}		
	else{
		optimizePoopSize = 20;
		personAmount = 5;
	}

	// WAVES
		// for(var i=0; i<7; i++){
		// 	var tanW = new TanWave(timeWs[i%10], 0.01, 3, 0);
		// 	tanWaves.push(tanW);
		// 	tanWRun.push( tanW.run() );
		// }

	// myStartX = ( Math.random() - 0.5) * 100;
	// myStartZ = ( Math.random() - 0.5) * 100;
	// myPosition = new THREE.Vector3(myStartX, myStartY, myStartZ);
	myColor = Math.random() * 0xffffff;

	toiletCenters[0] = new THREE.Vector3(0,-5,0);
	toiletCenters[1] = new THREE.Vector3(25,-5,-50);
	toiletCenters[2] = new THREE.Vector3(-25,-5,-50);

	// Assign position
		console.log("whoIamInLife: " + whoIamInLife);
		// meInWorld = Math.floor(whoIamInLife/18);			// which world
		// meInBGroup = Math.floor(whoIamInLife/18) % 3;		// which toilet
		meInSGroup = ( whoIamInLife%18 )%18;					// which seat on the toilet
		myStartX = Math.sin(Math.PI*2/18*meInSGroup)*18;
		myStartZ = Math.cos(Math.PI*2/18*meInSGroup)*18;

		myWorldCenter = toiletCenters[0].clone();
		myWorldCenter.y = myStartY;

		// Math.sin(Math.PI*2/6*i)*18, 0, Math.cos(Math.PI*2/6*i)*18
		myPosition = new THREE.Vector3( myStartX, myStartY, myStartZ );
		// myPosition.set( Math.sin(Math.PI*2/6*meInSGroup)*18, 150, Math.cos(Math.PI*2/6*meInSGroup)*18 );
		console.log("Me in world: " + meInWorld + ", seat: " + meInSGroup);

	//Prevent scrolling for Mobile
	noScrolling = function(event){
		event.preventDefault();
	};

	// move after init(), just and scroll the instruction images
	// document.body.addEventListener('touchmove', noScrolling, false);

	// activate after landing
	// window.addEventListener('mousedown', myMouseDown, false);

	// WEB_AUDIO_API --------------------------------------
		// bufferLoader = new BufferLoader(
		// 	audioContext, [ '../audios/duet/nightForest.mp3',
		// 				    '../audios/duet/firecrack.mp3',
		// 				    '../audios/stomach_bg_long.mp3',
		// 				    '../audios/bathroom.mp3'], 
		// 			  finishedLoading
		// );
		// bufferLoader.load();

	// HOWLER
		sound_forest = new Howl({
			urls: ['../audios/duet/nightForest.mp3'],
			loop: true,
			volume: 0.2
		});

		sound_opening = new Howl({
			urls: ['../audios/opening_2.mp3'],
			volume: 1,
			onend: function() {
				console.log("End of the opening!");
				sound_bathroom.fadeIn(0.9, 2000);
				EnterSceneTwo_v2();
			}
		});

		sound_fire = new Howl({
			urls: ['../audios/duet/firecrack.mp3'],
			loop: true,
			volume: 0.1
		});

		sound_bathroom = new Howl({
			urls: ['../audios/bathroom.mp3'],
			loop: true,
			volume: 0.2
		});

		sound_stomach = new Howl({
			urls: ['../audios/stomach_bg_long.mp3'],
			loop: true,
			volume: 0
		});

		sound_poop = new Howl({
			urls: ['../audios/poopsong.mp3'],
			// loop: true,
			volume: 1,
			onend: function() {
				// end of poop (celebration) -> end
				sound_bathroom.play().fadeIn(1, 2000);

				EnterSceneEnd();
			}
		});

		sound_meditation = new Howl({
			urls: ['../audios/meditation_3.mp3'],
			loop: true,
			volume: 0.9
		});

	time = Date.now();
	clock = new THREE.Clock();
	// clock.start();

	// THREE.JS -------------------------------------------
	// RENDERER
		container = document.getElementById('render-canvas');
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

		renderer.setPixelRatio(window.devicePixelRatio);
		// renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.setClearColor(0x000000, 1);
		container.appendChild(renderer.domElement);

	// VR_EFFECT
		effect = new THREE.VREffect(renderer);
		effect.setSize(window.innerWidth, window.innerHeight);

	// Create a VR manager helper to enter and exit VR mode.
		var params = {
		  hideButton: false, // Default: false.
		  isUndistorted: false // Default: false.
		};
		vrmanager = new WebVRManager(renderer, effect, params);

	// SCENE
		// scene = new THREE.Scene();
		// if(isMobile)
		// 	scene = new Physijs.Scene({fixedTimeStep: 1 / 40});
		// else
			scene = new Physijs.Scene();

		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		// scene.addEventListener(
		// 	'update',
		// 	function() {
		// 		scene.simulate( undefined, 1 );
		// 		physics_stats.update();
		// 	}
		// );


	// LIGHT
		// light = new THREE.DirectionalLight( 0xffffff, 1);
		// light.position.set(1,1,1);
		// scene.add(light);
		// light = new THREE.DirectionalLight( 0xffffff, 1);
		// light.position.set(-1,1,-1);
		// scene.add(light);
		hemiLight = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
		hemiLight.intensity = 0.0;
		scene.add(hemiLight);

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;


	loadingManger = new THREE.LoadingManager();
	textureLoader = new THREE.TextureLoader();
	loader = new THREE.JSONLoader();

	// PLAYERS
		toiletMat = new THREE.MeshLambertMaterial({color: 0xffffff});
		eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

		LoadTexModelPoop( 'images/poop.png', 'models/poop.js' );

		LoadTexModelPoopHeart( 'images/poopHeart.png', 'models/poopHeart.js' );

		// textureLoader.load('images/poopMocaronS.png', function(texture){
		// 	poopMTex = texture;
		// 	poopMMat = new THREE.MeshBasicMaterial({map: poopMTex});
		// 	loadModelPoopMacaron( "models/poopMacaron2.js" );
		// });

	// wave
		// waterwaveTex = textureLoader.load('images/wave2.png', loadModelWave);
		LoadTexModelWave( 'images/wave2.png', 'models/water_wave_onesided.js' );

	// BATHROOM
		//v1
		/*
		loader.load('images/bathroom.png', function(texture){
			bathroomTex = texture;
			bathroomMat = new THREE.MeshBasicMaterial({map: bathroomTex});
			// bathroomMat = new THREE.MeshLambertMaterial({color: 0xffffff});
			loadModelBathroom( "models/bathroom.js" );
		});
		*/
		// bathroomTex = textureLoader.load('images/bathroom.png');
		// bathroomMat = new THREE.MeshLambertMaterial({map: bathroomTex});
		// big toilet
		// toiletMat --> basic white
		bigToiletMat = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		var toiletLoader = new THREE.JSONLoader();
		toiletLoader.load( "models/bigToilet_v5_1.js", function( geometry ) {
			bigToiletGeo = geometry;
			bigToilet = new THREE.Mesh( bigToiletGeo.clone(), toiletMat );
			bigToilet.scale.set(1.5, 1.5, 1.5);
			bigToilet.position.copy( toiletCenters[0]);
			scene.add( bigToilet );

			// loadingCount();
			loadingCountText( "white toilet" );
		} );

		// // textures loading hope will work!!
		// 	function graffiti_TLM (txt){
		// 		txt.wrapS = txt.wrapT = THREE.RepeatWrapping;
		// 		txt.repeat.set( 4, 4 );
		// 	};
		// 	graffitiTex = textureLoader.load('images/graffitiS.png', graffiti_TLM);
		// 	floorTex = textureLoader.load('images/floor.jpg', graffiti_TLM);
		// 	doorTex = textureLoader.load('images/door.png');

		// function intestine_TLM (txt){
		// 	intestineAnimator = new TextureAnimator( txt, 3, 1, 4, 60, [0,1,2,1] );
		// 	intestineMat = new THREE.MeshBasicMaterial({map: txt});
		// 	bigToiletAniMat = new THREE.MeshBasicMaterial({ map: txt, transparent: true, opacity: 0.0, side: THREE.DoubleSide });
		// };
		// intestineTex = textureLoader.load( "images/intestines.png", intestine_TLM);

		// function poster_TLM (txt){
		// 	posterMat = new THREE.MeshLambertMaterial({map: txt});
		// };
		// posterTex = textureLoader.load( "images/poster_texture.jpg", poster_TLM);
		
		LoadTexBathroom( "images/intestines.png", "images/poster_texture.jpg" );

		// setTimeout(function(){
		// 	// fucking model loading time
		// 	loadModelBigToilet();

		// }, 2000);

		// v.2
		// intestineTex = textureLoader.load( "images/intestine_1.png" );
		// var i1 = textureLoader.load( "images/intestine_1.png" );
		// var i2 = textureLoader.load( "images/intestine_2.png" );
		// var i3 = textureLoader.load( "images/intestine_3.png" );
		// intestineTexs.push(i1);
		// intestineTexs.push(i2);
		// intestineTexs.push(i3);
		// intestineMat = new THREE.MeshBasicMaterial( {map: intestineTex} );
		// intestinesAnimator = new TexturesAnimator( intestineMat, intestineTexs, 4, 60, [0,1,2,1] );

		// v.Normal map
		// intestineMat = new THREE.MeshPhongMaterial({
		// 	color: 0xff265d,
		// 	specular: 0xff265d,
		// 	shininess: 50,
		// 	map: intestineTex,
		// 	normalMap: textureLoader.load( "images/812-normal_NRM.png" ),
		// 	// normalScale: new THREE.Vector2( -1, - 1 ),
		// 	specularMap: textureLoader.load( "images/812-normal_SPEC.png" ),
		// 	displacementMap: textureLoader.load("images/812-normal_DISP.png"),
		// 	displacementScale: 3,
		// 	// displacementBias: - 0.428408,
		// 	side: THREE.DoubleSide
		// });

		// loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/bathroom2.js" );
		
		// loadModelBathroomsV2( "models/bathroom/b_door.js",
		// 					  "models/bathroom/b_sides.js",
		// 					  "models/bathroom/b_floor.js",
		// 					  "models/bathroom/b_smallStuff.js",
		// 					  "models/bathroom/b_smallWhite.js",
		// 					  "models/bathroom/paper_bottom.js",
		// 					  "models/bathroom/paper_top.js",
		// 					  "models/bathroom2.js" );

		// setTimeout(function(){
		// 	var testBall = new THREE.Mesh( new THREE.SphereGeometry(5), intestineMat);
		// 	scene.add(testBall);

		// 	loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/bathroom2.js" );
		// }, 1000);

		// loader.load('images/intestine.png', function(texture){
		// 	bathroomTex = texture;
		// 	loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/bathroom2.js" );
		// });
		// loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/tubeTest.js" );

	// T_PAPER
		toilet_paper = new THREE.Object3D();
		var tPaper_handle_Mat = new THREE.MeshLambertMaterial({color: 0x03b8a0});
		var tPaper_paper_Mat = new THREE.MeshLambertMaterial({color: 0xffffff});
		loader.load( "models/t_paper0.js", function(geometry){
			t_paper0 = new THREE.Mesh(geometry, tPaper_handle_Mat);
			toilet_paper.add(t_paper0);

			loader.load( "models/t_paper1.js", function(geometry1){
				t_paper1 = new THREE.Mesh(geometry1, tPaper_paper_Mat);
				toilet_paper.add(t_paper1);

				loader.load( "models/t_paper2.js", function(geometry2){
					t_paper2 = new THREE.Mesh(geometry2, tPaper_paper_Mat);
					t_paper2.position.z = 1.06;
					toilet_paper.add(t_paper2);

					// scene.add(toilet_paper);

					// extend the toilet paper
					// toilet_paper.children[2].scale.y

					for(var i=0; i<20; i++){
						var tp = toilet_paper.clone();
						tp.position.set( Math.sin(Math.PI*2/20*i)*21, 0, Math.cos(Math.PI*2/20*i)*21 );
						tp.rotation.y = Math.PI*2/20*i + Math.PI;
						scene.add(tp);

						var tpTween = new TWEEN.Tween(tp.children[2].scale)
									  .to({y: 20}, 2000)
									  .repeat(Infinity)
									  .delay(50*i)
									  .yoyo(true)
									  .easing(TWEEN.Easing.Elastic.InOut)
									  .start();
					}
				});
			});
		});

	// PERSON
		loadModelAniGuy();
		// loader.load( "models/person3.js", function( geometry ) {
		// 	personGeo = geometry;

		// 	// loadingCount();
		// 	loadingCountText("ani guy");
		// });

	// STAR
	for(var i=0; i<starFiles.length; i++){
		// glowTexture = new THREE.ImageUtils.loadTexture( starFiles[i] );
		// var textureLoader = new THREE.TextureLoader();
		// glowTexture = textureLoader.load( starFiles[i], function(texture){
		// 	glowTexture = texture;
		// 	glowTextures.push(glowTexture);
		// 	starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
		// 	starAnimators.push(starAnimator);
		// } );

		LoadStarTexture( i );
	}

	// RAYCASTER!
		eyerayCaster = new THREE.Raycaster();

	// FLUSH_HANDLER
		mat  = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		flushHandler = new THREE.Mesh( new THREE.BoxGeometry(5,1,3), mat );

		exitTexture = new THREEx.DynamicTexture(512,256);
		exitTexture.context.font = "bolder 250px StupidFont";
		exitTexture.clear('white').drawText("EXIT", undefined, 220, 'red');
		mat = new THREE.MeshBasicMaterial({map: exitTexture.texture, side: THREE.DoubleSide, transparent: true});
		mesh = new THREE.Mesh(new THREE.PlaneGeometry( exitTexture.canvas.width, exitTexture.canvas.height), mat );
		mesh.scale.set(0.0055,0.0055,0.0055);
		mesh.rotation.x = Math.PI/2;
		mesh.position.y = -0.52;
		flushHandler.add(mesh);

		mat = new THREE.MeshBasicMaterial({color: 0xffffff});
		var meshh = new THREE.Mesh( new THREE.BoxGeometry(0.2,30,0.2), mat);
		var meshhh = meshh.clone();
		meshh.position.set(-1.4, 15, 0);
		meshhh.position.set(1.4, 15, 0);
		flushHandler.add(meshh);
		flushHandler.add(meshhh);

		flushHandler.position.y = 20;
		scene.add(flushHandler);

	// Sinwave
		sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

	// Ground
		var ground_material = Physijs.createMaterial(
			new THREE.MeshBasicMaterial({ color: 0x0000ff }),
			.8, // high friction
			.3 // low restitution
		);
		ground = new Physijs.BoxMesh(
			new THREE.BoxGeometry(50, 1, 50),
			ground_material,
			0 // mass
		);
		ground.position.set(0,-13,3);
		ground.rotation.set(-0.05,0,-0.05);

		/*
		new TWEEN.Tween(ground.position)
						.to({y: -12}, 1000)
						.repeat( Infinity )
						.yoyo(true)
						.onUpdate(function(){
							ground.__dirtyPosition = true;
						})
						.start();

		new TWEEN.Tween(ground.rotation)
						.to({x: 0.05, z:0.05}, 1000)
						.repeat( Infinity )
						.yoyo(true)
						.onUpdate(function(){
							ground.__dirtyRotation = true;
						})
						.start();
		*/
		ground.visible = false;
		scene.add( ground );
		
		box_geometry = new THREE.BoxGeometry( 4, 4, 4 );
		// createBox();

	// Portals
	var portalMat = new THREE.MeshNormalMaterial();
	var portalGeo = new THREE.TorusGeometry( 10, 3, 10, 10 );
	var portalLightGeo = new THREE.CylinderGeometry( 7, 20, 120, 7 );
	var portalLightMat = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.2, side: THREE.DoubleSide} );
	
	for(var i=0; i<7; i++){

		var portal = new THREE.Mesh(portalGeo.clone(), portalMat);
		portal.position.copy( portalPosition[i] );
		portal.rotation.x = Math.PI/2;
		portal.scale.set(0.001,0.001,0.001);
		portal.visible = false;
		scene.add(portal);
		portals.push(portal);

		// new TWEEN.Tween(portal.scale)
		// 	.to({x:0.7,y:0.7,z:0.7}, 1000)
		// 	.repeat(Infinity)
		// 	.yoyo(true)
		// 	.start();
		
		// light beam
		var portalLight = new THREE.Mesh( portalLightGeo, portalLightMat );
		// var portalLight = new THREE.Mesh( portalLightGeo, partyLightMat );
		portalLight.position.copy( portal.position );
		portalLight.position.y = 40;
		portalLight.scale.set(0.001,0.001,0.001);
		portalLight.visible = false;
		scene.add(portalLight);
		portalLights.push(portalLight);
	}
	var p_tex_loader = new THREE.TextureLoader();
	particleTex = p_tex_loader.load('images/blue_particle.jpg', function(){
		console.log("loaded particle tex");
	});

	// WORLD_BUBBLE
	// - to create other-world feeling
	// - TOO HEAVY :(
		/*
			worldBubble = new THREE.Mesh(new THREE.BoxGeometry(130,800,130), new THREE.MeshBasicMaterial({color: 0x9791ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide}));
			scene.add( worldBubble );
			loader.load( "models/simpleBigToilet.js", function( geometry ) {
				var bigSimpleToilet = new THREE.Mesh(geometry, toiletMat);
				var bst = new THREE.Object3D();

				for(var i=-2; i<3; i++) {
					if(i>=0) i++;
					for(var j=-2; j<3; j++){
						for(var k=-2; k<3; k++){
							if(k>=0) k++;
							var bbb = bigSimpleToilet.clone();
							bbb.position.set( i*60, j*50, k*60 );
							bst.add(bbb);
						}
					}
				}

				scene.add(bst);
			});
		*/

	setTimeout(function(){
		// PEOPLE_COUNT
			pplCountTex = new THREEx.DynamicTexture(1024,1024);
			pplCountTex.context.font = "bolder 150px StupidFont";
			pplCountTex.clear();
			// pplCountTex.clear().drawText("Pooper", undefined, 100, 'white');
			// pplCountTex.drawText("Count", undefined, 250, 'white');
			// pplCountTex.drawText("this world: 0", undefined, 500, 'white');
			// pplCountTex.drawText("total: 0", undefined, 650, 'white');
			pplCountMat = new THREE.MeshBasicMaterial({map: pplCountTex.texture, side: THREE.DoubleSide, transparent: true});
			var pCountMesh = new THREE.Mesh(new THREE.PlaneGeometry( pplCountTex.canvas.width, pplCountTex.canvas.height), pplCountMat );
			pCountMesh.rotation.x = Math.PI/2;
			pplCount = new THREE.Object3D();
			pplCount.add(pCountMesh);
			pplCount.scale.set(0.04,0.04,0.04);
			pplCount.position.y = 80;
			scene.add( pplCount );
	},1000);

	// AniPerson
		personTex = textureLoader.load('images/galleryGuyTex.png', function(texture){
			personTex = texture;
			personCircle = new THREE.Object3D();
			personCircle.visible = false;
			personMat = new THREE.MeshBasicMaterial( { map: personTex, morphTargets: true } );

			for(var i=0; i<personAmount; i++){
				//toiletCenters[meInSGroup] 
				var pppos = new THREE.Vector3( toiletCenters[0].x+Math.sin(Math.PI*2/personAmount*i)*21, toiletCenters[0].y+8.5, toiletCenters[0].z+Math.cos(Math.PI*2/personAmount*i)*21 );
				person = new AniPersonBeAdded( 0.4, personKeyframeSet, personAniOffsetSet, personGeo, personMat, pppos, 1 );
				person.body.rotation.y = Math.PI*2/personAmount*i + Math.PI;

				persons.push(person);

				personIsWalking.push(false);
				person.body.scale.set(2,2,2);

				// look forward
				// person.body.rotation.y = (360/personAmount*i+90)*(Math.PI/180);

				scene.add(person.body);
			}

			// personAniInterval = setInterval(function(){
			// 	for (var i = 0; i < persons.length; i++) {
			// 		persons[i].changeAni( personAniSequence[personAniIntervalCounter%4] );
			// 	};
			// 	personAniIntervalCounter++;
			// }, 2000);

			// hide all person
			for(var i=0; i<persons.length; i++){
				persons[i].body.visible = false;
			}
		});

	InitParticles();

	///////////////////////////////////////////////////////

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.bottom = '5px';
	// stats.domElement.style.zIndex = 100;
	// stats.domElement.children[ 0 ].style.background = "transparent";
	// stats.domElement.children[ 0 ].children[1].style.display = "none";
	// container.appendChild( stats.domElement );

	// physics_stats = new Stats();
	// physics_stats.domElement.style.position = 'absolute';
	// physics_stats.domElement.style.bottom = '55px';
	// physics_stats.domElement.style.zIndex = 100;
	// physics_stats.domElement.children[ 0 ].style.background = "transparent";
	// physics_stats.domElement.children[ 0 ].children[1].style.display = "none";
	// container.appendChild( physics_stats.domElement );

	//////////////////////////////////////////////////////
	
	
	// EVENTS
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', myKeyPressed, false);
	window.addEventListener('keyup', myKeyUp, false);
}