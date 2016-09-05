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


		if(isTouchDevice()) {
			console.log("isTouchDevice");
			instructions.addEventListener( 'touchend', funToCall, false );
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
	var poop, poopGeo, poopTex, poopMat, poopHat;
	var poopM, poopMGeo, poopMTex, poopMMat;
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
	var bathroomGeo, bathroomTex, bathroomMat;
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
		meInBGroup = Math.floor(whoIamInLife/6) % 3;		// which toilet
		meInSGroup = ( whoIamInLife%18 )%6;					// which on a toilet
		myStartX = Math.sin(Math.PI*2/6*meInSGroup)*18;
		myStartZ = Math.cos(Math.PI*2/6*meInSGroup)*18;

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
		if(isMobile)
			scene = new Physijs.Scene({fixedTimeStep: 1 / 40});
		else
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
		loader.load('images/poopMocaronS.png', function(texture){
			poopMTex = texture;
			poopMMat = new THREE.MeshLambertMaterial({map: poopMTex});
			loadModelPoopMacaron( "models/poopMacaron.js" );
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
		loadModelBathrooms( "models/br_w2.js", "models/br_g.js", "models/br_y.js", "models/tubeTest.js" );

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
						tp.position.set( Math.sin(Math.PI*2/20*i)*20, 0, Math.cos(Math.PI*2/20*i)*20 );
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
		new THREE.MeshLambertMaterial({map: poopMTex}),	//poopTex
		.6, // medium friction
		.3 // low restitution
	);
	
	poopPhy = new Physijs.ConvexMesh(
		poopMGeo,	//poopGeo
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

function init() 
{	
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
		firstGuy = new Person( myPosition, myColor, whoIamInLife );
		dailyLifePlayerDict[ whoIamInLife ] = firstGuy;
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

		case 54: //6 --> innerPoop Wave
			var ps_RATween = new TWEEN.Tween(playerBody.children[0].children[0].rotation)
							  .to({z: -1}, 200)
							  .repeat(3)
							  .yoyo(true)
							  .start();
			break;

		case 75: //k
			createBox();
			break;

		case 76: //l --> shoot poop
			if(yogaOver){	// bring back after developing
				// createPoop( controls.position(), controls.getDirection() );
				poopCount ++;
			}

			if(lookingAtSomeone != -1){
				createMPoop( controls.position(), controls.getDirection() );
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
					'playerPos': controls.position(),
					'playerDir': controls.getDirection()
				};

				if(ws){
					sendMessage( JSON.stringify(msg) );
				}
			break;

		case 77: //m --> bathroom shrink
			bathroom.position.y -= 5;
			var br_tween = new TWEEN.Tween(bathroom.scale)
							  .to({y: 0.1}, 2000)
							  .easing( TWEEN.Easing.Elastic.InOut )
							  .start();
			break;

		// firstGuy.player.children[0].children[0].rotation.z += Math.PI;
		case 88: //x --> miniPoop wave hand!
			new TWEEN.Tween(firstGuy.player.children[0].children[0].children[1].rotation)
			.to({z: 1}, 100)
			.repeat(3)
			.yoyo(true)
			.start();
			break;

		case 85: //u
			// to center of the toilet, then go down the tube
			// v.1
			// var newPos = new THREE.Vector3();
			// newPos.copy( toiletCenters[meInSGroup] );
			// newPos.y = -5;
			// controls.createTweenForMove( newPos, 5000 );

			// v.2
			var waterPos = new THREE.Vector3();
			waterPos.copy( toiletCenters[meInSGroup] );
			waterPos.y = -11;
			controls.createTweenForMove( waterPos, 5000 );

			setTimeout(function(){
				var newPos = {};
				newPos.x = [0,0,0,0];
				newPos.y = [-16,-22,-23,-50];
				newPos.z = [-13,-10,-1,-1];
				controls.createTweenForMove( newPos, 21000 );
			}, 10000);

			setTimeout(function(){
				bathroom.visible = true;
				bathroom.position.set(0,-50,0);
			}, 20000);
			break;

		case 90: //z --> backward, and then drop down
			// controls.setMovZAnimation( 30, 3000 );
			// v1_move came
			// controls.createTweenForMove( controls.getOutBathroomPosition, 3000 );

			// v2_move tube
			new TWEEN.Tween( bathroom.position )
			.to( controls.getOutBathroomPosition, 7500 )
			.easing( TWEEN.Easing.Cubic.InOut )
			.start();

			setTimeout(function(){
				controls.setMovYAnimation( -182.3, 11000 );

				// Change scene bg music
				switchSound_1 = true;
				sound_stomach.fadeIn(1,6000);
				sound_bathroom.fadeOut(0,8000);

				//
				for(var i=0; i<stars.length; i++){
					stars[i].position.y -= 200;
				}

				// disappear the bathroom, start the yoga part
				setTimeout(function(){
					sound_bathroom.stop();
					sound_meditation.play();

					bathroom.visible = false;
				}, 16000);
			}, 8500);
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
					br = new THREE.Mesh(geometry4, new THREE.MeshLambertMaterial({color: 0xff265d, side: THREE.DoubleSide}));
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

var pBody, pLA, pRA, pHead, pScreen, pMat, pColor, pToilet;

function createPlayer( _pos, _video, _color, _id, _peerid ){

	var scMat;
	if( _video != -1 ){
		console.log("video for the player " + _id + " is not null");
		var scTexture = new THREE.Texture( _video.videoImage );
		scTexture.minFilter = THREE.LinearFilter;
		scTexture.magFilter = THREE.LinearFilter;
		scTexture.format = THREE.RGBFormat;
		scTexture.generateMipmaps = false;
		scTexture.wrapS = scTexture.wrapT = THREE.ClampToEdgeWrapping;
		scTexture.needsUpdate = true;
		scMat = new THREE.MeshBasicMaterial({map: scTexture, side: THREE.DoubleSide});

		_video.videoTexture = scTexture;
	///
	} else {
		console.log("video for the player " + _id + " is null");
		scMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
		scMat.needsUpdate = true;
	}

	player = new THREE.Object3D();
	player.whoIam = _id;
	player.peerid = _peerid;
	playerBody = new THREE.Object3D();
	playerBody.name = "body";
	playerHead = new THREE.Object3D();

	// (?) could it be specific based on USER (?)
	// (?) could it be ID (?)
	// pColor = Math.random() * 0xffffff;

	pMat = new THREE.MeshLambertMaterial( { map: skinTexture, color: _color, side: THREE.DoubleSide } );

	// add body --> body's children[0]
	pBody = new THREE.Mesh( guyBodyGeo, pMat);				
	pBody.name = "trunck";
	pBody.position.z = -0.1;	//
	playerBody.add(pBody);

	// add LA --> body's children[1]
	pLA = new THREE.Mesh( guyLAGeo, pMat );
	pLA.name = "LA";
	pLA.position.y = 0.2;
	pLA.position.z = 0;	//0.1
	playerBody.add(pLA);

	// add RA --> body's children[2]
	pRA = new THREE.Mesh( guyRAGeo, pMat );
	pRA.name = "RA";
	pRA.position.y = 0.2; //0.2
	pRA.position.z = 0;	//0.1
	playerBody.add(pRA);

	// add MURMUR
		wordTexture	= new THREEx.DynamicTexture(512,512)
		wordTexture.context.font	= "bolder 90px StupidFont";
		dailyLifeMurmurs.push(wordTexture);

		wordMaterial = new THREE.MeshBasicMaterial({map: wordTexture.texture, side: THREE.DoubleSide});
		wordMaterial.transparent = true;
		wordBubble = new THREE.Mesh(new THREE.PlaneGeometry(wordTexture.canvas.width, wordTexture.canvas.height), wordMaterial);
		wordBubble.scale.set(0.005,0.005,0.005);
		wordBubble.position.x = -2;
		wordBubble.position.y = 2;
		wordBubble.rotation.y = Math.PI;
		playerBody.add(wordBubble);

	// add body --> player's children[0]
	playerBody.position.y = -0.9;	//
	player.add( playerBody );

	// add head & screen
	pHead = new THREE.Mesh( guyHeadGeo, pMat );
	pHead.name = "head_head";
	pScreen = new THREE.Mesh(eyeGeo, scMat);
	pScreen.name = "head_screen";

	pScreen.scale.set(0.3,0.3,0.3);
	pScreen.position.y = -0.3;	//1
	pScreen.position.z = 1.5;	//1
	playerHead.add(pHead);		// (?) have head or not? No head thus no blocking (?)
	playerHead.add(pScreen);
	playerHead.name = "head";

	// ADD_UP_ALL --> player's children[1]
	player.add(playerHead);
	player.position.copy( _pos );

	scene.add( player );

	return player;
}

function createSimplePlayer( _pos, _color, _id ){

	player = new THREE.Object3D();
	player.whoIam = _id;
	// player.peerid = _peerid;
	playerBody = new THREE.Object3D();
	playerBody.name = "body";
	playerHead = new THREE.Object3D();

	// (?) could it be specific based on USER (?)
	// (?) could it be ID (?)
	// pColor = Math.random() * 0xffffff;

	pMat = new THREE.MeshLambertMaterial( { map: skinTexture, color: _color, side: THREE.DoubleSide } );

	// add body --> body's children[0]
	pBody = new THREE.Mesh( guyBodyGeo, pMat);				
	pBody.name = "trunck";
	pBody.position.z = -0.1;	//
	playerBody.add(pBody);

	// add LA --> body's children[1]
	pLA = new THREE.Mesh( guyLAGeo, pMat );
	pLA.name = "LA";
	pLA.position.y = 0.2;
	pLA.position.z = 0;	//0.1
	playerBody.add(pLA);

	// add RA --> body's children[2]
	pRA = new THREE.Mesh( guyRAGeo, pMat );
	pRA.name = "RA";
	pRA.position.y = 0.2; //0.2
	pRA.position.z = 0;	//0.1
	playerBody.add(pRA);

	// add MURMUR
		// wordTexture	= new THREEx.DynamicTexture(512,512)
		// wordTexture.context.font	= "bolder 90px StupidFont";
		// dailyLifeMurmurs.push(wordTexture);

		// wordMaterial = new THREE.MeshBasicMaterial({map: wordTexture.texture, side: THREE.DoubleSide});
		// wordMaterial.transparent = true;
		// wordBubble = new THREE.Mesh(new THREE.PlaneGeometry(wordTexture.canvas.width, wordTexture.canvas.height), wordMaterial);
		// wordBubble.scale.set(0.005,0.005,0.005);
		// wordBubble.position.x = -2;
		// wordBubble.position.y = 2;
		// wordBubble.rotation.y = Math.PI;
		// playerBody.add(wordBubble);

	// add body --> player's children[0]
	playerBody.position.y = -0.9;	//
	player.add( playerBody );

	// add head & screen
	pHead = new THREE.Mesh( guyHeadGeo, pMat );
	pHead.name = "head_head";
	// pScreen = new THREE.Mesh(eyeGeo, scMat);
	// pScreen.name = "head_screen";

	// pScreen.scale.set(0.3,0.3,0.3);
	// pScreen.position.y = -0.3;	//1
	// pScreen.position.z = 1.5;	//1
	playerHead.add(pHead);		// (?) have head or not? No head thus no blocking (?)
	// playerHead.add(pScreen);
	playerHead.name = "head";

	// ADD_UP_ALL --> player's children[1]
	player.add(playerHead);
	player.position.copy( _pos );

	scene.add( player );

	return player;
}

function createSitPlayer( _pos, _color, _id ){

	player = new THREE.Object3D();
	player.whoIam = _id;

	pMat = new THREE.MeshLambertMaterial( { map: personTex, color: _color, side: THREE.DoubleSide } );

	// 1-body
	playerBody = new THREE.Mesh( personBody, pMat);
	playerBody.name = "body";

	// if it's ME, create inner poop
	if( _id == whoIamInLife ){

		var poopMini = poop.clone();
		poopMini.name = "miniPoop";
		poopMini.scale.set(0.1,0.1,0.1);
		poopMini.rotation.x += Math.PI/2;
		poopMini.position.y -= 1.3;
		poopMini.position.z -= 0.1;
		playerBody.add( poopMini );

		// var ps_RATween = new TWEEN.Tween(poopMini.children[0].rotation)
		// 					  .to({z: -1}, 200)
		// 					  .repeat(3)
		// 					  .yoyo(true)
		// 					  .start();
	}
	
	player.add( playerBody );

	// 2-head
	playerHead = new THREE.Mesh( personHead, pMat );
	playerHead.name = "head";
	//
	var poopHat = poop.clone();
	poopHat.rotation.y += Math.PI;
	poopHat.position.y += 0.3;
	playerHead.add( poopHat );

	player.add( playerHead );

	// 3-toilet
	pToilet = new THREE.Mesh( personToilet, toiletMat );
	pToilet.name = "toilet";
	player.add( pToilet );

	player.position.copy( _pos );
	scene.add( player );

	return player;
}

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
	// v.1
	// wordContext.fillStyle = "cyan";
	// wordContext.fillRect(0, 0, wordCanvas.width, wordCanvas.height);
	// wordTexture.needsUpdate = true;

	// var textSize = wordContext.measureText(myFakeWord);
	// var textX = (wordCanvas.width - textSize.width) / 2;
	// wordContext.fillStyle = "red";
	// wordContext.fillText(myFakeWord, textX, 200);
	// wordTexture.needsUpdate = true;

	// v.2
	// wordTexture.clear('cyan').drawText(myFakeWord, undefined, 200, 'red');
	/*
	for(var i=0; i<dailyLifeMurmurs.length; i++){
		var indexxx = ""+dailyLifePlayers[i].whoIam;
		dailyLifeMurmurs[i].clear('cyan').drawText(allTheMurmur[indexxx], undefined, 200, 'red');
	}
	*/

	// WEB_CAM
		/*
		for(var i=0; i<videos.length; i++){
			if(videos[i].video.readyState === videos[i].video.HAVE_ENOUGH_DATA){
				videos[i].videoImageContext.drawImage(videos[i].video, 0, 0, videoWidth, videoHeight);

				if(videos[i].videoTexture){
					videos[i].videoTexture.flipY = true;
					videos[i].videoTexture.needsUpdate = true;
				}
			}
		}
		*/

	TWEEN.update();
	controls.update( Date.now() - time );
	var dt = clock.getDelta();
	// console.log( controls.rotY() );
	stats.update();

	physics_stats.update();
	scene.simulate( undefined, 1 );

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


	if(waterwave.body){
		waterwave.update(null);
	}

	// STAR
	for(var i=0; i<starAnimators.length; i++){
		starAnimators[i].updateLaura( 300*dt );
	}

	// windowAnimator.updateLaura( 300*dt );

	// Poop talk
	// if(firstGuy.player.children)
	// 	console.log(firstGuy.player.children[1].rotation);
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

	// if(switchSound_1){
	// 	if(gainNodes[2].gain.value < 1){
	// 		gainNodes[2].gain.value += 0.002;
	// 	}
	// 	if(gainNodes[3].gain.value > 0.002){
	// 		gainNodes[3].gain.value -= 0.002;
	// 	}		
	// }

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

				// for(var i=0; i<spookyGuys.length; i++){
				// 	if(eyeIntersects[ 0 ].object == spookyGuys[i] && !spookyGuysHit[i] ){

				// 		var guyNum = i;

				// 		console.log("wrong hit: " + i);

				// 		spookyGuys[guyNum].position.set( camPos.x + 4*Math.sin( camRotY - Math.PI ), 0, camPos.z + 4*Math.cos( camRotY - Math.PI ) );
				// 		var sIndex = getRandomInt(0,3);

				// 		if(samplesAllLoaded)
				// 			sample.trigger(sIndex, 4);

				// 		spookyGuysHit[guyNum] = true;

				// 		setTimeout(function(){
				// 			spookyGuys[guyNum].position.set(0,-500,0);
				// 		}, 700);
				// 	}					
				// }

				// for(var j=0; j<guys.length; j++){
				// 	if( eyeIntersects[ 0 ].object == guys[j] ){

				// 		var guyNumm = j;

				// 		if(!goodGuysHit[j]){
				// 			console.log("good hit: " + guyNumm);

				// 			var ssIndex = getRandomInt(9,10);
				// 			if(samplesAllLoaded)
				// 				sample.trigger(ssIndex, 1);

				// 			guys[guyNumm].position.set(0,-500,0);
				// 			getGuyCount++;

				// 			//make vibrate!
				// 			goodGuysHit[guyNumm] = true;
				// 		}
				// 	}					
				// }
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

function updatePlayer(playerIndex, playerLocX, playerLocZ, playerRotY, playerQ){
	var dlpIndex;
	for(var i=0; i<dailyLifePlayers.length; i++){
		if(dailyLifePlayers[i].whoIam == playerIndex){
			dlpIndex = i;
			break;
		}
	}

	if(dailyLifePlayers[dlpIndex]){
		dailyLifePlayers[dlpIndex].position.x = playerLocX;
		dailyLifePlayers[dlpIndex].position.z = playerLocZ;

		// head
		if(dailyLifePlayers[dlpIndex].children[1])
			dailyLifePlayers[dlpIndex].children[1].rotation.setFromQuaternion( playerQ );
		
		// body
		// v1
		// var ahhRotation = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );
		// if(dailyLifePlayers[playerIndex].children[0])
		// 	dailyLifePlayers[playerIndex].children[0].rotation.y = ahhRotation.y;

		// v2
		// var ahhQuaternion = playerQ.clone();
		playerQ._x = 0;
		playerQ._z = 0;
		playerQ.normalize();
		var ahhRotation = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ');
		// ahhRotation.y += Math.PI;

		if(dailyLifePlayers[dlpIndex].children[0]){
			dailyLifePlayers[dlpIndex].children[0].rotation.y = ahhRotation.y;
		}
		if(dailyLifePlayers[dlpIndex].children[2]){
			dailyLifePlayers[dlpIndex].children[2].rotation.y = ahhRotation.y;
		}
	}
}

function removePlayer(playerID){
	var goneIndex=-1;
	for(var i=0; i<dailyLifePlayers.length; i++){
		if(dailyLifePlayers[i].whoIam == playerID){
			goneIndex = i;
			break;
		}
	}

	scene.remove(dailyLifePlayers[goneIndex]);
	dailyLifePlayers.splice(goneIndex,1);
	dailyLifeMurmurs.splice(goneIndex,1);
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

		setTimeout(function(){
			controls.setMovYAnimation( -182.3, 11000 );

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
