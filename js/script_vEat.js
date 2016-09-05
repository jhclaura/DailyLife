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

var myStartX = 0, myStartZ = 3, myStartY = 3.5; //2
var myPosition, myStartRotY, worldBubble, pplCount, pplCountTex, pplCountMat;

var model, texture;
var dummy;
var perlin = new ImprovedNoise(), noiseQuality = 1;

var basedURL = "assets/eat/";

var textureLoader, loadingManger, br_mat_loadingManager, starLoadingManager;
var keyIsPressed;

// WAVE
	var timeWs = [0, Math.PI/2, Math.PI, -Math.PI/2, Math.PI+0.3, -Math.PI/5, Math.PI/1.1];
	var frequencyWs = [0.02, 0.01];
	var frequencyW = 0.02, amplitudeW = 1, offsetW = 0;
	var sinWave, sinWaves = [], cosWaves = [], tanWaves = [], spin;
	var sinWRun = [], cosWRun = [], tanWRun = [];

// RAYCAST
	var objects = [];
	var ray;
	var projector, eyerayCaster, eyeIntersects;
	var lookDummy, lookVector;

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

//
	var planet, truck, curtain, curtainGeo1, curtainGeo2;
	var highChair, highChairMat, stomach;

////////////////////////////////////////////////////////////

// init();				// Init after CONNECTION
superInit();			// init automatically

// connectSocket();		// Init after superInit

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){

	//Prevent scrolling for Mobile
	noScrolling = function(event){
		event.preventDefault();
	};

	// HOWLER
		// sound_forest = new Howl({
		// 	urls: ['../audios/duet/nightForest.mp3'],
		// 	loop: true,
		// 	volume: 0.2
		// });


	time = Date.now();

	// THREE.JS -------------------------------------------
		clock = new THREE.Clock();

	// RENDERER
		container = document.getElementById('render-canvas');
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		// renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffff00, 1);
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
		scene = new THREE.Scene();
		// scene = new Physijs.Scene();
		// scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

	// LIGHT
		hemiLight = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
		hemiLight.intensity = 0.8;
		scene.add(hemiLight);

		light = new THREE.SpotLight( 0xffffff );
		light.position.set( 100, 100, 100);
		light.intensity = 0.3;
		scene.add(light);

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

	// RAYCASTER!
		eyerayCaster = new THREE.Raycaster();	

	// Sinwave
		sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);


	// planet = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial() );
	// scene.add( planet );

	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	/*
		START LOADING	                                                          
	*/
	//////////////////////////////////////////////////////////////////////////////////////////

	loadingManger = new THREE.LoadingManager();
		// loadingManger.onProgress = function ( item, loaded, total ) {
		//     console.log( item, loaded, total );
		//     var loadingPercentage = Math.floor(loaded/total*100);
		//     // loadingTxt.innerHTML = "loading " + loadingPercentage +"%";
		//     console.log("loading " + loadingPercentage +"%");
		// };

		// loadingManger.onError = function(err) {
		// 	console.log(err);
		// };

		loadingManger.onLoad = function () {
		    // console.log( "first step all loaded!" );
		    // CreateStars();
		    lateInit();
		};

	var truckLoader = new THREE.JSONLoader( loadingManger );
	truckLoader.load( basedURL+"models/foodCart/foodcarttest2.json", function( geometry ) {
		truck = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() );
		// truck.scale.multiplyScalar(0.27);
		// truck.position.copy( toiletCenters[0]);
		scene.add( truck );
	} );

	loadModelCurtain( basedURL + "models/foodCart/foodcarttest2_c1.json", basedURL + "models/foodCart/foodcarttest2_c2.json" );

	highChairMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	loadModelHighChair( basedURL + "models/highChair/hc_chair.json",
						basedURL + "models/highChair/hc_table.json",
						basedURL + "models/highChair/hc_stuff.json",
						basedURL + "models/highChair/hc_smallPlate.json",
						basedURL + "models/highChair/hc_bigPlate.json" );

	loadSitModelPlayer( basedURL + "models/personHead.js",
						basedURL + "models/personBody.js",
						basedURL + "models/stomach.json");

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild( stats.domElement );

	// physics_stats = new Stats();
	// physics_stats.domElement.style.position = 'absolute';
	// physics_stats.domElement.style.bottom = '55px';
	// physics_stats.domElement.style.zIndex = 100;
	// physics_stats.domElement.children[ 0 ].style.background = "transparent";
	// physics_stats.domElement.children[ 0 ].children[1].style.display = "none";
	// container.appendChild( physics_stats.domElement );
	
	// EVENTS
	window.addEventListener('resize', onWindowResize, false);

	// After trigger the loading functions
	// Connect to WebSocket!
		// connectSocket();

	//
	// lateInit();
}

// lateInit() happens after click "Start"
function lateInit() 
{	
	// console.log("late init!");
	document.body.addEventListener('touchmove', noScrolling, false);
	// window.addEventListener('keydown', myKeyPressed, false);
	// window.addEventListener('keyup', myKeyUp, false);

	clock.start();

	myWorldCenter = new THREE.Vector3();

	// build me!
	myPosition = new THREE.Vector3( myStartX, myStartY, myStartZ );
	firstGuy = new PersonEat( myPosition, new THREE.Color(), 1, "laura" );

	// create controls
	controls = new THREE.DeviceControls(camera, myWorldCenter, true);
	scene.add( controls.getObject() );

	// start to animate()!
	animate(performance ? performance.now() : Date.now());

	trulyFullyStart = true;
}


// v.2
// Request animation frame loop function
var lastRender = 0;

function animate(timestamp) {
	// if(!isAllOver){
		var delta = Math.min(timestamp - lastRender, 500);
		lastRender = timestamp;

		update();
		
		// Render the scene through the manager.
		vrmanager.render(scene, camera, timestamp);
		stats.update();
	// }
	requestAnimationFrame(animate);
}


function update()
{	

	TWEEN.update();
	controls.update( Date.now() - time );

	var dt = clock.getDelta();

	// if(particleGroup && inScCelebration)
	// 	particleGroup.tick( dt );

	// scene.simulate( undefined, 2 );
	// physics_stats.update();


	// eyeRay!
		var directionCam = controls.getDirection(1).clone();
		eyerayCaster.set( controls.position().clone(), directionCam );
		eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if( eyeIntersects.length > 0 ){
			// var iName = eyeIntersects[ 0 ].object.name;
			// iName = iName.split(" ");
			// console.log(eyeIntersects[ 0 ].object);

			// if ( eyeIntersects[ 0 ].object == flushHandler ){
			// 	// ...
			// }

			// if ( eyeIntersects.length > 1 ) {
			// 	// ...
			// }
		} else {
			// ...
		}		

	// Bathroom Light!
	if(curtain){
		var curtainNum = (sinWave.run()+1)/2;
		curtain.morphTargetInfluences[0] = curtainNum;
		// curtainGeo1.computeVertexNormals();
		// curtainGeo2.computeVertexNormals();
	}

	//
	time = Date.now();
}

function render() 
{	
	effect.render(scene, camera);
}

function changeAni ( aniIndex ) {

	animOffset = animOffsetSet[ aniIndex ];
	keyframe = animOffsetSet[ aniIndex ];
	currentKeyframe = keyframe;
	keyduration = keyframeSet[ aniIndex ];
	aniStep = 0;
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

	if(loadedCount>=7) {
		// hide the loading gif and display start link
		startLink.style.display = "";
		loadingImg.style.display = "none";
		loadingTxt.style.display = "none";
		readyToStart = true;
	}
}
