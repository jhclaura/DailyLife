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

var myStartX = 10, myStartZ = 10, myStartY = 3.5; //0, 10, 2
var myPosition, myStartRotY, worldBubble, pplCount, pplCountTex, pplCountMat;

var model, texture;
var dummy;
var perlin = new ImprovedNoise(), noiseQuality = 1;

var basedURL = "assets/eat/";

var textureLoader, loadingManger;
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
	var planet, truck, curtain, curtainGeo1, curtainGeo2, lanternGroup;
	var highChair, highChairMat, stomach;
	var chewerA, chewerB, chewerC, chewerD, chewerTextures = [], chewers = [];
	var mealTimeIndex = 0;

	var mouth, mouthClosed = false;

	var particleGroup;
	var downVelocity, upVelocity, centerVelocity;
	var outerUp = true;
	var firstRingEmitters = [], secondRingEmitters = [], centerRingEmitters = [];
	var waterAnimationLines = [];

	// event
	var animStart = false, nextAnim = null;
	var sequenceConfig;
	var spotLights = [], spotLightCenters=[], center;

	//
	var cactusFiles = [], cactusFiles2= [];
	// var cactusPot = new THREE.Object3D(), cactusPot2 = new THREE.Object3D();
	let cactusPot, cactusPot2;
	var cactusPotList = {}, cactusPotList2 = {};
	var cactusPosOffsetData = [ [0,0], [0.398,1.655], [0.636,2.088], [-0.338,1.894], [-0.63,2.875],
							[-0.609,3.692], [-0.251,3.527], [-0.586,-0.023], [-0.883,1.099], [-1.275,0.934],
							[-1.657,1.475], [0.406,0.024], [0.938,0.877] ];
	var cactusPosOffsetData2 = [ [0,0], [0.157,1.724], [0.645,2.238], [-0.62,1.799], [-0.419,2.056],
								 [-1.191,2.406], [-0.139,2.723], [0.419,0.008], [0.733,1.068], [0.937,1.113],
								 [-1.004,2.568] ];
	var cactusOffsetPos = [], cactusOffsetPos2 = [];
	var cactusGroup = [], cactusTimelines = [];
	var cactusAniSequence = [ [0,7,11], [3,9,12], [1,4,8], [2,5,6,10] ];
	var cactusAniSequence2 = [ [0,7], [1,3,9], [2,4,5], [6,8,10] ];
	var cactusAniLabel = ["1", "2", "3", "4"];
	var cactusLoadingManager;

////////////////////////////////////////////////////////////

// init();				// Init after CONNECTION
superInit();			// init automatically

// connectSocket();		// Init after superInit

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){

    // Event Setting
	    sequenceConfig = [
	        { time: 5, anim: ()=>{firstAni()} }
	        // { time: 10, anim: ()=>{secondAni()} }
	    ];
	    completeSequenceSetup();

	myColor = new THREE.Color();

	//Prevent scrolling for Mobile
	noScrolling = function(event){
		event.preventDefault();
	};

	// geoFindMe();

	// HOWLER
		// sound_forest = new Howl({
		// 	urls: ['../audios/duet/nightForest.mp3'],
		// 	loop: true,
		// 	volume: 0.2
		// });


	time = Date.now();


		// var d = new Date();
		// var n = d.getHours();

		// if(n>5 && n<11){
		// 	console.log("it's breakfast time!");
		// 	mealTimeIndex = 0;
		// }else if(n>=11 && n<17){
		// 	console.log("it's lunch time!");
		// 	mealTimeIndex = 1;
		// }else{
		// 	console.log("it's dinner time!");
		// 	mealTimeIndex = 2;
		// }

	// THREE.JS -------------------------------------------
		clock = new THREE.Clock();

	// RENDERER
		container = document.getElementById('render-canvas');
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		// renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.setClearColor(0x000000, 1);
		if(mealTimeIndex == 0){
			renderer.setClearColor(0x77edda, 1); // daytime
		} else if (mealTimeIndex == 1){
			renderer.setClearColor(0xffe03e, 1); // noontime
		} else {
			renderer.setClearColor(0x34122a, 1);	// nighttime
		}
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
		if(mealTimeIndex == 0){
			hemiLight = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1); // daytime
		} else if (mealTimeIndex == 1){
			hemiLight = new THREE.HemisphereLight( 0xffce91, 0xff9791, 1); // noontime
		} else {
			hemiLight = new THREE.HemisphereLight( 0x224659, 0x593522, 1);	// nighttime
		}
		hemiLight.intensity = 0.8;
		scene.add(hemiLight);

		light = new THREE.SpotLight( 0xffffff );
		light.position.set( -100, 100, -100);
		light.intensity = 0.3;
		scene.add(light);

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

	// RAYCASTER!
		eyerayCaster = new THREE.Raycaster();	

	// Sinwave
		//sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

		for(var i=0; i<timeWs.length; i++){
			var sw = new SinWave(timeWs[i], frequencyW, amplitudeW, offsetW);
			sinWaves.push(sw);
		}

	// planet = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial() );
	// scene.add( planet );

	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	/*
		                                                          
	*/
	//////////////////////////////////////////////////////////////////////////////////////////

	// START LOADING	
		loadingManger = new THREE.LoadingManager();
		loadingManger.onProgress = function ( item, loaded, total ) {
		    console.log( item, loaded, total );
		    // var loadingPercentage = Math.floor(loaded/total*100);
		    // loadingTxt.innerHTML = "loading " + loadingPercentage +"%";
		    // console.log("loading " + loadingPercentage +"%");
		};

		loadingManger.onError = function(err) {
			console.log(err);
		};

		loadingManger.onLoad = function () {
		    // console.log( "first step all loaded!" );
		    // CreateStars();

		    lateInit();

		    // startCycle();

		    // 1. load everything
		    // 2. connect to socket
		    // 3. late init after name 
		    // connectSocket();

		    console.log("ALL LOADED!");
			// startLink.style.display = "";
			// loadingImg.style.display = "none";
			// loadingTxt.style.display = "none";
			// readyToStart = true;
		};

		textureLoader = new THREE.TextureLoader( loadingManger );

		//
		loadModelTruck( basedURL + "models/foodCarts_small/cart_cart.json",
						basedURL + "models/foodCarts_small/cart_lantern.json",
						basedURL + "models/foodCarts_small/cart_rooftop.json",
						basedURL + "models/foodCarts_small/cart_supports.json",
						basedURL + "models/foodCarts_small/cart_wheels.json",
						basedURL + "models/foodCarts_small/cart_wood.json" );

		var modelLoader = new THREE.JSONLoader( loadingManger );

		lanternNRM = textureLoader.load( basedURL + '/images/lanternSphereNRM_2.png' );
		modelLoader.load( basedURL+"models/foodCart/lanternSphere.json", function( geometry ) {
			var lantern = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({normalMap: lanternNRM}) );
			lantern.position.y = -3;
			scene.add( lantern );
		} );	

		highChairMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
		loadModelHighChair( basedURL + "models/highChair/hc_chair.json",
							basedURL + "models/highChair/hc_table.json",
							basedURL + "models/highChair/hc_stuff.json",
							basedURL + "models/highChair/hc_smallPlate.json",
							basedURL + "models/highChair/hc_bigPlate.json" );

		loadSitModelPlayer( basedURL + "models/personHead.js",
							// basedURL + "models/personBody.js",
							basedURL + "models/chewers/body.json",
							basedURL + "models/stomach.json");

		loadModelChewers( basedURL + "models/chewers/chewerA_1.json", basedURL + "models/chewers/chewerA_2.json", basedURL + "models/chewers/chewerA_3.json",
			              basedURL + "models/chewers/chewerB_1.json", basedURL + "models/chewers/chewerB_2.json",
			              basedURL + "models/chewers/chewerC_1.json", basedURL + "models/chewers/chewerC_2.json", basedURL + "models/chewers/chewerC_3.json",
			              basedURL + "models/chewers/chewerD_1.json", basedURL + "models/chewers/chewerD_2.json" );

		chewerTextures[0] = textureLoader.load( basedURL + '/images/dude0.jpg' );
		chewerTextures[1] = textureLoader.load( basedURL + '/images/dude1.jpg' );
		chewerTextures[2] = textureLoader.load( basedURL + '/images/dude2.jpg' );
		chewerTextures[3] = textureLoader.load( basedURL + '/images/dude3.jpg' );

		modelLoader.load( basedURL+"models/teeth.json", function( geometry ) {
			var teeth = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff}) );
			//scene.add( teeth );

			modelLoader.load( basedURL+"models/mouse_open.json", function( geometry2 ) {
				var mouthOpen = geometry2;

				modelLoader.load( basedURL+"models/mouse_close.json", function( geometry3 ) {
					var mouthClose = geometry3;
					mouthOpen.morphTargets.push({name: 'm1', vertices: mouthClose.vertices});
					mouthOpen.computeMorphNormals();

					mouth = new THREE.Mesh( mouthOpen, new THREE.MeshLambertMaterial({color: 0xe9ceda, morphTargets: true, side: THREE.DoubleSide}) );
					//mouth.add(teeth);
					//mouth.scale.multiplyScalar(2);
					mouth.position.y = -4;
					scene.add( mouth );
				} );
			} );
		} );

	// CACTUS!
		cactusLoadingManager = new THREE.LoadingManager();
		cactusLoadingManager.onLoad = function () {

			for(let i=0; i<10; i++){
        		let new_c;
        		if(i%2==0)
        			new_c = cactusPot.clone(true);
        		else
        			new_c = cactusPot2.clone(true);
        		
        		new_c.position.set(Math.random()*20, 0, Math.random()*20);
        		scene.add(new_c);
        		cactusGroup.push(new_c);
        	}
    		createCactusAnimation();

		};

		cactusPot = new THREE.Object3D();
		cactusPot2 = new THREE.Object3D();
		for(var i=1; i<=13; i++){
			var fileName = basedURL + "models/cactus/c_" + i + ".json";
			cactusFiles.push( fileName );
		}
		for(var i=1; i<=11; i++){
			var fileName = basedURL + "models/cactus2/c_" + i + ".json";
			cactusFiles2.push( fileName );
		}

		for(var i=0; i<cactusPosOffsetData.length; i++){
	        var cP = new THREE.Vector3( cactusPosOffsetData[i][0], cactusPosOffsetData[i][1], 0 );
	        cactusOffsetPos.push(cP);
	    }
	    for(var i=0; i<cactusPosOffsetData2.length; i++){
	        var cP = new THREE.Vector3( cactusPosOffsetData2[i][0], cactusPosOffsetData2[i][1], 0 );
	        cactusOffsetPos2.push(cP);
	    }

	    // var tl = new TimelineMax({delay:3});
		var cactusMat = new THREE.MeshLambertMaterial({color: 0x298a59});

		// loadCactus1( cactusMat )
  //       .then( (cactus_1) => {
  //       	cactusPot = cactus_1;

  //           loadCactus2( cactusMat )
  //           .then( (cactus_2) => {
  //           	cactusPot2 = cactus_2;

  //           	setTimeout(function(){ 
  //           		for(let i=0; i<10; i++){
	 //            		let new_c;
	 //            		if(i%2==0)
	 //            			new_c = cactusPot.clone(true);
	 //            		else
	 //            			new_c = cactusPot2.clone(true);
	            		
	 //            		new_c.position.set(Math.random()*20, 0, Math.random()*20);
	 //            		scene.add(new_c);
	 //            		cactusGroup.push(new_c);
	 //            	}
  //           		createCactusAnimation();
  //           	}, 3000);
                
  //           });
  //       });

  		loadCactus1( cactusMat );
  		loadCactus2( cactusMat );
        /*
		for(let i=0; i<cactusFiles.length; i++){
			modelLoader.load( cactusFiles[i], (geometry)=> {
				let cc = new THREE.Mesh( geometry, cactusMat );
				cc.position.copy( cactusOffsetPos[i] );
				cc.scale.multiplyScalar(0.1);
				cactusPot.add(cc);
				cactusPotList[i]=cc;
				cc.visible = false;

				// if(i==(cactusFiles.length-1)) {
				// 	let timeGap = 0;
				// 	for(let i=0; i<cactusAniSequence.length; i++){
				// 		let toTween=[];
				// 		for(let j=0; j<cactusAniSequence[i].length; j++){
				// 			let tw = createCactusAni( cactusAniSequence[i][j] );
				// 			toTween.push(tw);
				// 		}
				// 		tl.add( toTween, timeGap );
				// 		timeGap += 0.2;
				// 	}
				// }
			} );
		}
		for(let i=0; i<cactusFiles2.length; i++){
			modelLoader.load( cactusFiles2[i], (geometry)=> {
				let cc = new THREE.Mesh( geometry, cactusMat );
				cc.position.copy( cactusOffsetPos2[i] );
				cc.scale.multiplyScalar(0.1);
				cactusPot2.add(cc);
				cactusPotList2[i]=cc;
				cc.visible = false;
			} );
		}
		*/
		// cactusPot.position.x = 10;
		// scene.add( cactusPot );

	// BIRD_testing
        // var birdMat = new THREE.MeshLambertMaterial({color: 0x00ffff});

        // modelLoader.load( basedURL+"models/bird/bird_body.json", (geometry, material) => {
        //     bird = new THREE.Mesh(geometry, birdMat);
            
        //     modelLoader.load( basedURL+"models/bird/bird_wingR.json", (geometry, material) => {
        //         var wingR = new THREE.Mesh(geometry, birdMat);
        //         wingR.position.x = -0.6;
        //         bird.add(wingR);

        //         modelLoader.load( basedURL+"models/bird/bird_wingL.json", (geometry, material) => {
        //             var wingL = new THREE.Mesh(geometry, birdMat);
        //             wingL.position.x = 0.6;
        //             bird.add(wingL);

        //             bird.position.set(myStartX-5, 1, myStartZ-3);
        //             scene.add(bird);
        //         });
        //     });
        // });
			        

    // FOUNTAIN_TESTING
    	

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild( stats.domElement );
	
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
	window.addEventListener('keydown', myKeyPressed, false);
	window.addEventListener('keyup', myKeyUp, false);

	clock.start();

	myWorldCenter = new THREE.Vector3();

	// build me!
	myPosition = new THREE.Vector3( myStartX-10, myStartY, myStartZ-5 );
	firstGuy = new PersonEat( myPosition, myColor, 0, "laura" );
	dailyLifePlayerDict[ 0 ] = firstGuy;

	// secGuy = new PersonEat( myPosition, new THREE.Color(), 1, "andy" );
	// secGuy.player.position.x = 5;

	// thirdGuy = new PersonEat( myPosition, new THREE.Color(), 2, "zoe" );
	// thirdGuy.player.position.x = -5;

	// fourthGuy = new PersonEat( myPosition, new THREE.Color(), 3, "corbin" );
	// fourthGuy.player.position.x = -5;
	// fourthGuy.player.position.z = 10;

	// create controls
	controls = new THREE.DeviceControls(camera, myWorldCenter, true);
	scene.add( controls.getObject() );

	// start to animate()!
	animate(performance ? performance.now() : Date.now());

	trulyFullyStart = true;

	initTime = Date.now();

	startEvent();
}

// TO_ANI: velocity.value, velocity.spread, acceleration.value, acceleration.spread

function firstAni() {
	console.log("do first ani!");
}

function secondAni() {
	console.log("do second ani!");
}

function loadCactus1( mat ) {

		cactusPot = new THREE.Object3D();
		let cactusLoader = new THREE.JSONLoader( cactusLoadingManager );
		for(let i=0; i<cactusFiles.length; i++){
			cactusLoader.load( cactusFiles[i], (geometry)=> {
				console.log(i);
				let cc = new THREE.Mesh( geometry, mat );
				cc.position.copy( cactusOffsetPos[i] );
				cc.scale.multiplyScalar(0.1);
				cactusPot.add(cc);
				cactusPotList[i]=cc;
				cc.visible = false;
			} );
		}
		// console.log( cactus );
}

function loadCactus2( mat ) {

		cactusPot2 = new THREE.Object3D();
		let cactusLoader = new THREE.JSONLoader( cactusLoadingManager );
		for(let i=0; i<cactusFiles2.length; i++){
			cactusLoader.load( cactusFiles2[i], (geometry)=> {
				console.log(i);
				let cc = new THREE.Mesh( geometry, mat );
				cc.position.copy( cactusOffsetPos2[i] );
				cc.scale.multiplyScalar(0.1);
				cactusPot2.add(cc);
				cactusPotList2[i]=cc;
				cc.visible = false;
			} );
		}
}

function createCactusAnimation() {
	// console.log(cactusGroup);
	for(let i=0; i<cactusGroup.length; i++){

		let tl = new TimelineMax({delay:i*0.5});
		let timeGap = 0;
		let theAniSequence;

		if(i%2==0){
			theAniSequence = cactusAniSequence;
		} else {
			theAniSequence = cactusAniSequence2;
		}
		// console.log(cactusGroup[i]);

		for(let k=0; k<theAniSequence.length; k++){
			let toTween=[];
			for(let j=0; j<theAniSequence[k].length; j++){
				let tw = createCactusAni( cactusGroup[i], theAniSequence[k][j] );
				toTween.push(tw);
			}
			tl.add( toTween, timeGap );
			timeGap += 0.2;
		}
		cactusTimelines.push(tl);
	}
}

function createCactusAni(cactusP, index) {
	console.log(cactusP.children.length + ", " + index);
	return TweenMax.to( cactusP.children[index].scale, .5, { x:1,y:1,z:1,ease: Back.easeOut.config(1.7), onStart:()=>{
		cactusP.children[index].visible = true;
	} } );
}

function createWaterAnimation( ringEmitters ) {
	for(let i=0; i<ringEmitters.length; i++){
		let e = ringEmitters[i];
		// console.log(e_velocity);

		let tl = new TimelineMax({repeat: -1, yoyo: true, repeatDelay: 2});
	    tl.to( [e.velocity.value], 0, { y: toValue, onCompleteParams:[i], onComplete: (i)=>{
				ringEmitters[i].velocity.value = e_velocity;
			} })
			.to( e_velocity, 0, { endArray: [0,0,0,0,1,0], onComplete: (i)=>{
				ringEmitters[i].velocity.value = e_velocity;
			} })
			.to( e_velocity, 0, { endArray: [0,0,0,0,0,1], onComplete: (i)=>{
				ringEmitters[i].velocity.value = e_velocity;
			} });
	    
	    waterAnimationLines.push(tl)
	}
}

function completeSequenceSetup() {
    for(let i=0; i<sequenceConfig.length; i++){
        sequenceConfig[i].performed = false;
    }
}

function daytimeChange( isDayTime ) {
	if(isDayTime){
		TweenMax.to( hemiLight.color, 2, { r:0.976, g:1, b:0.569 } );
		TweenMax.to( hemiLight.groundColor, 2, { r:0.227, g:0.773, b:0.725 } );
	} else {
		TweenMax.to( hemiLight.color, 2, { r:0.078, g:0.29, b:0.404 } );
		TweenMax.to( hemiLight.groundColor, 2, { r:0.322, g:0.063, b:0.231 } );
	}
	

	// ( 0xf9ff91, 0x3ac5b9, 1); // daytime (97.6, 100, 56.9), (22.7, 77.3, 72.5)
	// 	hemiLight = new THREE.HemisphereLight( 0x144a67, 0x522710, 1) // nightTime (7.8, 29, 40.4), (32.2, 15.3, 6.3)
	// 52103b, (32.2, 6.3, 23.1)
}

function geoFindMe() {
	if(!navigator.geolocation){
		console.log("Geolocation is not supported by your browser");
		return;
	}

	function success(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log("geolocation - latitude: " + latitude + ", longitude: " + longitude);
	}

	function error(){
		console.log("Unable to retrieve your location");
	}

	navigator.geolocation.getCurrentPosition(success, error)
}

function createHeart( fromIndex, toIndex ) {
	// Needs: camera position, camera direction

	var position_from = dailyLifePlayerDict[ fromIndex ].player.position.clone();
	var position_to = dailyLifePlayerDict[ toIndex ].player.position.clone();

	position_to.subVectors( position_to, position_from ).multiplyScalar(4/6).add( position_from );
	// position_to = dailyLifePlayerDict[ fromIndex ].player.worldToLocal( position_to );

	var shootT = position_from.distanceTo( position_to );

	// var poopH = poopHeart.clone();
	// poopH.scale.set(0.5,0.5,0.5);
	// poopH.position.copy( dailyLifePlayerDict[ fromIndex ].player.position );
	// poopH.lookAt( dailyLifePlayerDict[ toIndex ].player.position );
	// scene.add(poopH);

	// var mHOut = new TWEEN.Tween(poopH.position)
	// 			.to( {x: position_to.x,
	// 				  y: position_to.y-1,
	// 				  z: position_to.z}, Math.floor(shootT)*400 )
	// 			.easing( TWEEN.Easing.Quadratic.InOut );

	// var mHGone = new TWEEN.Tween(poopH.scale)
	// 			.to( {x: 0.01, y: 0.01, z: 0.01}, 1000 )
	// 			.easing( TWEEN.Easing.Elastic.In )
	// 			.onComplete(function(){
	// 				scene.remove(poopH);
	// 			});

	// mHOut.chain(mHGone);
	// mHOut.start();

	// sample.trigger( 4, 1 );

	console.log("send heart from " + fromIndex + " to " + toIndex);
}

function myKeyPressed( event ){
	if(keyIsPressed)	return;
	keyIsPressed = true;

	switch ( event.keyCode ) {

		case 49: //1
			firstGuy.chew();
			break;

		case 50: //2
			secGuy.chew();
			break;

		case 51: //3
			thirdGuy.chew();
			break;

		case 52: //4
			fourthGuy.chew();
			break;

		case 53: //5 --> day time
			daytimeChange( 1 );
			break;

		case 54: //6 --> night time
			daytimeChange( 0 );
			break;

		case 55: //7 --> mouth close
			TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [1] });
			TweenMax.to( hemiLight, .8, {intensity: 0});
			break;

		case 56: //8 --> mouth open
			TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [0] });
			TweenMax.to( hemiLight, .8, {intensity: 0.8});
			break;
	}
}

function CloseMouth(){
	TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [1] });
	TweenMax.to( hemiLight, .8, {intensity: 0});
}

function OpenMouth(){
	TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [0] });
	TweenMax.to( hemiLight, .8, {intensity: 0.8});
}

function myKeyUp(event){
	keyIsPressed = false;
}

let currentSequence;
function startEvent() {
	console.log("start event!");
    currentSequence = sequenceConfig.slice(0);
    nextAnim = currentSequence.shift();
}

function updateVideoTime(time) {
    if (nextAnim && time >= nextAnim.time) {
        console.log("do anim sequence ", nextAnim);
        nextAnim.anim();

        if (currentSequence.length > 0) {
            nextAnim = currentSequence.shift();
        } else {
            nextAnim = null;
        }
    }
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

	controls.update( Date.now() - time );

	var dt = clock.getDelta();

	// eyeRay!
		var directionCam = controls.getDirection(1).clone();
		eyerayCaster.set( controls.position().clone(), directionCam );
		eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if( eyeIntersects.length > 0 ){
			// var iName = eyeIntersects[ 0 ].object.name;
			// iName = iName.split(" ");
			// if(iName.length==2){
			// 	lookingAtSomeone = iName[0];
			// } else {
			// 	lookingAtSomeone = -1;
			// }
		} else {
			// lookingAtSomeone = -1;
		}		

	// if(truck.children.length>0){
	// 	var curtainNum = (sinWave.run()+1)/2;
	// 	truck.children[1].morphTargetInfluences[0] = curtainNum;
	// }

	if(lanternGroup.children.length>0){
		for(var i=0; i<lanternGroup.children.length; i++){
			var lanternRun = sinWaves[i].run()/10;
			lanternGroup.children[i].rotation.x = lanternRun;
			lanternGroup.children[i].rotation.z = lanternRun;
		}
	}

	updateVideoTime( (time-initTime)/1000 );

	//
	time = Date.now();
}

function render() 
{	
	effect.render(scene, camera);
}

function removePlayer(playerID){
	if(dailyLifePlayerDict[playerID]){
		scene.remove( dailyLifePlayerDict[playerID].player );
		//
		delete dailyLifePlayerDict[playerID];
	}
}

function changeAni ( aniIndex ) {

	animOffset = animOffsetSet[ aniIndex ];
	keyframe = animOffsetSet[ aniIndex ];
	currentKeyframe = keyframe;
	keyduration = keyframeSet[ aniIndex ];
	aniStep = 0;
}

function UpdatePplCount( thisWorldCount, totalCount, totalVisit ) {
	if(bathroom.visible) return;

	pplCountTex.clear().drawText("Pooper", undefined, 100, 'white');
	pplCountTex.drawText("Counter", undefined, 250, 'white');
	pplCountTex.drawText("this world: " + thisWorldCount, undefined, 400, 'white');
	pplCountTex.drawText("current: " + totalCount, undefined, 550, 'white');
	pplCountTex.drawText("visited: " + totalVisit, undefined, 700, 'white');
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
