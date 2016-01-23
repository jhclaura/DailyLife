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

	var person, personGeo, personMat;
	var keyframe, lastKeyframe, currentKeyframe;
	var animOffset = 1, keyduration = 28;
	var aniStep = 0, aniTime = 0, slowAni = 0.4;
	var keyframeSet =   [ 28, 15,  1,  8,  1, 12, 10 ];
	var animOffsetSet = [  1, 30, 48, 50, 58, 60, 72 ];	//2: sit freeze; 4: push freeze
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

// init();		// Init after the CONNECTION thing
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

	// EFFECT
		// effect = new THREE.StereoEffect(renderer);
		// effect.seperation = 0.2;
		// effect.targetDistance = 50;
		// effect.setSize(window.innerWidth, window.innerHeight);

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
		eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

		// skinTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
		var loader = new THREE.TextureLoader();
		loader.load('images/guyW.png', function(texture){
			skinTexture = texture;
			loadModelPlayer( "models/Guy2/GuyB.js", "models/Guy2/GuyLA.js", "models/Guy2/GuyRA.js", "models/Guy2/GuyH.js" );
		});

	// TREE
		treeTexture = THREE.ImageUtils.loadTexture('images/tree.png');
		treeMat = new THREE.MeshLambertMaterial({map: treeTexture});
		loader = new THREE.JSONLoader();
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

	// PERSON 
		loader.load( "models/person2.js", function( geometry ) {
			personTex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
			person = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: personTex, morphTargets: true } ) );
			person.position.x = -15;
			person.updateMorphTargets();
			scene.add( person );
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
	window.addEventListener('click', fullscreen, false);
	window.addEventListener('click', startSpeech, false);
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
}

function init() 
{	
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
		firstGuy = createPlayer( myPosition, videos[0], myColor, whoIamInLife, peer_id );
		dailyLifePlayers.push(firstGuy);
		// secondGuy = createPlayer( new THREE.Vector3(0,0,-3), yourMat );
		// dailyLifePlayers.push(secondGuy);
	},500);

	// CONTROLS
	// controls = new THREE.OrbitControls( camera, renderer.domElement );

	//
	animate();	
}

function myKeyPressed( event ){
	switch ( event.keyCode ) {

		case 49: //1 --> walk
			changeAni( 0 );
			break;

		case 50: //2 --> sit down
			changeAni( 1 );
			break;

		case 51: //3 --> push
			changeAni( 3 );
			break;

		case 52: //4 --> release
			changeAni( 5 );
			break;

		case 53: //5 --> stand up
			changeAni( 6 );
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

var pBody, pLA, pRA, pHead, pScreen, pMat, pColor;

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
	for(var i=0; i<dailyLifeMurmurs.length; i++){
		var indexxx = ""+dailyLifePlayers[i].whoIam;
		
		// var line = "";
  //       var words = dailyLifeMurmurs[i].split(" ");

  //       for (var n = 0; n < words.length; n++) {
  //           var testLine = line + words[n] + " ";
  //           var metrics = wordContext.measureText(testLine);
  //           var testWidth = metrics.width;

  //           if (testWidth > maxWidth) {
  //               context.fillText(line, x, y);
  //               line = words[n] + " ";
  //               y += lineHeight;
  //           }
  //           else {
  //               line = testLine;
  //           }
  //       }

  //       context.fillText(line, x, y);
  //       y += lineHeight;

		dailyLifeMurmurs[i].clear('cyan').drawText(allTheMurmur[indexxx], undefined, 200, 'red');
	}

	// WEB_CAM
	for(var i=0; i<videos.length; i++){
		if(videos[i].video.readyState === videos[i].video.HAVE_ENOUGH_DATA){
			videos[i].videoImageContext.drawImage(videos[i].video, 0, 0, videoWidth, videoHeight);

			if(videos[i].videoTexture){
				videos[i].videoTexture.flipY = true;
				videos[i].videoTexture.needsUpdate = true;
			}
		}
	}

	controls.update( Date.now() - time );
	stats.update();

	// PERSON_ANIMATION
		if(person){
			aniStep++;

			aniTime = aniStep * slowAni % (keyduration+1);
			keyframe = Math.floor( aniTime ) + animOffset;
			// 	console.log("keyframe: " + keyframeMon[i]);

			//
			if ( keyframe != currentKeyframe ) {
				person.morphTargetInfluences[ lastKeyframe ] = 0;
				person.morphTargetInfluences[ currentKeyframe ] = 1;
				person.morphTargetInfluences[ keyframe ] = 0;

				lastKeyframe = currentKeyframe;
				currentKeyframe = keyframe;
			}

			// end of standUp, start to walk
			if ( keyframe == (animOffsetSet[6]+keyframeSet[6]-1) ) {
				changeAni( 0 );
			}
			// end of sit down, sit freeze
			if ( keyframe == (animOffsetSet[1]+keyframeSet[1]-1) ) {
				changeAni( 2 );
			}
			// end of push, push freeze
			if ( keyframe == (animOffsetSet[3]+keyframeSet[3]-1) ) {
				changeAni( 4 );
			}
			// end of release, sit freeze
			if ( keyframe == (animOffsetSet[5]+keyframeSet[5]-1) ) {
				changeAni( 2 );
			}
		}
	
	time = Date.now();
}

function render() 
{	
	renderer.render( scene, camera );
	// VR
		// effect.render(scene, camera);
}

function changeAni ( aniIndex ) {

	animOffset = animOffsetSet[ aniIndex ];
	keyframe = animOffsetSet[ aniIndex ];
	currentKeyframe = keyframe;
	keyduration = keyframeSet[ aniIndex ];
	aniStep = 0;

	// animOffsetP = animOffsets[2];
	// keyframeP = animOffsets[2];
	// currentKeyframeP = keyframeP;
	// durationP = durations[2];
	// keyduration = keyframes[2];
	// interpolationP2 = durations[2] / (keyframes[2]);
	// monsAniStep = 0;
}

function updatePlayer(playerIndex, playerLocX, playerLocZ, playerRotY, playerQ){
	var dlpIndex;
	for(var i=0; i<dailyLifePlayers.length; i++){
		if(dailyLifePlayers[i].whoIam == playerIndex){
			dlpIndex = i;
			break;
		}
	}

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
	ahhRotation.y -= Math.PI;

	if(dailyLifePlayers[dlpIndex].children[0])
		dailyLifePlayers[dlpIndex].children[0].rotation.y = ahhRotation.y;
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
	// effect.setSize( window.innerWidth, window.innerHeight );
}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}
