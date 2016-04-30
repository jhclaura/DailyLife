////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect, stats;
var vrmanager;
var hemiLight, controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;

var loadedCount = 0;

var myStartX = 0, myStartZ = 0, myStartY = 180; //2
var myPosition, myStartRotY, worldBubble, pplCount, pplCountTex, pplCountMat;

var model, texture;
var dummy;
var perlin = new ImprovedNoise(), noiseQuality = 1;

var textureLoader, loadingManger;
var poop_TLM, poopHeart_TLM, graffiti_TLM, floor_TLM, door_TLM, intestine_TLM;
var poster_TLM, waterwave_TLM, glow_TLM, person_TLM, skin_TLM, particle_TLM;
var keyIsPressed;

// WAVE
	var timeWs = [0, Math.PI/2, Math.PI, -Math.PI/2, Math.PI+0.3, -Math.PI/5, Math.PI/1.1];
	var frequencyWs = [0.02, 0.01];
	var frequencyW = 0.02, amplitudeW = 0.1, offsetW = 0;
	var sinWave, sinWaves = [], cosWaves = [], tanWaves = [], spin;
	var sinWRun = [], cosWRun = [], tanWRun = [];

// RAYCAST
	var objects = [];
	var ray;
	var projector, eyerayCaster, eyeIntersects;
	var lookDummy, lookVector;

// WEBCAM
	var videoImageContext, videoTexture;
	var videoWidth = 480, videoHeight = 320;
	var eye, eyeGeo, eyeDummy, eyePos;
	var remoteImageContext, remoteTexture;
	var otherEye, otherEyeGeo, otherEyeDummy, otherEyePos;
	var otherEyes=[], otherEyesPos=[], otherEyesRot=[];
	var myMat, yourMat, myColor;

// PLAYERS
	var skinTexture;
	var guyBodyGeo, guyLAGeo, guyRAGeo, guyHeadGeo;
	var personTex;
	var player, playerBody, playerHead;
	var firstPlayer, secondPlayer;
	var firstGuy, firstGuyBody, firstGuyHead, secondGuy, secondGuyBody, secondGuyHead;
	var QforBodyRotation;
	var fGuyHandHigh = false, sGuyHandHigh = false;
	var bodyGeo;
	var dailyLifeME, colorME, dailyLifePlayers = [];
	var dailyLifePlayerDict = {};

	var person, personGeo, personMat, toiletTex, toiletMat;
	var persons = [], personIsWalking = [], personCircle, personAmount = 3;
	var personsAppeared = false, personsAnied = false, personsWalked = false;
	var personWalkTimeoutID, personAniInterval, personAniIntervalCounter=0, personAniSequence = [1,3,5,6];
	var poop, poopGeo, poopTex, poopMat, poopHat, poopHeartTex;
	var poopM, poopMGeo, poopMTex, poopMMat, poopHeartGeo, poopHeartMat, poopHeart;
	var personBody, personHead, personToilet;
	var keyframe, lastKeyframe, currentKeyframe;
	var animOffset = 1, keyduration = 28;
	var aniStep = 0, aniTime = 0, slowAni = 0.4;
	var personKeyframeSet =   [ 28, 15,  1,  8,  1, 12, 10, 1 ];
	var personAniOffsetSet = [  1, 30, 48, 50, 58, 60, 72, 82 ];	//2: sit freeze; 4: push freeze; 7: stand freeze
	var personFreeze = false;

// TOILET_RELATED
	var t_paper0, t_paper1, t_paper2, toilet_paper;
	var bigToilet, bigToiletGeo, waterwave, waterwaveTex;
	var bigToiletTubeNorm, bigToiletTubeAni, bigToiletMat, bigToiletAniMat
	var waterSpeed, waterKeyframeSet=[17], waterAniOffsetSet=[1];
	var aniStepW=0, aniTimeW=0, slowAniW=0.3, keydurationW = 17;
	var keyframeW, animOffsetW=1, currentKeyframeW=0, lastKeyframeW=0;
	var bathroom, bathroomGeo, bathroomTex, bathroomMat, bathroomLight, glowTexture;
	var graffitiTex, floorTex, doorTex;
	var intestineTex, intestineAnimator, intestineTexs = [], intestinesAnimator, intestineMat;
	var toiletCenters = [], myWorldCenter;
	var meInSGroup, meInBGroup;
	var poopIsTalking = false, lookAtMiniPoop = false, poopTalkCount = 0;
	var poopCount = 0;
	var flushHandler, lookAtFlush = false, exitTexture, flushColorChanged = false;
	var poster, posterMat;

// WEB_AUDIO_API!
	var usingWebAudio = true, bufferLoader, convolver, mixer;
	var source, buffer, audioBuffer, gainNode, convolverGain;
	var soundLoaded = false;
	var masterGain, sampleGain;
	var audioSources = [], gainNodes = [];

	var sound_sweet = {};
	var sweetSource;
	var vecZ = new THREE.Vector3(0,0,1);
	var vecY = new THREE.Vector3(0,-1,0);
	var sswM, sswX, sswY, sswZ;
	var camM, camMX, camMY, camMZ;	

	var _iOSEnabled = false;

	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 

	var audioContext = new AudioContext();
	var sample = new SoundsSample(audioContext);

	var sound_fire, sound_bathroom, sound_stomach, sound_forest, sound_poop, sound_meditation, sound_opening;
	var initSound = false, yogaOver = false;

	var switchSound_1 = false;

// TREE
	var treeTexture, treeGeo, treeMat, trees = [];

// STAR
	var star, starMat, glowTexture, glowTextures = [], starAnimator, starAnimators = [], stars = [];
	var starFiles = [ "images/sStar_1.png", "images/sStar_2.png", "images/sStar_3.png", "images/sStar_4.png" ];

// ENV
	var windowRing, windowScreen, windowTex, windowAnimator;
	var tri, triTex, tris = [];

// SPEECH_API
	var recognizing = false;
	var recognition;
	var myWord=" Ahhh", myWords = [];
	var myFakeWord = "FUCK";
	var wordCanvas, wordContext, wordTexture, wordMaterial, wordBubble;
	var allTheMurmur = {};
	var dailyLifeMurmurs = [];

// Physic
	Physijs.scripts.worker = 'js/lib/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';

	var physics_stats, ground;
	var box_geometry, box_material;
	var lookingAtSomeone = -1;

	var allThePoops = [], freezeVec = new THREE.Vector3(0,0,0), optimizePoopSize = 8;

// TRANSITION
	var initTime, meditationTime, celebrationTime, endTime;
	var descendTween;
	var audiosArePlayed = false, inScMeditation = false, inScCelebration = false, inScEnd = false;
	var isAllOver = false;
	var noScrolling;

// PARTICLES
	var emitter, particleGroup;
	var counter, particleTex;
	var portals = [], portalLights = []
	var portalPosition = [ new THREE.Vector3(-61,100,-15),
						   new THREE.Vector3(24,100,87),
						   new THREE.Vector3(58,100,37),
						   new THREE.Vector3(10,100,-67),
						   new THREE.Vector3(-47,100,36),
						   new THREE.Vector3(-71,100,-65),
						   new THREE.Vector3(96,100,-31)];
	var poopTower = [], poopTowers = [], portalPoopAnimation;
	var partyLightMat;


////////////////////////////////////////////////////////////

// init();		// Init after CONNECTION
// superInit();	// init automatically

connectSocket();

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){

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

		LoadStarTexture( starFiles[i] );
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

	// InitParticles();

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
	// automatically resize renderer
	window.addEventListener('resize', onWindowResize, false);
	// window.addEventListener('click', startSpeech, false);
	window.addEventListener('keydown', myKeyPressed, false);
	window.addEventListener('keyup', myKeyUp, false);
}

function ReadyToLoadModelPlayer() {
	textureLoader = new THREE.TextureLoader();
	skinTexture = textureLoader.load('images/guyW.png', function(texture){
		skinTexture = texture;
		loadModelPlayer( "models/Guy2/GuyB.js", "models/Guy2/GuyLA.js", "models/Guy2/GuyRA.js", "models/Guy2/GuyH.js" );
		//
		loadSitModelPlayer( "models/personHead.js", "models/personBody.js", "models/toilet.js" );
	});
}

function loadModelWave(txt){
	waterwaveTex = txt;
	console.log("water wave tex loaded!");
	var loader = new THREE.JSONLoader();
	loader.load( "models/water_wave_onesided.js", function( geometry ) {
		var waterPos = 	new THREE.Vector3(0,-7,3);
		waterPos.add( toiletCenters[0] );

		waterwave = new AniObject( 0.3, waterKeyframeSet, waterAniOffsetSet, geometry,
								   new THREE.MeshBasicMaterial({ map: waterwaveTex, morphTargets: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
								   new THREE.Vector3(0,-12,3), 1.7 );

		// loadingCount();
		loadingCountText("water wave");
	});
};

function loadModelBigToilet() {
	var loader = new THREE.JSONLoader();
	loader.load( "models/bigToilet_v5_2.js", function( geometry ) {
		var tubeGeo = geometry;

		bigToiletTubeNorm = new THREE.Mesh( tubeGeo.clone(), bigToiletMat );
		bigToiletTubeNorm.scale.set(1.5, 1.5, 1.5);
		bigToiletTubeNorm.position.copy( toiletCenters[0]);
		scene.add( bigToiletTubeNorm );

		bigToiletTubeAni = new THREE.Mesh( tubeGeo.clone(), bigToiletAniMat );
		bigToiletTubeAni.scale.set(1.5, 1.5, 1.5);
		bigToiletTubeAni.position.copy( toiletCenters[0]);
		bigToiletTubeAni.visible = false;
		scene.add( bigToiletTubeAni );

		// loadingCount();
		loadingCountText( "big toilet" );
		ReadyToLoadModelPlayer();
	});
}

function loadModelAniGuy() {
	var loader = new THREE.JSONLoader();
	loader.load( "models/person3.js", function( geometry ) {
		personGeo = geometry;

		// loadingCount();
		loadingCountText("ani guy");
	});
}

function CreatePoopRing() {
	var poopMaterial = new THREE.MeshLambertMaterial({map: poopTex});

	// v.1
	// for(var i=0; i<portals.length; i++){

	// 	var poopTower = new THREE.Object3D();
	// 	for(var j=0; j<10; j++){
	// 		var alienPoop = new THREE.Mesh( poopGeo, poopMaterial );
	// 		alienPoop.scale.set(10,10,10);
	// 		alienPoop.position.set( portals[i].position.x, portals[i].position.y-25*j, portals[i].position.z);
	// 		// scene.add(alienPoop);
	// 		poopTower.add(alienPoop);
	// 	}
	// 	scene.add(poopTower);
	// 	poopTowers.push( poopTower );

	// 	// new TWEEN.Tween(poopTower.position)
	// 	// .to({y:"-25"}, 1000)
	// 	// .easing( TWEEN.Easing.Elastic.InOut )
	// 	// .repeat(5)
	// 	// .start();
	// }

	// v.2
	var poopRingIndex = 0;
	for(var j=0; j<10; j++){

		// poop RING!
		var poopTower = new THREE.Object3D();

		for(var i=0; i<portals.length; i++){
			var alienPoop = new THREE.Mesh( poopGeo.clone(), poopMaterial );
			alienPoop.scale.set(9.5,9.5,9.5);
			alienPoop.position.set( portals[i].position.x, 0, portals[i].position.z);
			alienPoop.lookAt( new THREE.Vector3(myPosition.x, 0, myPosition.z) );

			poopTower.add(alienPoop);
		}
		// v.1
		// poopTower.position.y = portals[0].position.y-25*j;

		// v.2
		poopTower.position.y = portals[0].position.y;
		poopTower.scale.y=0.01;

		poopTowers.push( poopTower );
		scene.add(poopTower);
		// poopTower.visible = false;
	}
	
	// Init Portal Poop animation
	// portalPoopAnimation = setInterval(function(){
	// 	// portals height: 100
	// 	for(var i=0; i<poopTowers.length; i++){

	// 		if(poopTowers[i].position.y < -125){
	// 			poopTowers[i].position.y = 100;
	// 			poopTowers[i].scale.y=0;

	// 			new TWEEN.Tween(poopTowers[i].scale)
	// 				.to({y:1}, 1000)
	// 				.start();
	// 		}

	// 		new TWEEN.Tween(poopTowers[i].position)
	// 			.to({x: poopTowers[i].position.x,
	// 				 y: poopTowers[i].position.y-25,
	// 				 z: poopTowers[i].position.z}, 1000)
	// 			.easing( TWEEN.Easing.Elastic.InOut )
	// 			.start();
	// 	}
	// }, 2000);
}

function InitParticles() {
	var p_tex_loader = new THREE.TextureLoader();
	// particleTex = p_tex_loader.load('images/blue_particle.jpg');

	particleGroup = new SPE.Group({
		texture: {
			value: p_tex_loader.load('images/blue_particle.jpg')
		},
		depthTest: false
	});

	for(var i=0; i<portals.length; i++){
		emitter = new SPE.Emitter({
			maxAge: {
				value: 1
			},
			position: {
				value: portals[i].position.clone(),
				spread: new THREE.Vector3(12,12,12)
			},
			// acceleration: {
			// 	value: new THREE.Vector3(0,-10,0),
			// 	spread: new THREE.Vector3(10,0,10)
			// },
			velocity: {
				value: new THREE.Vector3(1,1,1),
				distribution: SPE.distributions.SPHERE
			},
			color: {
				value: new THREE.Color( 0xAA4488 )
			},
			size: {
				value: [80,0]
				// spread: [1,3]
			},
			particleCount: 50
		});
		particleGroup.addEmitter( emitter );
	}
	scene.add( particleGroup.mesh );
}

function InitParticles_v0() {
	textureLoader = new THREE.TextureLoader();
	particleGroup = new SPE.Group({
		texture: {
			value: textureLoader.load('images/blue_particle.jpg')
		},
		depthTest: false
	});

	for(var i=0; i<portals.length; i++){
		emitter = new SPE.Emitter({
			maxAge: {
				value: 1
			},
			position: {
				value: portals[i].position.clone(),
				spread: new THREE.Vector3(12,12,12)
			},
			// acceleration: {
			// 	value: new THREE.Vector3(0,-10,0),
			// 	spread: new THREE.Vector3(10,0,10)
			// },
			velocity: {
				value: new THREE.Vector3(1,1,1),
				distribution: SPE.distributions.SPHERE
			},
			color: {
				value: new THREE.Color( 0xAA4488 )
			},
			size: {
				value: [80,0]
				// spread: [1,3]
			},
			particleCount: 50
		});
		particleGroup.addEmitter( emitter );
	}
	scene.add( particleGroup.mesh );
}

function createBox() {
	var box, material;
	
	material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({map: poopTex}),
		.6, // medium friction
		.3 // low restitution
	);
	
	box = new Physijs.ConvexMesh(
		poopGeo,
		material
	);
	box.collisions = 0;
	
	box.position.set(
		toiletCenters[0].x + Math.random() * 15 - 7.5,
		20,
		toiletCenters[0].z + Math.random() * 15 - 7.5
	);
	
	box.rotation.set(
		Math.random() * Math.PI,
		Math.random() * Math.PI,
		Math.random() * Math.PI
	);
	
	scene.add( box );
}

function createPoop( _pos, _dir ) {
	// Needs: camera position, camera direction

	var poopPhy, poopPhyMat, poopVector = new THREE.Vector3;
	poopVector.set(0,0,0);
	
	poopPhyMat = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({map: poopTex}),	//poopTex
		.8, // high friction
		.3 // low restitution
	);
	

	poopPhy = new Physijs.ConvexMesh(	//ConvexMesh or ConeMesh???
		poopGeo.clone(),	//poopGeo
		poopPhyMat
	);
	poopPhy.collisions = 0;
	
	poopPhy.position.copy( _pos );
	
	poopPhy.rotation.set(
		Math.random() * Math.PI,
		Math.random() * Math.PI,
		Math.random() * Math.PI
	);

	scene.add( poopPhy );

	poopVector = _dir.multiplyScalar( 20 );
	poopPhy.setLinearVelocity( poopVector );
	// poopPhy.applyCentralImpulse( poopVector );

	sample.trigger( getRandomInt(5,12), 1 );

	//
	allThePoops.push( poopPhy );


	// Optimizing performance!!
	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////

	if(allThePoops.length>optimizePoopSize){
		// console.log( allThePoops[ allThePoops.length-11 ] );

		// allThePoops[ allThePoops.length-11 ]._physijs.mass = 0;
		allThePoops[ allThePoops.length-optimizePoopSize-1 ].setAngularFactor( freezeVec );
		allThePoops[ allThePoops.length-optimizePoopSize-1 ].setAngularVelocity( freezeVec );
		allThePoops[ allThePoops.length-optimizePoopSize-1 ].setLinearFactor( freezeVec );
		allThePoops[ allThePoops.length-optimizePoopSize-1 ].setLinearVelocity( freezeVec );

		if(allThePoops.length>optimizePoopSize*4){
			var removeIndex = allThePoops.length-optimizePoopSize*4-1;

			scene.remove( allThePoops[ removeIndex ] );
			allThePoops.splice( removeIndex,1 );
		}
	}
}

function createHeart( fromIndex, toIndex ) {
	// Needs: camera position, camera direction

	var position_from = dailyLifePlayerDict[ fromIndex ].player.position.clone();
	var position_to = dailyLifePlayerDict[ toIndex ].player.position.clone();

	position_to.subVectors( position_to, position_from ).multiplyScalar(4/6).add( position_from );
	// position_to = dailyLifePlayerDict[ fromIndex ].player.worldToLocal( position_to );

	var shootT = position_from.distanceTo( position_to );

	var poopH = poopHeart.clone();
	// var poopH = new THREE.Mesh(poopHeartGeo, poopHeartMat);
	poopH.scale.set(0.5,0.5,0.5);
	poopH.position.copy( dailyLifePlayerDict[ fromIndex ].player.position );
	poopH.lookAt( dailyLifePlayerDict[ toIndex ].player.position );
	scene.add(poopH);

	var mHOut = new TWEEN.Tween(poopH.position)
				.to( {x: position_to.x,
					  y: position_to.y-1,
					  z: position_to.z}, Math.floor(shootT)*400 )
				.easing( TWEEN.Easing.Quadratic.InOut );

	var mHGone = new TWEEN.Tween(poopH.scale)
				.to( {x: 0.01, y: 0.01, z: 0.01}, 1000 )
				.easing( TWEEN.Easing.Elastic.In )
				// .delay( 1000 )
				.onComplete(function(){
					scene.remove(poopH);
				});

	mHOut.chain(mHGone);
	mHOut.start();

	sample.trigger( 4, 1 );
}

function moveMacaPoop( fromIndex, toIndex ) {
	// Needs: camera position, camera direction

	var position_from = dailyLifePlayerDict[ fromIndex ].player.position.clone();
	var position_to = dailyLifePlayerDict[ toIndex ].player.position.clone();

	position_to.subVectors( position_to, position_from ).multiplyScalar(4/6).add( position_from );
	position_to = dailyLifePlayerDict[ fromIndex ].player.worldToLocal( position_to );

	var shootT = position_from.distanceTo( position_to );

	dailyLifePlayerDict[ fromIndex ].player.children[2].visible = true;
	dailyLifePlayerDict[ fromIndex ].player.children[2].lookAt( dailyLifePlayerDict[ toIndex ].player.position );

	var mpOut = new TWEEN.Tween(dailyLifePlayerDict[ fromIndex ].player.children[2].position)
								.to( {x: position_to.x,
									  y: position_to.y-1,
									  z: position_to.z}, Math.floor(shootT)*100 )
								.easing( TWEEN.Easing.Cubic.Out );
	
	var mpBack = new TWEEN.Tween(dailyLifePlayerDict[ fromIndex ].player.children[2].position)
								.to( {x: 0, y: 0, z: 0}, Math.floor(shootT)*100 )
								.easing( TWEEN.Easing.Cubic.Out )
								.delay(1000)
								.onComplete(function(){
									dailyLifePlayerDict[ fromIndex ].player.children[2].visible = false;
								});
	
	mpOut.chain(mpBack);
	mpOut.start();
}

function init() 
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

		/* v.1
		for(var i=0; i<personAmount; i++){
			//toiletCenters[meInSGroup] 
			var pppos = new THREE.Vector3( toiletCenters[0].x+Math.sin(Math.PI*2/personAmount*i)*28, toiletCenters[0].y+7, toiletCenters[0].z+Math.cos(Math.PI*2/personAmount*i)*28 );
			person = new AniPersonBeAdded( 0.4, personKeyframeSet, personAniOffsetSet, personGeo, personMat, pppos, 1 );
			persons.push(person);
			person.body.scale.set(7,7,7);

			// look forward
			person.body.rotation.y = (360/personAmount*i+90)*(Math.PI/180);

			personCircle.add(person.body);

			if(i==(personAmount-1))
				scene.add(personCircle);
		}
		personCircle.visible = false;
		*/

		// v.2
		// for(var i=0; i<personAmount; i++){
		// 	//toiletCenters[meInSGroup] 
		// 	var pppos = new THREE.Vector3( toiletCenters[0].x+Math.sin(Math.PI*2/personAmount*i)*21, toiletCenters[0].y+8.5, toiletCenters[0].z+Math.cos(Math.PI*2/personAmount*i)*21 );
		// 	person = new AniPersonBeAdded( 0.4, personKeyframeSet, personAniOffsetSet, personGeo, personMat, pppos, 1 );
		// 	person.body.rotation.y = Math.PI*2/personAmount*i + Math.PI;

		// 	persons.push(person);
		// 	personIsWalking.push(false);
		// 	person.body.scale.set(2,2,2);

		// 	// look forward
		// 	// person.body.rotation.y = (360/personAmount*i+90)*(Math.PI/180);

		// 	scene.add(person.body);
		// }

		// personAniInterval = setInterval(function(){
			
		// 	//1 --> walk
		// 	person.changeAni( 0 );
		// 	//2 --> sit down
		// 	person.changeAni( 1 );
		// 	//3 --> push
		// 	person.changeAni( 3 );
		// 	//4 --> release
		// 	person.changeAni( 5 );
		// 	//5 --> stand up
		// 	person.changeAni( 6 );
			

		// 	// console.log('do animation' + personAniIntervalCounter%5);
		// 	for (var i = 0; i < persons.length; i++) {
		// 		persons[i].changeAni( personAniSequence[personAniIntervalCounter%4] );
		// 	};

		// 	personAniIntervalCounter++;
		// }, 2000);

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
		

	// CONTROLS
	// controls = new THREE.OrbitControls( camera, renderer.domElement );

	// animate();
	animate(performance ? performance.now() : Date.now());
}

function myKeyPressed( event ){
	if(keyIsPressed)	return;
	keyIsPressed = true;

	switch ( event.keyCode ) {

		case 49: //1 --> walk
			person.changeAni( 0 );
			break;

		case 50: //2 --> sit down
			person.changeAni( 1 );
			break;

		case 51: //3 --> push
			person.changeAni( 3 );
			break;

		case 52: //4 --> release
			person.changeAni( 5 );
			break;

		case 53: //5 --> stand up
			person.changeAni( 6 );
			break;

		case 48: //0 --> shoot poop
			if(yogaOver){	// bring back after developing
				// createPoop( controls.position(), controls.getDirection() );
				poopCount ++;
			}

			if(lookingAtSomeone != -1){

				// v1 - removed. saved in old script

				// v2
				// moveMacaPoop( whoIamInLife, lookingAtSomeone );

				// v3
				createHeart( whoIamInLife, lookingAtSomeone );

			} else {
				createPoop( controls.position(), controls.getDirection() );
			}
			
			// if(poopCount == 3){
			// 	// enter celebration period
			// 	sound_poop.play();
			// }

			// Send POSITION + DIRECTION to server!!
				var msg = {
					'type': 'shootPoop',
					'index': whoIamInLife,
					'toWhom': lookingAtSomeone,
					'playerPos': controls.position(),
					'playerDir': controls.getDirection(),
					'worldId': meInWorld
				};

				if(ws){
					sendMessage( JSON.stringify(msg) );
				}
			break;

		case 56: //8
			EnterSceneCelebrate();
			break;

		case 57: //9
			// to center of the toilet, then go down the tube
			// v.1 - removed. saved in old script

			// v.2
			EnterSceneEnd();
			break;
	}
}

function myKeyUp(event){
	keyIsPressed = false;
}

// moved to DeviceControls
/*
function myMouseDown(event) {
	if(yogaOver){	// bring back after developing
		poopCount ++;
	}

	if(lookingAtSomeone != -1){
		createHeart( whoIamInLife, lookingAtSomeone );
	} else {
		createPoop( controls.position(), controls.getDirection() );
	}
	
	if(poopCount == 3){
		// enter celebration period
		sound_poop.play();
	}

	// Send POSITION + DIRECTION to server!!
		var msg = {
			'type': 'shootPoop',
			'index': whoIamInLife,
			'toWhom': lookingAtSomeone,
			'playerPos': controls.position(),
			'playerDir': controls.getDirection(),
			'worldId': meInWorld
		};

		if(ws){
			sendMessage( JSON.stringify(msg) );
		}
}
*/

function loadModelPlayer( _body, _left_arm, _right_arm, _head ){
	loader = new THREE.JSONLoader();

	// BODY
	loader.load( _body, function( geometry ){
		guyBodyGeo = geometry.clone();
	});

	// LEFT_ARM
	loader.load( _left_arm, function( geometry2 ){
		var tmpLA = geometry2.clone();
		transY(tmpLA, -0.2);
		transZ(tmpLA, -0.1);
		guyLAGeo = tmpLA;
	});

	// RIGHT_ARM
	loader.load( _right_arm, function(geometry3){
		var tmpRA = geometry3.clone();
		transY(tmpRA, -0.2);
		transZ(tmpRA, -0.1);
		guyRAGeo = tmpRA;
	});

	// HEAD
	loader.load( _head, function(geometry4){
		geometry4.center();
		guyHeadGeo = geometry4.clone();

		// loadingCount();
		loadingCountText("head");
	});
}

function loadSitModelPlayer( _head, _body, _toilet ){
	loader = new THREE.JSONLoader();

	// BODY
	loader.load( _body, function( geometry ){
		personBody = geometry.clone();
	});

	// HEAD
	loader.load( _head, function( geometry2 ){
		geometry2.center();
		personHead = geometry2.clone();
	});

	// TOILET
	loader.load( _toilet, function( geometry3 ){
		personToilet = geometry3.clone();

		loadModelBathroomsV2( "models/bathroom/b_door.js",
							  "models/bathroom/b_sides.js",
							  "models/bathroom/b_floor.js",
							  "models/bathroom/b_smallStuff.js",
							  "models/bathroom/b_smallWhite.js",
							  "models/bathroom/paper_bottom.js",
							  "models/bathroom/paper_top.js",
							  "models/bathroom2.js",
							  "models/poster.js" );
	});
}

function loadModelBathroom( _geo ){
	loader = new THREE.JSONLoader();

	loader.load( _geo, function( geometry ){
		bathroomGeo = geometry.clone();
		bathroom = new THREE.Mesh(bathroomGeo, bathroomMat);
		bathroom.scale.set(1.5,1.5,1.5);
		bathroom.rotation.y += Math.PI;
	});
}

function loadModelBathrooms( _w, _g, _y, _t ){
	loader = new THREE.JSONLoader();
	bathroom = new THREE.Object3D();
	var br;

	loader.load( _w, function( geometry1 ){
		// br = new THREE.Mesh(geometry1, new THREE.MeshLambertMaterial({color: 0xcccccc}));
		br = new THREE.Mesh(geometry1, bathroomMat);

		bathroom.add(br);
		// br = new THREE.Mesh(new THREE.PlaneGeometry(14,10,1,1), new THREE.MeshLambertMaterial({color: 0xcccccc}));
		br = new THREE.Mesh(new THREE.PlaneGeometry(14,10,1,1), bathroomMat);
		br.rotation.y = Math.PI;
		br.position.z += 3.3;
		bathroom.add(br);

		loader.load( _g, function( geometry2 ){
			// br = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({color: 0xfffac4}));
			br = new THREE.Mesh(geometry2, bathroomMat);
			bathroom.add(br);

			loader.load( _y, function( geometry3 ){
				// br = new THREE.Mesh(geometry3, new THREE.MeshLambertMaterial({color: 0xffea00}));
				br = new THREE.Mesh(geometry3, bathroomMat);
				bathroom.add(br);

				var tp = toilet_paper.clone();
				tp.scale.set(0.5,0.5,0.5);
				tp.rotation.y = -Math.PI/2;
				//3.3,-1,0
				var tp2 = tp.clone();
				tp.position.set(3.1,-1.5,-3.5);
				//3.3,-1,1.5
				tp2.position.set(3.1,-1.5,-2);
				bathroom.add(tp);
				bathroom.add(tp2);

				// intestine
				loader.load( _t, function( geometry4 ){
					// 0xf7c0c1
					// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({color: 0xff265d, side: THREE.DoubleSide}));
					// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({map: bathroomTex, side: THREE.DoubleSide}));

					// geometry4.faceVertexUvs[ 1 ] = geometry4.faceVertexUvs[ 0 ];

					br = new THREE.Mesh(geometry4, intestineMat);

					bathroom.add(br);
					bathroom.scale.set(1.5,1.5,1.5);

					// LIGHT!
						bathroomLight = new THREE.Object3D();

						geo = new THREE.TetrahedronGeometry(1.5);
						mat = new THREE.MeshLambertMaterial({color: 0xfffac4});
						var meshTemp = new THREE.Mesh( geo, mat );
						meshTemp.rotation.x = -35 * Math.PI/180;
						meshTemp.rotation.z = 30 * Math.PI/180;
						meshTemp.position.y = -29.;
						bathroomLight.add(meshTemp);

						geo = new THREE.BoxGeometry(0.2,30,0.2);
						transY(geo, -14);	// -14.5
						meshTemp = new THREE.Mesh(geo, mat);
						bathroomLight.add(meshTemp);

						light = new THREE.PointLight(0xffff00, 1, 50);
						textureLoader = new THREE.TextureLoader();
						glowTexture = textureLoader.load( "images/glow_edit.png" );
						mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
						meshTemp = new THREE.Sprite(mat);
						meshTemp.scale.set(2,2,2);	//big
						light.add(meshTemp);
						light.position.y = -30;
						bathroomLight.add(light);

						bathroomLight.position.set(0,35,-5);

						bathroom.add(bathroomLight);

					scene.add(bathroom);
				});
			});
		});	
	});
}

function loadModelBathroomsV2( _door, _side, _floor, _s, s_white, p_b, p_t, _t, _pst ){
	loader = new THREE.JSONLoader();
	bathroom = new THREE.Object3D();
	bathroom_stuff = new THREE.Object3D();

	var br;
	var whiteMat = new THREE.MeshLambertMaterial({color: 0xcccccc});

	// loader.load( s_white, function( geometry1 ){
	// 	br = new THREE.Mesh(geometry1, whiteMat);
	// 	bathroom_stuff.add(br);

		// back panel
		br = new THREE.Mesh(new THREE.PlaneGeometry(14,10,1,1), whiteMat);
		br.rotation.y = Math.PI;
		br.position.z += 3.3;
		bathroom_stuff.add(br);

		loader.load( _door, function( geometry2 ){
			br = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({map: doorTex}));
			// br = new THREE.Mesh(geometry2, bathroomMat);
			bathroom_stuff.add(br);

			loader.load( _side, function( geometry4 ){
				br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({map: graffitiTex}));	//0xfffac4
				// br = new THREE.Mesh(geometry4, bathroomMat);
				bathroom_stuff.add(br);

				loader.load( _floor, function( geometry5 ){
					br = new THREE.Mesh(geometry5, new THREE.MeshLambertMaterial({map: floorTex}));	//0xfffac4
					// br = new THREE.Mesh(geometry4, bathroomMat);
					bathroom_stuff.add(br);

					// small stuff
					loader.load( _s, function( geometry3 ){
						br = new THREE.Mesh(geometry3, new THREE.MeshLambertMaterial({color: 0xffea00}));
						// br = new THREE.Mesh(geometry3, bathroomMat);
						bathroom_stuff.add(br);

						var tp = toilet_paper.clone();
						tp.scale.set(0.5,0.5,0.5);
						tp.rotation.y = -Math.PI/2;
						//3.3,-1,0
						var tp2 = tp.clone();
						tp.position.set(3.1,-1.5,-3.5);
						//3.3,-1,1.5
						tp2.position.set(3.1,-1.5,-2);
						bathroom_stuff.add(tp);
						bathroom_stuff.add(tp2);

						var fakeT = new THREE.Mesh( personToilet, toiletMat );
						fakeT.scale.set(3,3,3);
						fakeT.rotation.y = Math.PI;
						var ft = fakeT.clone();
						ft.position.set(6.5,0,0);
						bathroom_stuff.add(ft);
						ft = fakeT.clone();
						ft.position.set(-6.5,0,0);
						bathroom_stuff.add(ft);

						// intestine
						loader.load( _t, function( geometry4 ){
							// 0xf7c0c1
							// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({color: 0xff265d, side: THREE.DoubleSide}));
							// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({map: bathroomTex, side: THREE.DoubleSide}));

							geometry4.faceVertexUvs[ 1 ] = geometry4.faceVertexUvs[ 0 ];

							br = new THREE.Mesh(geometry4, intestineMat);

							bathroom_stuff.add(br);

							bathroom.add(bathroom_stuff);
							bathroom.scale.set(1.5,1.5,1.5);

							// LIGHT!
								bathroomLight = new THREE.Object3D();

								geo = new THREE.TetrahedronGeometry(1.5);
								mat = new THREE.MeshLambertMaterial({color: 0xfffac4});
								var meshTemp = new THREE.Mesh( geo, mat );
								meshTemp.rotation.x = -35 * Math.PI/180;
								meshTemp.rotation.z = 30 * Math.PI/180;
								meshTemp.position.y = -29.;
								bathroomLight.add(meshTemp);

								geo = new THREE.BoxGeometry(0.2,30,0.2);
								transY(geo, -14);	// -14.5
								meshTemp = new THREE.Mesh(geo, mat);
								bathroomLight.add(meshTemp);

								light = new THREE.PointLight(0xffff00, 1, 50);
								textureLoader = new THREE.TextureLoader();
								glowTexture = textureLoader.load( "images/glow_edit.png" );
								mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
								meshTemp = new THREE.Sprite(mat);
								meshTemp.scale.set(2,2,2);	//big
								light.add(meshTemp);
								light.position.y = -30;
								bathroomLight.add(light);

								bathroomLight.position.set(0,35,-5);

								bathroom.add(bathroomLight);

							loader.load( _pst, function( geometry6 ){
								var poster = new THREE.Mesh( geometry6, posterMat );
								bathroom.add(poster);

								scene.add(bathroom);

								// loadingCount();
								loadingCountText("bathroomsss");
							});
						});
					});
				});
			});
		});	
	// });
}

function loadModelPoop( _poop ){
	loader = new THREE.JSONLoader();
	var poopStickGeo = new THREE.BoxGeometry(0.1,1,0.1);
	transY(poopStickGeo, 0.5);
	var poopStick = new THREE.Mesh( poopStickGeo, new THREE.MeshBasicMaterial({color: 0x000000}) );
	
	// BODY
	loader.load( _poop, function( geometry ){
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
}

function loadModelPoopMacaron( _poop ){
	loader = new THREE.JSONLoader();
	
	loader.load( _poop, function( geometry ){
		poopMGeo = geometry.clone();
		poopMGeo.computeBoundingSphere();

		poopM = new THREE.Mesh(poopMGeo, poopMMat);

		// loadingCount();
		loadingCountText("poop macaron");
	});
}

function loadModelPoopHeart( _poopH ){
	loader = new THREE.JSONLoader();
	
	loader.load( _poopH, function( geometry ){
		poopHeartGeo = geometry.clone();
		poopHeartGeo.computeBoundingSphere();

		poopHeart = new THREE.Mesh(poopHeartGeo, poopHeartMat);

		// loadingCount();
		loadingCountText("poop heart");
	});
}

var pBody, pLA, pRA, pHead, pScreen, pMat, pColor, pToilet;

// removed. saved in old script
// function createPlayer( _pos, _video, _color, _id, _peerid ){
// ...
// }

// removed. saved in old script
// function createSimplePlayer( _pos, _color, _id ){
// ...
// }

// removed. saved in old script
// function createSitPlayer( _pos, _color, _id ){
// ...
// }

// web audio api
function finishedLoading(bufferList){

	for(var i=0; i<bufferList.length; i++){
		var s = audioContext.createBufferSource();
		audioSources.push(s);

		var g = audioContext.createGain();
		gainNodes.push(g);

		audioSources[i].buffer = bufferList[i];
		audioSources[i].loop = true;
		audioSources[i].connect(gainNodes[i]);
		gainNodes[i].connect(audioContext.destination);
		
		audioSources[i].start(0);
	}
	gainNodes[0].gain.value = .5;
	gainNodes[1].gain.value = 0.2;
	gainNodes[2].gain.value = 0;	// stomach
	gainNodes[3].gain.value = 1;	// soothing

	audioAllLoaded = true;
}

// v.1
// function animate() 
// {
//     requestAnimationFrame( animate );				//http://creativejs.com/resources/requestanimationframe/
// 	update();
// 	render();		
// }

// v.2
// Request animation frame loop function
var lastRender = 0;

function animate(timestamp) {
	if(!isAllOver){
		var delta = Math.min(timestamp - lastRender, 500);
		lastRender = timestamp;

		update();
		
		// Render the scene through the manager.
		vrmanager.render(scene, camera, timestamp);
		// stats.update();
	}

	requestAnimationFrame(animate);
}


function update()
{	

	// WEB_CAM - removed. saved in old script.

	TWEEN.update();
	controls.update( Date.now() - time );
	var dt = clock.getDelta();

	if(particleGroup && !inScCelebration)
		particleGroup.tick( dt );

	// scene.simulate();
	scene.simulate( undefined, 2 );

	// physics_stats.update();

	// TRIS!!!
		/*
		for(var i=0; i<tanWaves.length; i++){
			tanWRun[i] = 0.03 * tanWaves[i].run();
		}
		for(var i=0; i<tris.length; i++){
			tris[i].rotation.y = tanWRun[ tris[i].tanWIndex ] + Math.PI/3;
			tris[i].rotation.z = tanWRun[ tris[i].tanWIndex ];
		}
		*/

	// PERSON_ANIMATION
		// if(person){
		// 	person.update(null);
		// 	person.switchAni();
		// }

		// if player > 5, visible = true
		if( !personsAppeared && showAniPpl){
			for(var i=0; i<persons.length; i++){
				persons[i].body.visible = true;
			}
			personsAppeared = true;
		}

		// if player > 5 + poopheart > 5, animation
		if( personsAppeared && poopHeartFromMeCount>5 && !personsAnied ){
			personAniInterval = setInterval(function(){
				for (var i = 0; i < persons.length; i++) {
					persons[i].changeAni( personAniSequence[personAniIntervalCounter%4] );
				};
				personAniIntervalCounter++;
			}, 2000);

			personsAnied = true;
		}
		
		// if player fullhouse, walk!!
		if(fullhouse && personsAnied){

			if(!personsWalked){
				for (var i = 0; i < persons.length; i++) {
					persons[i].changeAni(0);
				};
				clearInterval( personAniInterval );
				personsWalked = true;
			}
			RandomWalking();
		}

		if(personsAnied && persons.length>=3){
			for(var i=0; i<persons.length; i++){
				persons[i].update(null);
				persons[i].switchAni();
			}
		}

	// if player>=3, poop>50 + heart>30 to celebrate
	if(strictToCele){
		if( final_statistic.totalPoop>50 && final_statistic.totalHeart>30 ){
			EnterSceneCelebrate();
		}
	}
	// if player<3, poop>30 to celebrate
	else {
		if( final_statistic.totalPoop>30 ){
			EnterSceneCelebrate();
		}
	}
	
	if(waterwave.body){
		waterwave.update(null);
	}
	// if(waterwave.body.morphTargetInfluences.length>0){
	// 	waterwave.update(null);
	// }

	// STAR
	if(starAnimators.length>0){
		for(var i=0; i<starAnimators.length; i++){
			starAnimators[i].updateLaura( 300*dt );
		}
	}
	
	// windowAnimator.updateLaura( 300*dt );
	if(intestineAnimator)
		intestineAnimator.updateLaura( 300*dt );
	// intestinesAnimator.updateLaura( 300*dt );


	// POOP_TALK
	// v.1
	/*
	if ( (controls.neckAngle.x<1.58 && controls.neckAngle.x>0) && !poopIsTalking) {
		sample.trigger(0,1);
		new TWEEN.Tween(firstGuy.player.children[0].children[0].children[1].rotation)
			.to({z: 1}, 100)
			.repeat(3)
			.yoyo(true)
			.start();

		setTimeout(function(){
			poopIsTalking = false;

		}, 6000);

		poopIsTalking = true;
	};
	*/
	// v.2
	if ( lookAtMiniPoop && !poopIsTalking) {
		sample.trigger(poopTalkCount%4,1);
		poopTalkCount ++;
		new TWEEN.Tween(firstGuy.player.children[0].children[0].children[1].rotation)
			.to({z: 1}, 100)
			.repeat(3)
			.yoyo(true)
			.start();

		setTimeout(function(){
			poopIsTalking = false;

		}, 4000);

		poopIsTalking = true;
	};


	// eyeRay!
		var directionCam = controls.getDirection(1).clone();
		eyerayCaster.set( controls.position().clone(), directionCam );
		eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if( eyeIntersects.length > 0 ){
			var iName = eyeIntersects[ 0 ].object.name;
			iName = iName.split(" ");
			// console.log(eyeIntersects[ 0 ].object);

			if(iName.length==2){
				lookingAtSomeone = iName[0];
			} else {
				lookingAtSomeone = -1;
			}

			// var vector = new THREE.Vector3();
			// v1
			// vector.setFromMatrixPosition( eyeIntersects[ 0 ].object.matrixWorld );

			// v2
			// vector.copy( eyeIntersects[ 0 ].point );

			// lookDummy.position.copy( vector );

			// vTest
			// eyeIntersects[ 0 ].object.material.color = new THREE.Color(0,1,0);

			if ( eyeIntersects[ 0 ].object == flushHandler ){
				lookAtFlush = true;
				flushHandler.material.color = new THREE.Color(0,1,0);
				exitTexture.clear('white').drawText("EXIT", undefined, 220, 'green');

				flushColorChanged = true;
			} else {
				lookAtFlush = false;
				flushHandler.material.color = new THREE.Color(1,0,0);
				exitTexture.clear('white').drawText("EXIT", undefined, 220, 'red');

				flushColorChanged = false;
			}

			if ( eyeIntersects.length > 1 ) {

				// console.log(eyeIntersects[ 0 ].object);

				// eyeIntersects[ 0 ].object.parent.updateMatrixWorld();
				// var vector = new THREE.Vector3();
				// vector.setFromMatrixPosition( eyeIntersects[ 0 ].object.matrixWorld );
				// lookDummy.position.copy(vector);

				if(eyeIntersects[ 1 ].object.name == "miniPoop"){
					// console.log("See mini poop!");
					lookAtMiniPoop = true;
				} else {
					lookAtMiniPoop = false;
				}
			}
		} else {
			lookingAtSomeone = -1;

			if(flushColorChanged){
				flushHandler.material.color = new THREE.Color(1,0,0);
				exitTexture.clear('white').drawText("EXIT", undefined, 220, 'red');
				// console.log("change handle color back!");
				flushColorChanged = false;
			}
		}		

	// Bathroom Light!
	bathroom.children[1].rotation.z = sinWave.run()/2;

	//
	time = Date.now();
}

function render() 
{	
	effect.render(scene, camera);
	// stats.update();
}

function changeAni ( aniIndex ) {

	animOffset = animOffsetSet[ aniIndex ];
	keyframe = animOffsetSet[ aniIndex ];
	currentKeyframe = keyframe;
	keyduration = keyframeSet[ aniIndex ];
	aniStep = 0;
}

// removed. saved in old script
// function updatePlayer(playerIndex, playerLocX, playerLocZ, playerRotY, playerQ){
// // ...
// }

function removePlayer(playerID){
	// var goneIndex=-1;
	// for(var i=0; i<dailyLifePlayerDict.length; i++){
	// 	if(dailyLifePlayerDict[i].whoIam == playerID){
	// 		goneIndex = i;
	// 		break;
	// 	}
	// }
	// dailyLifePlayers.splice(goneIndex,1);
	// dailyLifeMurmurs.splice(goneIndex,1);
	if(dailyLifePlayerDict[playerID]){
		scene.remove( dailyLifePlayerDict[playerID].player );
		//
		delete dailyLifePlayerDict[playerID];
	}
}

function startSpeech(event) {
	if(recognizing){
		// console.log("final_script: " + final_script);
		recognition.stop();
		console.log("recognition stops");
		return;
	}

	// start / restart
		recognition.start();
		console.log("recognition starts");
}

function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}

function PlayAudios() {
	if(audiosArePlayed) return;

	if(!initSound){

		/////////////////////////////
		//    OFFICIAL START!!!    //
		/////////////////////////////
		sound_bathroom.play();
		sound_opening.play();
		sound_fire.play();
		sound_forest.play();

		initSound = true;		
	}

	audiosArePlayed = true;

	setTimeout(function(){
		// Light exchanges!
		new TWEEN.Tween( bathroom.children[1].children[2] )
		.to( {intensity: 0}, 1000 )
		.start();

		new TWEEN.Tween( hemiLight )
		.to( {intensity: 1}, 1000 )
		.start();
	}, 10000);
}

function EnterSceneTwo_v2() {

	new TWEEN.Tween( bathroom.position )
	.to( controls.getOutBathroomPosition, 7500 )
	.easing( TWEEN.Easing.Cubic.InOut )
	.start();

	setTimeout(function(){	

		controls.setMovYAnimation( -181.8, 11000 );
		//
		firstGuy.player.children[0].visible = false;

		switchSound_1 = true;
		sound_stomach.fadeIn(1,6000);
		sound_bathroom.fadeOut(0,8000);

		//
		for(var i=0; i<stars.length; i++){
			stars[i].position.y -= 200;
		}

		// disappear the bathroom
		setTimeout(function(){
			bathroom.visible = false;
			UpdatePplCount( Object.keys(dailyLifePlayerDict).length, totalPplInWorldsCount, totalVisitCount );
		}, 16000);

		// bring the body back
		setTimeout(function(){
			firstGuy.player.children[0].visible = true;

			// able to move around and shoot
			controls.movingEnabled = true;
			controls.clickingTouchingEnabled = true;

			sound_meditation.play();
		}, 11000);

	}, 8500);
}

function EnterSceneTwo() {
	if(inScMeditation) return;

	if(!initSound){

		/////////////////////////////
		//    OFFICIAL START!!!    //
		/////////////////////////////
		sound_bathroom.play();
		sound_fire.play();
		sound_forest.play();

		initSound = true;		
	}

	setTimeout(function(){
		// v2_move tube
		new TWEEN.Tween( bathroom.position )
		.to( controls.getOutBathroomPosition, 7500 )
		.easing( TWEEN.Easing.Cubic.InOut )
		.delay( 2000 )
		.start();
		//
		// firstGuy.wordTexture.clear();

		// Light exchanges!
		new TWEEN.Tween( bathroom.children[1].children[2] )
		.to( {intensity: 0}, 1000 )
		.start();

		new TWEEN.Tween( hemiLight )
		.to( {intensity: 1}, 1000 )
		.start();

		// disappear pooptowers
		for (var i = 0; i < poopTowers.length; i++) {
			poopTowers[i].visible = false;
		};

		setTimeout(function(){	

			controls.setMovYAnimation( -181.8, 11000 );
			//
			firstGuy.player.children[0].visible = false;

			switchSound_1 = true;
			sound_stomach.fadeIn(1,6000);
			sound_bathroom.fadeOut(0,8000);

			//
			for(var i=0; i<stars.length; i++){
				stars[i].position.y -= 200;
			}

			// disappear the bathroom
			setTimeout(function(){
				bathroom.visible = false;
			}, 16000);

			// bring the body back
			setTimeout(function(){
				firstGuy.player.children[0].visible = true;

				// able to move around and shoot
				controls.movingEnabled = true;
				controls.clickingTouchingEnabled = true;
			}, 11000);

		}, 10500);

	}, 6*1000);

	inScMeditation = true;
}

function EnterSceneCelebrate() {
	if(inScCelebration) return;
	inScCelebration = true;

	sound_meditation.fadeOut(0,2000);
	sound_poop.play();

	var hackIndex=0;
	var hackIndex2=0;

	// PORTALS animation
	for(var i=0; i<portals.length; i++){
		portals[i].visible = true;
		portalLights[i].visible = true;

		new TWEEN.Tween(portals[i].scale)
			.to({x:1,y:1,z:1}, 1000)
			.onComplete(function(){
				doPortalAni( hackIndex );	//!!!
				hackIndex++;
			})
			.start();		

		new TWEEN.Tween(portalLights[i].scale)
			.to({x:1,y:1,z:1}, 1000)
			.start();
	}

	for(var i=0; i<poopTowers.length; i++){
		poopTowers[i].position.y = portals[0].position.y-25*i;
		poopTowers[i].visible = true;

		new TWEEN.Tween(poopTowers[i].scale)
			.to({x:1,y:1,z:1}, 1000)
			.start();
	}

	// Init portal poop animation!
	portalPoopAnimation = setInterval(function(){
		// portals height: 100
		for(var i=0; i<poopTowers.length; i++){

			if(poopTowers[i].position.y < -125){
				poopTowers[i].position.y = 100;
				poopTowers[i].scale.y=0.01;

				new TWEEN.Tween(poopTowers[i].scale)
					.to({y:1}, 1000)
					.start();
			}

			new TWEEN.Tween(poopTowers[i].position)
				.to({x: poopTowers[i].position.x,
					 y: poopTowers[i].position.y-25,
					 z: poopTowers[i].position.z}, 1000)
				.easing( TWEEN.Easing.Elastic.InOut )
				.start();
		}
	}, 2000);

	InitParticles();	

	// miniPoop out!
		firstGuy.player.children[0].children[0].rotation.x = Math.PI/8;
		firstGuy.player.children[0].children[0].children[0].rotation.z = -0.5;
		firstGuy.player.children[0].children[0].children[1].rotation.z = 0.5;

		var miniWaveTween1 = new TWEEN.Tween(firstGuy.player.children[0].children[0].children[1].rotation)
							.to({z:1.5}, 100)
							.repeat(7)
							.yoyo(true);

		var miniOutTween = new TWEEN.Tween(firstGuy.player.children[0].children[0].position)
							.to({x:0, y:-0.5, z:1.5}, 2000)
							.easing( TWEEN.Easing.Elastic.InOut )
							.onComplete(function(){
								// say something
								sample.trigger( 13, 1 );
							});

		var miniWaveTween2 = new TWEEN.Tween(firstGuy.player.children[0].children[0].children[0].rotation)
							.to({z:-1.5}, 100)
							.repeat(7)
							.yoyo(true)
							.onComplete(function(){
								miniShrinkTween.start();
							});
		
		var miniShrinkTween = new TWEEN.Tween(firstGuy.player.children[0].children[0].scale)
							.to({x:0.01,y:0.01,z:0.01}, 1000)
							.delay(5000)
							.easing( TWEEN.Easing.Elastic.InOut )
							.onComplete(function(){
								firstGuy.player.children[0].children[0].visible = false;
							});

		miniOutTween.chain(miniWaveTween1, miniWaveTween2);
		miniOutTween.start();

}

function doPortalAni( index ){
	new TWEEN.Tween(portals[index].scale)
		.to({x:0.7,y:0.7,z:0.7}, 1000)
		.repeat(Infinity)
		.yoyo(true)
		.start();
}

var ppWalking = false;

function RandomWalking() {

	for(var i=0; i<persons.length; i++){

		if( !personIsWalking[i] ){

			var randomDestination = new THREE.Vector3(Math.random()*70-35, Math.random()*10+toiletCenters[0].y+5, -5+Math.random()*70-35);
			var oldPos = persons[i].body.position;
			var tDist = oldPos.distanceTo(randomDestination);

			// rotation!
				var cc = new THREE.Vector2( randomDestination.x - oldPos.x, randomDestination.z - oldPos.z );
				var dd = new THREE.Vector2( 0, 1 );

				var angleDesToMe = Math.acos( cc.dot(dd)/cc.length() ) * 180 / Math.PI;
				if(cc.x<0){
					angleDesToMe *= -1;
					angleDesToMe += 360;
				}

			new TWEEN.Tween(persons[i].body.position).to({x: randomDestination.x, z: randomDestination.z}, tDist*80).start();
			new TWEEN.Tween(persons[i].body.rotation).to({y: angleDesToMe*Math.PI/180}, 400).easing( TWEEN.Easing.Back.In).start();

			personIsWalking[i] = true;

			ResetWalkingStatus( i, tDist*160+2500+2000 );
		}
	}		
	// ppWalking = true;

	// personWalkTimeoutID = setTimeout(function(){
	// 	ppWalking = false;
	// }, tDist*80+2500+2000);
}

function ResetWalkingStatus(index, time) {
	setTimeout(function(){
		personIsWalking[index] = false;
	}, time);
}

function EnterSceneEnd() {

	if(inScEnd) return;

	// stop the celebration
	clearInterval( portalPoopAnimation );

	// to-do
	// remove particles
	// remove all physijs poop


	//
	var waterPos = new THREE.Vector3();
	waterPos.copy( toiletCenters[0] );
	waterPos.y = -10;
	controls.createTweenForMove( waterPos, 5000 );

	setTimeout(function(){
		var newPos = {};
		newPos.x = [0,0,0,0,0,0,0];
		newPos.y = [-16,-16,-16,-22,-23,-36.5,-50];
		newPos.z = [0,-6.5,-13,-10,-1,-1,-1];
		controls.createTweenForMove( newPos, 21000 );	// to-do: set duration dynamically
		//
		firstGuy.player.children[0].visible = false;

		// if haven't mute the meditation yet in Celebration Scene
		if(!inScCelebration)
			sound_meditation.fadeOut(0,2000);

		setTimeout(function(){

			new TWEEN.Tween( bathroom.rotation )
				.to( {y:0}, 2000 )
				.easing(TWEEN.Easing.Back.InOut)
				.onComplete(function(){
					bringBackSplashPage();
				})
				.start();
			//
			firstGuy.player.children[0].visible = true;

		},21000);

		// exchange tube
		new TWEEN.Tween(bigToiletTubeNorm.material)
			.to( {opacity: 0.0}, 4000 )
			.onComplete(function(){
				bigToiletTubeNorm.visible = false;
			}).start();

		bigToiletTubeAni.visible = true;
		new TWEEN.Tween(bigToiletTubeAni.material)
			.to( {opacity: 1.0}, 4000 )
			.start();

		// Light exchanges!
		new TWEEN.Tween( bathroom.children[1].children[2] )
		.to( {intensity: 1}, 2000 )
		.start();

		new TWEEN.Tween( hemiLight )
		.to( {intensity: 0}, 2000 )
		.start();

	}, 8000);

	setTimeout(function(){
		bathroom.visible = true;
		bathroom.position.set(0,-50,0);
		bathroom.rotation.y += Math.PI;
	}, 20000);

	// Remove something
	// console.log( firstGuy.player.children[0] );
	THREE.SceneUtils.detach( firstGuy.player.children[0].children[1],
							 firstGuy.player.children[0],
							 scene );
	scene.remove( firstGuy.player.children[0] );
	console.log("remove word bubble!");

	inScEnd = true;
}

function bringBackSplashPage() {

	createFinalStatistic();

	setTimeout(function(){

		renderCanvas.style.opacity = 0;

		setTimeout(function(){
			renderCanvas.style.display = "none";
			if(blockerDiv) blockerDiv.style.display = "none";
			splashPage.style.display = "";
			splashPage.style.position = "";
			splashPage.style.minHeight = "800px";

			console.log( final_statistic );

			isAllOver = true;
		}, 2000);

	}, 5000);
}

function createFinalStatistic() {
	loadingImg.style.display = "none";
	playerNameInput.style.display = "none";
	startLink.style.display = "none";
	finalBG.style.display = "block";

	if(isMobile)
		finalBG.style.width = "90%";

	var stayTime = Math.floor(clock.elapsedTime);
	var stayTimeMin = Math.floor(stayTime/60);
	var stayTimeSec = Math.floor(stayTime%60);

	// Print out final statistic!
	finalStat.innerHTML = "Congrats, ";
	finalStat.innerHTML += final_statistic.playerName + ", for getting out your poop!<br>";
	finalStat.innerHTML += "All the poops here thank you for your efforts to release them into the world.<br><br>";
	finalStat.innerHTML += "You have been in Daily Life Bathroom for " + stayTimeMin + " minutes and " + stayTimeSec + " seconds long,<br>";
	finalStat.innerHTML += "pooping with " + final_statistic.pooperCount + " people,<br>";
	finalStat.innerHTML += "in a communal bathroom which has been visited by " + final_statistic.totalVisit + " people.<br><br>";
	finalStat.innerHTML += "There were a total of " + final_statistic.totalPoop + " poops were generated while you were in the bathroom,<br>";
	finalStat.innerHTML += "and you contributed " + final_statistic.youPoop + " of them.<br><br>";

	if(Object.keys(final_statistic.meToOthers).length>0){
		finalStat.innerHTML += "You shot out Poop Heart to:<br>";
		for(var key in final_statistic.meToOthers){
			// skip loop if the property is from prototype
	   		if (!final_statistic.meToOthers.hasOwnProperty(key)) continue;

			finalStat.innerHTML += "       " + key + " * " + final_statistic.meToOthers[key] + ".<br>";
		}
	}

	if(Object.keys(final_statistic.othersToMe).length>0){
		finalStat.innerHTML += "<br>You also received Poop Heart from:<br>";
		for(var key in final_statistic.othersToMe){
			// skip loop if the property is from prototype
	   		if (!final_statistic.othersToMe.hasOwnProperty(key)) continue;

			finalStat.innerHTML += "       " + key + " * " + final_statistic.othersToMe[key] + ".<br>";
		}
		finalStat.innerHTML += "<br>How sweet!<br><br>";
	}

	finalStat.innerHTML += "Hope you enjoy the pooping experience in Daily Life Bathroom.<br>";
	finalStat.innerHTML += "Feel free to poop again, and sign up for updates about forthcoming chapters of Daily Life VR.<br><br>";
	finalStat.innerHTML += "Yours truly,<br><a href='http://www.jhclaura.com' target='_blank'>Laura Chen</a> and <a href='http://uselesspress.org/' target='_blank'>Useless Press</a>.<br><br><br>";

	// bring back scrolling function
	document.body.removeEventListener('touchmove', noScrolling, false);
	// scrollable
	document.body.style.overflow = "auto";

	// remove pointerlock (if existed)
	if(blockerDiv){
		instructions.removeEventListener( 'click', funToCall, false );
		blocker.style.display = 'none';

		document.removeEventListener( 'pointerlockchange', pointerlockchange, false );
		document.removeEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.removeEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.removeEventListener( 'pointerlockerror', pointerlockerror, false );
		document.removeEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.removeEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	}
	aboutPage.style.display = "block";

	//
	myDataRef.push(final_statistic);
}

function UpdatePplCount( thisWorldCount, totalCount, totalVisit ) {
	if(bathroom.visible) return;

	pplCountTex.clear().drawText("Pooper", undefined, 100, 'white');
	pplCountTex.drawText("Counter", undefined, 250, 'white');
	pplCountTex.drawText("this world: " + thisWorldCount, undefined, 400, 'white');
	pplCountTex.drawText("current: " + totalCount, undefined, 550, 'white');
	pplCountTex.drawText("visited: " + totalVisit, undefined, 700, 'white');
}

function onWindowResize() {
	effect.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}

function loadingCount() {
	loadedCount ++;

	if(loadedCount>=8) {
		// hide the loading gif and display start link
		startLink.style.display = "";
		loadingImg.style.display = "none";
		loadingTxt.style.display = "none";
		readyToStart = true;
	}
}

function loadingCountText( item ) {
	console.log( "loaded " + item );
	loadedCount ++;

	if(loadedCount>=8) {
		// hide the loading gif and display start link
		startLink.style.display = "";
		loadingImg.style.display = "none";
		loadingTxt.style.display = "none";
		readyToStart = true;
	}
}
