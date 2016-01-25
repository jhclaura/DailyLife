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

var myStartX = 0, myStartZ = 0, myStartY = 0; //2
var myPosition, myStartRotY;

var model, texture;
var dummy;
var perlin = new ImprovedNoise(), noiseQuality = 1;

// WAVE
	var timeWs = [0, Math.PI/2, Math.PI, -Math.PI/2, Math.PI+0.3, -Math.PI/5, Math.PI/1.1];
	var frequencyWs = [0.02, 0.01];
	var frequencyW = 0.02, amplitudeW = 0.1, offsetW = 0;
	var sinWaves = [], cosWaves = [], tanWaves = [];
	var sinWRun = [], cosWRun = [], tanWRun = [];

// RAYCAST
	var objects = [];
	var ray;
	var projector, eyerayCaster;
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
	var poop, poopGeo, poopTex, poopMat;
	var personBody, personHead, personToilet;
	var keyframe, lastKeyframe, currentKeyframe;
	var animOffset = 1, keyduration = 28;
	var aniStep = 0, aniTime = 0, slowAni = 0.4;
	var personKeyframeSet =   [ 28, 15,  1,  8,  1, 12, 10 ];
	var personAniOffsetSet = [  1, 30, 48, 50, 58, 60, 72 ];	//2: sit freeze; 4: push freeze
	var personFreeze = false;

// TOILET_RELATED
	var t_paper0, t_paper1, t_paper2, toilet_paper;
	var bigToilet, waterwave, waterwaveTex;
	var waterSpeed, waterKeyframeSet=[17], waterAniOffsetSet=[1];
	var aniStepW=0, aniTimeW=0, slowAniW=0.3, keydurationW = 17;
	var keyframeW, animOffsetW=1, currentKeyframeW=0, lastKeyframeW=0;

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

// TREE
	var treeTexture, treeGeo, treeMat, trees = [];

// SPEECH_API
	var recognizing = false;
	var recognition;
	var myWord=" Ahhh", myWords = [];
	var myFakeWord = "FUCK";
	var wordCanvas, wordContext, wordTexture, wordMaterial, wordBubble;
	var allTheMurmur = {};
	var dailyLifeMurmurs = [];

////////////////////////////////////////////////////////////

// init();		// Init after CONNECTION
superInit();

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){
	myStartX = ( Math.random() - 0.5) * 100;
	myStartZ = ( Math.random() - 0.5) * 100;
	myPosition = new THREE.Vector3(myStartX, 0, myStartZ);
	myColor = Math.random() * 0xffffff;

	//Prevent scrolling for Mobile
	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false);

	// WEB_AUDIO_API --------------------------------------
		bufferLoader = new BufferLoader(
			audioContext, [ '../audios/duet/nightForest.mp3',
						    '../audios/duet/firecrack.mp3',
						    '../audios/duet/monsters.mp3' ], 
					  finishedLoading
		);
		bufferLoader.load();


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
		scene = new THREE.Scene();

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
		loader.load( "models/bigToilet.js", function( geometry ) {		
			bigToilet = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
			bigToilet.scale.set(1.5, 1.5, 1.5);
			bigToilet.position.y = -5;
			scene.add( bigToilet );
		} );

	// wave
		waterwaveTex = new THREE.ImageUtils.loadTexture('images/wave.png');
		loader.load( "models/waterwave.js", function( geometry ) {	
			waterwave = new AniObject( 0.3, waterKeyframeSet, waterAniOffsetSet, geometry,
									   new THREE.MeshBasicMaterial({ map: waterwaveTex, morphTargets: true, transparent: true, opacity: 0.5 }),
									   new THREE.Vector3(0,-12,3), 1.7 );
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

	// PERSON 
		personTex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
		loader.load( "models/person3.js", function( geometry ) {
			personGeo = geometry;
		});

	///////////////////////////////////////////////////////

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	//////////////////////////////////////////////////////
	
	
	// EVENTS
	// automatically resize renderer
	window.addEventListener('resize', onWindowResize, false);
	// window.addEventListener('click', startSpeech, false);
	window.addEventListener('keydown', myKeyPressed, false);

	// WORDS_CANVAS
	// v.1
	/*
	wordCanvas = document.createElement( 'canvas' );
	wordCanvas.width = 512;
	wordCanvas.height = 512;

	wordContext = wordCanvas.getContext( '2d' );
	wordContext.font = "bolder 100px StupidFont";
	wordTexture = new THREE.Texture(wordCanvas);
	*/

	// v.2 --> move inside CreatePlayer()
	// wordTexture	= new THREEx.DynamicTexture(512,512)
	// wordTexture.context.font	= "bolder 90px StupidFont";

	// wordMaterial = new THREE.MeshBasicMaterial({map: wordTexture.texture, side: THREE.DoubleSide});
	// wordMaterial.transparent = true;
	// wordBubble = new THREE.Mesh(new THREE.PlaneGeometry(wordTexture.canvas.width, wordTexture.canvas.height), wordMaterial);
	// wordBubble.scale.set(0.005,0.005,0.005);
	// wordBubble.position.x = -2;
	// wordBubble.position.y = 2;
	// scene.add(wordBubble);

	/*
	// Speech API
		if(!("webkitSpeechRecognition" in window)) {
			console.log("error: no speech api");
		} else {
			recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = "en-US";

			recognition.onstart = function() {
				recognizing = true;
			}

			recognition.onerror = function(event) {

				if(event.error == "no-speech"){
					console.log("error: no-speech");
				}
				if(event.error == "audio-capture") {
					console.log("error: audio-capture");
				}
				if(event.error == "not-allowed"){
					if(event.timeStamp - start_timestamp<100){
						console.log("error: info blocked");
					}else{
						console.log("error: info denied");
					}				
				}
			}

			recognition.onend = function(){
				recognizing = false;
				console.log("recognition.onend");
			}

			recognition.onresult = function(event){

				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if(event.results[i].isFinal){
						console.log("changed words!!");
						// final_script += event.results[i][0].transcript;
						myWord = event.results[i][0].transcript;
						myWords.push(myWord);
						// wordContext.clearRect(0,0,wordCanvas.width, wordCanvas.height);
						// wordContext.fillText(event.results[i][0].transcript, 0, 200);
						
						console.log("isFinal: " + event.results[i][0].transcript);
					} else {
						myWord = event.results[i][0].transcript;
						// interim_transcript += event.results[i][0].transcript;
						console.log(event.results[i][0].transcript);
					}

					////////////////////////////////////////////////////////////////////
					//WEB_SOCKET
						var msg = {
							'type': 'updateMurmur',
							'index': whoIamInLife,
							'murmur': myWord
						};

						if(ws){
							sendMessage( JSON.stringify(msg) );
						}
					////////////////////////////////////////////////////////////////////
				};
			}
		}
	*/
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

	window.addEventListener('click', fullscreen, false);

	// Controls
		controls = new THREE.DeviceControls(camera, true);
		scene.add( controls.getObject() );

	// MY_CAMERA
		// videoTexture = new THREE.Texture( videos[0].videoImage );
		// videoTexture.minFilter = THREE.LinearFilter;
		// videoTexture.magFilter = THREE.LinearFilter;
		// videoTexture.format = THREE.RGBFormat;
		// videoTexture.generateMipmaps = false;

		// videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
		// videoTexture.needsUpdate = true;

	// REMOTE_CAMERA
		// remoteTexture = new THREE.Texture( videos[1].videoImage );
		// remoteTexture.minFilter = THREE.LinearFilter;
		// remoteTexture.magFilter = THREE.LinearFilter;
		// remoteTexture.format = THREE.RGBFormat;
		// remoteTexture.generateMipmaps = false;

		// remoteTexture.wrapS = remoteTexture.wrapT = THREE.ClampToEdgeWrapping;
		// remoteTexture.needsUpdate = true;

		// myMat = new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide});
		// yourMat = new THREE.MeshBasicMaterial({map: remoteTexture, side: THREE.DoubleSide});

	setTimeout(function(){
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
	},500);

	// AniPerson
		personMat = new THREE.MeshLambertMaterial( { map: personTex, morphTargets: true } );
		person = new AniPerson( 0.4, personKeyframeSet, personAniOffsetSet, personGeo, personMat, new THREE.Vector3(-10,0,0), 1 );

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

function loadModelPoop( _poop ){
	loader = new THREE.JSONLoader();
	var poopStickGeo = new THREE.BoxGeometry(0.1,1,0.1);
	transY(poopStickGeo, 0.5);
	var poopStick = new THREE.Mesh( poopStickGeo, new THREE.MeshBasicMaterial({color: 0x000000}) );
	
	// BODY
	loader.load( _poop, function( geometry ){
		poopGeo = geometry.clone();
		poop = new THREE.Mesh(poopGeo, poopMat);
		// poop.rotation.y += Math.PI;
		// poop.position.y += 0.3;

		var ps_RA = poopStick.clone();
		ps_RA.position.set(0.6,0.3,0);
		ps_RA.rotation.z += Math.PI;
		poop.add(ps_RA);

		var ps_LA = poopStick.clone();
		ps_LA.position.set(-0.6,0.3,0);
		poop.add(ps_LA);

		var ps_RL = poopStick.clone();
		ps_RL.position.set(0.3,-1,0);
		poop.add(ps_RL);

		var ps_LL = poopStick.clone();
		ps_LL.position.set(-0.3,-1,0);
		poop.add(ps_LL);
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
	gainNodes[0].gain.value = 1;
	gainNodes[1].gain.value = 0.2;
	gainNodes[2].gain.value = 0;

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
	stats.update();

	// PERSON_ANIMATION
		if(person){
			person.update(null);
			person.switchAni();
		}

	if(waterwave){
		waterwave.update(null);
	}
	
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
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	if(isItVR)
		effect.setSize( window.innerWidth, window.innerHeight );
}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}
