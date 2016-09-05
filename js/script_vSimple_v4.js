/*
 * Made by @jhclaura (Laura Chen, jhclaura.com)
 */

// PointerLockControls
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
	var element = document.body;
	var pointerControls, dateTime = Date.now();
	var objects = [];
	var rays = [];
	var blocker, instructions;

	var havePointerLock = 
				'pointerLockElement' in document || 
				'mozPointerLockElement' in document || 
				'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		// console.log("havePointerLock");
		blocker = document.getElementById('blocker');
		instructions = document.getElementById('instructions');

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				console.log("enable pointerControls");

				controls.enabled = true;
				blocker.style.display = 'none';

			} else {

				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';
			}
		}

		var pointerlockerror = function(event){
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );


		if(isMobile) {
			console.log("isTouchDevice");
			// instructions.addEventListener( 'touchend', funToCall, false );
		} else {
			instructions.addEventListener( 'click', funToCall, false );
		}

	} else {
		//instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
		
	}

	function funToCall(event){

		console.log("click or touch!");
		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		controls.enabled = true;

		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			}
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}

////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect, stats;
var light,controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;

var myStartX = 0, myStartZ = 0, myStartY = 180; //2
var myPosition, myStartRotY;

var model, texture;
var dummy;
var perlin = new ImprovedNoise(), noiseQuality = 1;

// WAVE
	var timeWs = [0, Math.PI/2, Math.PI, -Math.PI/2, Math.PI+0.3, -Math.PI/5, Math.PI/1.1];
	var frequencyWs = [0.02, 0.01];
	var frequencyW = 0.02, amplitudeW = 0.1, offsetW = 0;
	var sinWaves = [], cosWaves = [], tanWaves = [], spin;
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
	var player, playerBody, playerHead;
	var firstPlayer, secondPlayer;
	var firstGuy, firstGuyBody, firstGuyHead, secondGuy, secondGuyBody, secondGuyHead;
	var QforBodyRotation;
	var fGuyHandHigh = false, sGuyHandHigh = false;
	var bodyGeo;
	var dailyLifeME, colorME, dailyLifePlayers = [];
	var dailyLifePlayerDict = {};

	var person, personGeo, personMat, toiletMat;
	var persons = [], personCircle;
	var poop, poopGeo, poopTex, poopMat, poopHat, poopHeartTex;
	var poopM, poopMGeo, poopMTex, poopMMat, poopHeartGeo, poopHeartMat, poopHeart;
	var personBody, personHead, personToilet;
	var keyframe, lastKeyframe, currentKeyframe;
	var animOffset = 1, keyduration = 28;
	var aniStep = 0, aniTime = 0, slowAni = 0.4;
	var personKeyframeSet =   [ 28, 15,  1,  8,  1, 12, 10 ];
	var personAniOffsetSet = [  1, 30, 48, 50, 58, 60, 72 ];	//2: sit freeze; 4: push freeze
	var personFreeze = false;

// TOILET_RELATED
	var t_paper0, t_paper1, t_paper2, toilet_paper;
	var bigToilet, bigToiletGeo, waterwave, waterwaveTex;
	var waterSpeed, waterKeyframeSet=[17], waterAniOffsetSet=[1];
	var aniStepW=0, aniTimeW=0, slowAniW=0.3, keydurationW = 17;
	var keyframeW, animOffsetW=1, currentKeyframeW=0, lastKeyframeW=0;
	var bathroomGeo, bathroomTex, bathroomMat, intestineMat;
	var toiletCenters = [], myWorldCenter;
	var meInSGroup, meInBGroup, meInWorld;
	var poopIsTalking = false, lookAtMiniPoop = false;
	var poopCount = 0;

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

	var sound_fire, sound_bathroom, sound_stomach, sound_forest, sound_poop, sound_meditation;
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

// TRANSITION
	var initTime, meditationTime, celebrationTime, endTime;
	var descendTween;

////////////////////////////////////////////////////////////

// init();		// Init after CONNECTION
// superInit();	// init automatically

connectSocket();

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){

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
		meInWorld = Math.floor(whoIamInLife/18);			// which world
		meInBGroup = Math.floor(whoIamInLife/18) % 3;		// which toilet
		meInSGroup = ( whoIamInLife%18 )%18;					// which on a toilet
		myStartX = Math.sin(Math.PI*2/18*meInSGroup)*18;
		myStartZ = Math.cos(Math.PI*2/18*meInSGroup)*18;

		myWorldCenter = toiletCenters[meInBGroup].clone();
		myWorldCenter.y = myStartY;

		// Math.sin(Math.PI*2/6*i)*18, 0, Math.cos(Math.PI*2/6*i)*18
		myPosition = new THREE.Vector3( myStartX, myStartY, myStartZ );
		// myPosition.set( Math.sin(Math.PI*2/6*meInSGroup)*18, 150, Math.cos(Math.PI*2/6*meInSGroup)*18 );
		console.log("Me in Group: " + meInBGroup + ", seat: " + meInSGroup);

	//Prevent scrolling for Mobile
	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false);

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
			volume: 0.5
		});

		sound_fire = new Howl({
			urls: ['../audios/duet/firecrack.mp3'],
			loop: true,
			volume: 0.2
		});

		sound_bathroom = new Howl({
			urls: ['../audios/bathroom.mp3'],
			loop: true,
			volume: 1,
			onend: function() {
				console.log("End of the experience!");
				// Again??
			}
		});

		sound_stomach = new Howl({
			urls: ['../audios/stomach_bg_long.mp3'],
			loop: true,
			volume: 0
		});

		sound_poop = new Howl({
			urls: ['../audios/Mr.Sandman.mp3'],
			loop: true,
			volume: 0,
			onend: function() {
				// end of poop (celebration) -> end
				sound_bathroom.play().fadeIn(1, 2000);
			}
		});

		sound_meditation = new Howl({
			urls: ['../audios/temp_meditation.mp3'],
			loop: true,
			volume: 1,
			onend: function() {
				// once it's over, be able to shoot out poop*3 to enter celebration
				yogaOver = true;
				//sound_poop.play();
			}
		});

	time = Date.now();
	clock = new THREE.Clock();
	clock.start();

	// THREE.JS -------------------------------------------
	// RENDERER
		container = document.getElementById('render-canvas');
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.setClearColor(0xc1ede5, 1);
		container.appendChild(renderer.domElement);

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
		light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
		scene.add(light);

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

	// PLAYERS
		toiletMat = new THREE.MeshLambertMaterial({color: 0xffffff});
		eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);
		// skinTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
		var loader = new THREE.TextureLoader();
		loader.load('images/guyW.png', function(texture){
			skinTexture = texture;
			loadModelPlayer( "models/Guy2/GuyB.js", "models/Guy2/GuyLA.js", "models/Guy2/GuyRA.js", "models/Guy2/GuyH.js" );
			//
			loadSitModelPlayer( "models/personHead.js", "models/personBody.js", "models/toilet.js" );
		});
		loader.load('images/poop.png', function(texture){
			poopTex = texture;
			poopMat = new THREE.MeshLambertMaterial({map: poopTex});
			loadModelPoop( "models/poop.js" );
		});
		loader.load('images/poopHeart.png', function(texture){
			poopHeartTex = texture;
			poopHeartMat = new THREE.MeshLambertMaterial({map: poopHeartTex});
			loadModelPoopHeart( "models/poopHeart.js" );
		});
		loader.load('images/poopMocaronS.png', function(texture){
			poopMTex = texture;
			poopMMat = new THREE.MeshBasicMaterial({map: poopMTex});
			loadModelPoopMacaron( "models/poopMacaron2.js" );
		});

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
		//v2
		var textureLoader = new THREE.TextureLoader();

		intestineMat = new THREE.MeshPhongMaterial({
			color: 0xff265d,
			specular: 0xff265d,
			shininess: 50,
			// map: textureLoader.load( "images/intestine.png" ),
			normalMap: textureLoader.load( "images/812-normal_NRM.png" ),
			// normalScale: new THREE.Vector2( -1, - 1 ),
			specularMap: textureLoader.load( "images/812-normal_SPEC.png" ),
			displacementMap: textureLoader.load("images/812-normal_DISP.png"),
			displacementScale: 3,
			// displacementBias: - 0.428408,
			side: THREE.DoubleSide
		});

		loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/bathroom2.js" );

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
		loader = new THREE.JSONLoader();

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
	
	// big toilet
		loader.load( "models/bigToilet_v2.js", function( geometry ) {
			bigToiletGeo = geometry;
			bigToilet = new THREE.Mesh( bigToiletGeo.clone(), new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
			bigToilet.scale.set(1.5, 1.5, 1.5);
			bigToilet.position.copy( toiletCenters[0]);
			scene.add( bigToilet );

			var dupToilet = new THREE.Mesh( bigToiletGeo.clone(), new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
			dupToilet.scale.set(1.5, 1.5, 1.5);
			dupToilet.position.copy( toiletCenters[1]);
			scene.add( dupToilet );

			var dupToilet = new THREE.Mesh( bigToiletGeo.clone(), new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
			dupToilet.scale.set(1.5, 1.5, 1.5);
			dupToilet.position.copy( toiletCenters[2]);
			scene.add( dupToilet );
		} );

	// wave
		waterwaveTex = new THREE.ImageUtils.loadTexture('images/wave.png');

		//		
		loader.load( "models/waterwave.js", function( geometry ) {
			var waterPos = 	new THREE.Vector3(0,-7,3);
			waterPos.add( toiletCenters[meInBGroup] );

			waterwave = new AniObject( 0.3, waterKeyframeSet, waterAniOffsetSet, geometry,
									   new THREE.MeshBasicMaterial({ map: waterwaveTex, morphTargets: true, transparent: true, opacity: 0.5 }),
									   new THREE.Vector3(0,-12,3), 1.7 );

			/*
			waterwave = new AniObjectPhysijs( 0.3, waterKeyframeSet, waterAniOffsetSet, geometry,
									   water_material,
									   waterPos, 1.7 );*/
		} );

	/*
	// TREE
		treeTexture = THREE.ImageUtils.loadTexture('images/tree.png');
		treeMat = new THREE.MeshLambertMaterial({map: treeTexture});
		
		loader.load( "models/tree.js", function( geometry ){
			treeGeo = geometry.clone();
			var tree;
			for(var i=0; i<50; i++){
				tree = new THREE.Mesh( treeGeo, treeMat );
				tree.position.x = ( Math.random() - 0.5) * 300;
				tree.position.y = ( Math.random() - 0.5) * 300;
				tree.position.z = ( Math.random() - 0.5) * 300;
				// tree.scale.set(7,7,7);

				// // TWEEN
				// new TWEEN.Tween( tree.position )
				// .to( {y: tree.position.y+300}, 700 )
				// .repeat( Infinity )
				// .yoyo (true)
				// .easing( TWEEN.Easing.Cubic.InOut )
				// .start();

				// // TWEEN
				// new TWEEN.Tween( tree.rotation )
				// .to( {x: Math.PI*2}, 700 )
				// .repeat( Infinity )
				// .yoyo (true)
				// .easing( TWEEN.Easing.Cubic.InOut )
				// .start();

				scene.add(tree);
				trees.push(tree);
			}
			var treeCenterMat = new THREE.MeshLambertMaterial({color: 0xffffff});
			tree = new THREE.Mesh( treeGeo, treeCenterMat );
			tree.scale.set(10,10,10);
			scene.add(tree);
		});
	*/

	// WINDOW
		// windowTex = THREE.ImageUtils.loadTexture('images/windowSS.png');
		// windowAnimator = new TextureAnimator( windowTex, 3, 3, 30, 60, [6,6,7,8,3,4,5,0,5,0,5,4,5,4,5,4,5,4,5,4,8,7,6,6,6,6,6,6,6,6] );
		// var windowMat = new THREE.MeshBasicMaterial({map: windowTex});

		// loader.load( "models/windowRing.js", function( geometry ) {
		// 	windowRing = new THREE.Mesh(geometry, windowMat);

		// 	loader.load( "models/window.js", function( geometry ) {
		// 		windowScreen = new THREE.Mesh(geometry, windowMat);
		// 		windowRing.add(windowScreen);
		// 		scene.add(windowRing);
		// 	});
		// });

	// TRI
		// triTex = THREE.ImageUtils.loadTexture('images/tri.png');
		// var triMat = new THREE.MeshBasicMaterial({map: triTex, side: THREE.DoubleSide, transparent: true, opacity: 0.5});
		// loader.load( "models/tri.js", function( geometry ) {

		// 	for(var i=0; i<3; i++){
	 //    		for(var j=0; j<3; j++){
	 //    			for(var k=0; k<3; k++){
	 //    				var tSize = Math.random()*-0.5 + 1;
		// 	    		tri = new THREE.Mesh(geometry, triMat);
		// 	    		tri.position.set(myPosition.x + Math.random()*10-5, myPosition.y + Math.random()*4-2, myPosition.z + Math.random()*10-5);
		// 	    		tri.scale.set(tSize,tSize,tSize);

		// 	    		tri.tanWIndex = getRandomInt(0,6);

		// 	    		tris.push(tri);
		// 	    		scene.add(tri);
		// 	    	}
		//     	}
	 //    	}
		// });

	// PERSON 
		personTex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
		loader.load( "models/person3.js", function( geometry ) {
			personGeo = geometry;
		});

	// STAR
	for(var i=0; i<starFiles.length; i++){
		glowTexture = new THREE.ImageUtils.loadTexture( starFiles[i] );
		// glowTexture.minFilter = THREE.LinearFilter;
		// glowTexture.wrapS = glowTexture.wrapT = THREE.ClampToEdgeWrapping;
		// glowTexture.minFilter = THREE.LinearFilter;
		glowTextures.push(glowTexture);
		starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
		starAnimators.push(starAnimator);
	}

	for(var i=0; i<50; i++){
		mat = new THREE.SpriteMaterial({map: glowTextures[i%4], color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		var st = new THREE.Sprite(mat);
		st.position.set( Math.random()*(myStartX+400)-(myStartX+200), Math.random()*-100+400, Math.random()*(myStartZ+400)-(myStartZ+200) );
		st.rotation.y = Math.random()*Math.PI;
		st.scale.set(5,5,5);
		scene.add(st);
		stars.push(st);
	}

	// lookDummy!
		// projector = new THREE.Projector();
		eyerayCaster = new THREE.Raycaster();
		
		var redDot = new THREE.SphereGeometry(0.2);
		mat  = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
		lookDummy = new THREE.Mesh(redDot, mat);
		scene.add(lookDummy);


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

	///////////////////////////////////////////////////////

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild( stats.domElement );

	physics_stats = new Stats();
	physics_stats.domElement.style.position = 'absolute';
	physics_stats.domElement.style.bottom = '55px';
	physics_stats.domElement.style.zIndex = 100;
	physics_stats.domElement.children[ 0 ].style.background = "transparent";
	physics_stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild( physics_stats.domElement );

	//////////////////////////////////////////////////////
	
	
	// EVENTS
	// automatically resize renderer
	window.addEventListener('resize', onWindowResize, false);
	// window.addEventListener('click', startSpeech, false);
	window.addEventListener('keydown', myKeyPressed, false);
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
		.6, // medium friction
		.3 // low restitution
	);
	
	poopPhy = new Physijs.ConvexMesh(
		poopGeo,	//poopGeo
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
				.to( {x: 0, y: 0, z: 0}, 1000 )
				.easing( TWEEN.Easing.Elastic.In )
				.delay( 1000 )
				.onComplete(function(){
					scene.remove(poopH);
				});

	mHOut.chain(mHGone);
	mHOut.start();
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

	// EFFECT
		if(isItVR){
			effect = new THREE.StereoEffect(renderer);
			effect.seperation = 0.2;
			effect.targetDistance = 50;
			effect.setSize(window.innerWidth, window.innerHeight);
		}

	// window.addEventListener('click', fullscreen, false);

	// Controls
		controls = new THREE.DeviceControls(camera, myWorldCenter, true);
		scene.add( controls.getObject() );


	setTimeout(function(){
		//
		bathroom.position.copy( myPosition );
		scene.add(bathroom);

		// firstGuy = createSimplePlayer( myPosition, myColor, whoIamInLife );
		//v1
		// firstGuy = createSitPlayer( myPosition, myColor, whoIamInLife );
		// dailyLifePlayers.push(firstGuy);
		//v2
		firstGuy = new Person( myPosition, myColor, whoIamInLife, playerNName );
		dailyLifePlayerDict[ whoIamInLife ] = firstGuy;
		// firstGuy.wordTexture.clear('cyan').drawText(firstGuy.nname, undefined, 200, 'red');
		console.log("Me built!");
		// secondGuy = createPlayer( new THREE.Vector3(0,0,-3), yourMat );
		// dailyLifePlayers.push(secondGuy);

		window.addEventListener('click', fullscreen, false);
	},500);

	// AniPerson
		personCircle = new THREE.Object3D();
		personMat = new THREE.MeshBasicMaterial( { map: personTex, morphTargets: true } );

		for(var i=0; i<5; i++){
			//toiletCenters[meInSGroup] 
			var pppos = new THREE.Vector3( toiletCenters[meInBGroup].x+Math.sin(Math.PI*2/5*i)*23, toiletCenters[meInBGroup].y+7, toiletCenters[meInBGroup].z+Math.cos(Math.PI*2/5*i)*23 );
			person = new AniPersonBeAdded( 0.4, personKeyframeSet, personAniOffsetSet, personGeo, personMat, pppos, 1 );
			persons.push(person);
			person.body.scale.set(7,7,7);
			person.body.rotation.y = (360/5*i+90)*(Math.PI/180);
			personCircle.add(person.body);

			if(i==4)
				scene.add(personCircle);
		}
	
	// CONTROLS
	// controls = new THREE.OrbitControls( camera, renderer.domElement );

	//
	animate();	
}

function myKeyPressed( event ){
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
					'playerDir': controls.getDirection()
				};

				if(ws){
					sendMessage( JSON.stringify(msg) );
				}
			break;

		case 57: //9
			// to center of the toilet, then go down the tube
			// v.1 - removed. saved in old script

			// v.2
			var waterPos = new THREE.Vector3();
			waterPos.copy( toiletCenters[meInBGroup] );
			waterPos.y = -10;
			controls.createTweenForMove( waterPos, 5000 );

			setTimeout(function(){
				var newPos = {};
				newPos.x = [0,0,0,0];
				newPos.y = [-16,-22,-23,-50];
				newPos.z = [-13,-10,-1,-1];
				controls.createTweenForMove( newPos, 21000 );
			}, 9000);

			setTimeout(function(){
				bathroom.visible = true;
				bathroom.position.set(0,-50,0);
			}, 20000);
			break;
	}
}

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
		br = new THREE.Mesh(geometry1, new THREE.MeshLambertMaterial({color: 0xcccccc}));

		bathroom.add(br);
		br = new THREE.Mesh(new THREE.PlaneGeometry(14,10,1,1), new THREE.MeshLambertMaterial({color: 0xcccccc}));
		br.rotation.y = Math.PI;
		br.position.z += 3.3;
		bathroom.add(br);

		loader.load( _g, function( geometry2 ){
			br = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({color: 0xfffac4}));
			bathroom.add(br);

			loader.load( _y, function( geometry3 ){
				br = new THREE.Mesh(geometry3, new THREE.MeshLambertMaterial({color: 0xffea00}));
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

				loader.load( _t, function( geometry4 ){
					// 0xf7c0c1
					// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({color: 0xff265d, side: THREE.DoubleSide}));

					// br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({map: bathroomTex, side: THREE.DoubleSide}));

					geometry4.faceVertexUvs[ 1 ] = geometry4.faceVertexUvs[ 0 ];

					br = new THREE.Mesh(geometry4, intestineMat);

					bathroom.add(br);

					bathroom.scale.set(1.5,1.5,1.5);
					// bathroom.rotation.y += Math.PI;
					scene.add(bathroom);
				});
			});
		});	
	});
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
	});
}

function loadModelPoopMacaron( _poop ){
	loader = new THREE.JSONLoader();
	
	loader.load( _poop, function( geometry ){
		poopMGeo = geometry.clone();
		poopMGeo.computeBoundingSphere();

		poopM = new THREE.Mesh(poopMGeo, poopMMat);
	});
}

function loadModelPoopHeart( _poopH ){
	loader = new THREE.JSONLoader();
	
	loader.load( _poopH, function( geometry ){
		poopHeartGeo = geometry.clone();
		poopHeartGeo.computeBoundingSphere();

		poopHeart = new THREE.Mesh(poopHeartGeo, poopHeartMat);
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

function animate() 
{
    requestAnimationFrame( animate );				//http://creativejs.com/resources/requestanimationframe/
	update();
	render();		
}


function update()
{	

	// WEB_CAM - removed. saved in old script.

	TWEEN.update();
	controls.update( Date.now() - time );
	var dt = clock.getDelta();

	stats.update();

	physics_stats.update();
	scene.simulate();

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

		if(persons.length==5){
			for(var i=0; i<persons.length; i++){
				persons[i].update(null);
				persons[i].switchAni();
			}
		}
		personCircle.rotation.y += 0.003;


	if(waterwave.body.morphTargetInfluences.length>0){
		waterwave.update(null);
	}

	// STAR
	for(var i=0; i<starAnimators.length; i++){
		starAnimators[i].updateLaura( 300*dt );
	}

	// windowAnimator.updateLaura( 300*dt );

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
		sample.trigger(0,1);
		new TWEEN.Tween(firstGuy.player.children[0].children[0].children[1].rotation)
			.to({z: 1}, 100)
			.repeat(3)
			.yoyo(true)
			.start();

		setTimeout(function(){
			poopIsTalking = false;

		}, 5000);

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
		}		

	//
	time = Date.now();
}

function render() 
{	
	if(!isItVR)
		renderer.render( scene, camera );
	else
		effect.render(scene, camera);
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

	scene.remove( dailyLifePlayerDict[playerID].player );
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

	if(!initSound){

		/////////////////////////////
		//    OFFICIAL START!!!    //
		/////////////////////////////
		sound_bathroom.play();
		sound_fire.play();
		sound_forest.play();

		initSound = true;		
	}
}

function EnterSceneTwo() {
	setTimeout(function(){
		// v2_move tube
		new TWEEN.Tween( bathroom.position )
		.to( controls.getOutBathroomPosition, 7500 )
		.easing( TWEEN.Easing.Cubic.InOut )
		.start();
		//
		// firstGuy.wordTexture.clear();

		setTimeout(function(){	

			controls.setMovYAnimation( -181.8, 11000 );

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
		}, 8500);

	}, 6*1000);
}
