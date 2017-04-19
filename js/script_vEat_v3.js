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

var myStartX = 0, myStartZ = 10, myStartY = 3.5; //y: 3.5, 100
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
	var guyBodyGeo, guyLAGeo, guyRAGeo, guyHeadGeo;
	var player, playerBody, playerHead;
	var firstPlayer, secondPlayer;
	var firstGuy, firstGuyBody, firstGuyHead, secondGuy, secondGuyBody, secondGuyHead;
	var fGuyHandHigh = false, sGuyHandHigh = false;
	var bodyGeo;
	var dailyLifeME, colorME, dailyLifePlayers = [];
	var dailyLifePlayerDict = {};

	var poop, poopGeo, poopTex, poopMat, poopHat, poopHeartTex;
	var poopM, poopMGeo, poopMTex, poopMMat, poopHeartGeo, poopHeartMat, poopHeart;

	var vecZ = new THREE.Vector3(0,0,1);
	var vecY = new THREE.Vector3(0,-1,0);

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

// STAR
	var star, starMat, glowTexture, glowTextures = [], starAnimator, starAnimators = [], stars = [];
	var starFiles = [ basedURL + "images/sStar_1.png", basedURL + "images/sStar_2.png",
					  basedURL + "images/sStar_3.png", basedURL + "images/sStar_4.png" ];

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
	var highChair, highChairMat, stomach, stomachTex;
	var table;
	var chewerA, chewerB, chewerC, chewerD, chewerTextures = [], chewers = [];
	var mealTimeIndex = 2;

	var mouth, mouthClosed = false;
	var looptime = 40 * 1000, monsterPath, monsterPathTube;
	var m_binormal = new THREE.Vector3();
	var m_normal = new THREE.Vector3(0,1,0);
	var intros = {}, introRoom, introRoomObject = {};

	var monsterSpeedMultiplier = 5;
	var monster, monsterTimeline, chopPosDummy, chopPosVector, monsterArmMoving = false, landInMonster = false;
	var m_chopL, m_chopR, m_arm_down, m_arm, m_m_open, m_m_close, m_m_openWide, m_snore, m_bowl;

	var tablePositions = [];
	var worldTotal = 18, eaterPerTable = 6, tableAmount = 3;

	var toUpdateCount = 0;

	var foodShaderMat, foodShaderMat_uniforms, foodShaderMat_attributes;

////////////////////////////////////////////////////////////

superInit();			// init automatically

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit(){

	myColor = new THREE.Color();

	//Prevent scrolling for Mobile
	noScrolling = function(event){
		event.preventDefault();
	};

	// GeoFindMe();

	// HOWLER
		// sound_forest = new Howl({
		// 	urls: ['../audios/duet/nightForest.mp3'],
		// 	loop: true,
		// 	volume: 0.2
		// });

	time = Date.now();

	var d = new Date();
	var n = d.getHours();

	if(n>5 && n<11)
	{
		console.log("it's breakfast time!");
		mealTimeIndex = 0;
	}
	else if(n>=11 && n<17)
	{
		console.log("it's lunch time!");
		mealTimeIndex = 1;
	}
	else
	{
		console.log("it's dinner time!");
		mealTimeIndex = 2;
	}

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
		light.position.set( 100, 100, -100);
		light.intensity = 0.3;
		scene.add(light);

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

	// RAYCASTER!
		eyerayCaster = new THREE.Raycaster();	

	// Sinwave
		sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

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
		START LOADING	                                                          
	*/
	//////////////////////////////////////////////////////////////////////////////////////////

	loadingManger = new THREE.LoadingManager();
	loadingManger.onProgress = function ( item, loaded, total ) {
	    // console.log( item, loaded, total );
	    var loadingPercentage = Math.floor(loaded/total*100);
	    loadingTxt.innerHTML = "loading " + loadingPercentage +"%";
	    // console.log("loading " + loadingPercentage +"%");
	};

	loadingManger.onError = function(err) {
		console.log(err);
	};

	loadingManger.onLoad = function () {

		if(mealTimeIndex == 2)
		{
		    CreateStars();
		}

	    CreateMonster();

	    console.log("ALL LOADED!");
		startLink.style.display = "";
		loadingImg.style.display = "none";
		loadingTxt.style.display = "none";
		readyToStart = true;
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

	loadModelMonster( basedURL + "models/monster/m_chopL.json",
					  basedURL + "models/monster/m_chopR.json",
					  basedURL + "models/monster/m_arm_down.json",
					  basedURL + "models/monster/m_arm.json",  
					  basedURL + "models/monster/m_m_snore.json",
					  basedURL + "models/monster/m_m_open.json",
					  basedURL + "models/monster/m_m_close.json",
					  basedURL + "models/monster/m_m_openWide.json",
					  basedURL + "models/monster/m_bowl.json" );

	for(var i=0; i<tableAmount; i++){
		var t_pos = new THREE.Vector3(
			Math.sin(Math.PI*2/tableAmount * i)*12 - 10,
			0,
			Math.cos(Math.PI*2/tableAmount * i)*12 - 10
		);
		tablePositions.push(t_pos);
	}

	modelLoader.load( basedURL+"models/table.json", function( geometry ) {
		table = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xff4e7b}) );
		var s_table = table.clone();
		table.scale.multiplyScalar(2);
		s_table.position.y -= 1;
		// s_table.scale.multiplyScalar(0.7);
		table.add(s_table);

		for(var i=0; i<tableAmount; i++){
			var newT = table.clone();
			newT.position.copy( tablePositions[i] );
			scene.add( newT );
		}
	} );	

	highChairMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	loadModelHighChair( basedURL + "models/highChair/hc_chair.json",
						basedURL + "models/highChair/hc_table.json",
						basedURL + "models/highChair/hc_stuff.json",
						basedURL + "models/highChair/hc_smallPlate.json",
						basedURL + "models/highChair/hc_bigPlate.json" );

	stomachTex = textureLoader.load( basedURL + '/images/stomach.jpg' );
	loadSitModelPlayer( basedURL + "models/personHead.js",
						// basedURL + "models/personBody.js",
						basedURL + "models/chewers/body.json",
						basedURL + "models/stomach_empty.json",
						basedURL + "models/stomach_full.json");

	loadModelChewers( basedURL + "models/chewers/chewerA_1.json", basedURL + "models/chewers/chewerA_2.json", basedURL + "models/chewers/chewerA_3.json",
		              basedURL + "models/chewers/chewerB_1.json", basedURL + "models/chewers/chewerB_2.json",
		              basedURL + "models/chewers/chewerC_1.json", basedURL + "models/chewers/chewerC_2.json", basedURL + "models/chewers/chewerC_3.json",
		              basedURL + "models/chewers/chewerD_1.json", basedURL + "models/chewers/chewerD_2.json" );

	chewerTextures[0] = textureLoader.load( basedURL + '/images/dude0.jpg' );
	chewerTextures[1] = textureLoader.load( basedURL + '/images/dude1.jpg' );
	chewerTextures[2] = textureLoader.load( basedURL + '/images/dude2.jpg' );
	chewerTextures[3] = textureLoader.load( basedURL + '/images/dude3.jpg' );

	// line for monster
	var curveE = new THREE.EllipseCurve(
		0,0,
		500, 1000,
		0, Math.PI*2,
		false,
		0
	);
	var curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3( -250, 10, 500 ),
		new THREE.Vector3( -250, 10, -500 ),
		new THREE.Vector3( 250, 10, -500 ),
		new THREE.Vector3( 250, 10, 500 )
	]);
	curve.type = 'catmullrom';
	curve.closed = true;
	// var curve_path = new THREE.Path(curve.getPoints(50));
	// var curve_geometry = curve_path.createPointsGeometry(50);
	// var curve_mat = new THREE.LineBasicMaterial({color: 0xff0000});
	// var ellipse = new THREE.Line(curve_geometry, curve_mat);
	monsterPath = new THREE.TubeGeometry(curve, 50, 2, 4, true);
	monsterPathTube = new THREE.Mesh(monsterPath, new THREE.MeshBasicMaterial({color: 0xff0000}));
	scene.add(monsterPathTube);

	modelLoader.load( basedURL+"models/mouth_open2.json", function( geometry2 ) {
		var mouthOpen = geometry2;

		modelLoader.load( basedURL+"models/mouth_openW.json", function( geometry4 ) {
			var mouthOpenW = geometry4;

			modelLoader.load( basedURL+"models/mouth_close2.json", function( geometry3 ) {
				var mouthClose = geometry3;
				mouthOpen.morphTargets.push({name: 'm1', vertices: mouthClose.vertices});
				mouthOpen.morphTargets.push({name: 'm2', vertices: mouthOpenW.vertices});
				mouthOpen.computeMorphNormals();

				mouth = new THREE.Mesh( mouthOpen, new THREE.MeshLambertMaterial({color: 0xe9ceda, morphTargets: true, side: THREE.DoubleSide}) );
				mouth.scale.multiplyScalar(2);
				mouth.position.y = -1.8;
				// scene.add( mouth );

				// var staticMouth = mouth.clone();
				// scene.add( staticMouth );
			} );
		} );
	} );

	LoadTexModelPoopHeart( basedURL + 'images/poopHeart.jpg', basedURL + 'models/poopHeart.js' );

	LoadStarTexture();

	var introFiles = [ basedURL+"models/intro/intro_front.json", basedURL+"models/intro/intro_back.json",
	                   basedURL+"models/intro/intro_leftW.json", basedURL+"models/intro/intro_right.json",
	                   basedURL+"models/intro/intro_down.json" ];
	introRoom = new THREE.Object3D();

	for(let _i=0; _i<introFiles.length; _i++){
		modelLoader.load( introFiles[_i], function( geometry ) {
			var intro = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide}) );
			intro.introIndex = _i;
			if(_i==4){
				var roomLight = new THREE.PointLight( 0xffef9d, 1, 10 );
				roomLight.position.set(0,7,-1);
				intro.add(roomLight);
			}
			introRoom.add( intro );
			introRoomObject[_i] = intro;
		} );
		scene.add(introRoom);
	}

	var steakTex = textureLoader.load( basedURL + '/images/steak.jpg' );

	foodShaderMat_uniforms = {
		amplitude: { type: 'f', value: 0.2 },
		time: { type: 'f', value: 0 },
		textureImg: { type: 't', value: steakTex },
		direction: { type: 'f', value: 1.0 }
	};

	foodShaderMat_uniforms2 = {
		amplitude: { type: 'f', value: 0.2 },
		time: { type: 'f', value: 0 },
		textureImg: { type: 't', value: steakTex },
		direction: { type: 'f', value: -1.0 }
	};

	// one per vertex
	foodShaderMat_attributes = {
		displacement: { tyep: 'f', value: [] }
	};

	var v_shader = document.getElementById('food_vs').textContent;
	var f_shader = document.getElementById('food_fs').textContent;
	var f_tex_shader = document.getElementById('food_tex_fs').textContent;

	modelLoader.load( basedURL + "models/avocado3.json", function(geo, mat){

		// === SHADER_STUFF
			var verts = geo.vertices;
			var values = foodShaderMat_attributes.displacement.value;

		// === END_OF_SHADER_STUFF
		var vc_mat = new THREE.ShaderMaterial( {
			uniforms: foodShaderMat_uniforms,
			vertexShader: v_shader,
			fragmentShader: f_shader,
			vertexColors: THREE.VertexColors,
			side: THREE.DoubleSide
		} );
		avocado = new THREE.Mesh( geo, vc_mat );
		avocado.scale.multiplyScalar(.5);
		avocado.position.set(10,.5,0);		
		scene.add(avocado);
	} );

	modelLoader.load( basedURL + "models/steak.json", function(geo, mat){

		var vc_mat = new THREE.ShaderMaterial( {
			uniforms: foodShaderMat_uniforms2,
			vertexShader: v_shader,
			fragmentShader: f_tex_shader,
			vertexColors: THREE.VertexColors,
			side: THREE.DoubleSide
		} );
		steak = new THREE.Mesh( geo, vc_mat );
		steak.scale.multiplyScalar(0.5);
		steak.position.set(10,0.5,3);		
		scene.add(steak);
	} );

	//=========================================================================
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
		connectSocket();

	// => moved to be after_Get_Name_To_Start
	// lateInit(); 
}

function AssignIndex() {
	// console.log("whoIamInLife: " + whoIamInLife);

	// Assign position
	// meInWorld = Math.floor(whoIamInLife/18);			// which world
	meInBGroup = Math.floor(( (whoIamInLife-1)%worldTotal ) / eaterPerTable);		// which table (0~2)
	meInSGroup = ( (whoIamInLife-1)%worldTotal ) % eaterPerTable;					// which seat of the table (0~5)
	myWorldCenter = tablePositions[meInBGroup].clone();

	myStartX = Math.sin(Math.PI*2/eaterPerTable * meInSGroup)*2.5 + myWorldCenter.x;
	myStartZ = Math.cos(Math.PI*2/eaterPerTable * meInSGroup)*2.5 + myWorldCenter.z;
	
	if(DL_configs.skipIntro)
	{		
		myPosition = new THREE.Vector3( myStartX, myStartY, myStartZ );
	}
	else
	{	
		// start in monster's mouth
		//{x: 144, y: -37.5, z: -37}
		myPosition = new THREE.Vector3( 81.81, -39, -83.8 );
	}
	
	console.log("Me in world: " + meInWorld + ", table: " + meInBGroup + ", seat: " + meInSGroup);
}

// lateInit() happens after click "Start"
function lateInit() 
{	
	// console.log("late init!");
	document.body.addEventListener('touchmove', noScrolling, false);
	window.addEventListener('keydown', myKeyPressed, false);
	window.addEventListener('keyup', myKeyUp, false);

	clock.start();

	// build me!
	// myPosition = new THREE.Vector3( myStartX, myStartY, myStartZ-5 );
	console.log(myPosition);
	firstGuy = new PersonEat( myPosition, myColor, whoIamInLife, playerNName, null );
	dailyLifePlayerDict[ whoIamInLife ] = firstGuy;

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

	if(firstGuy.parent == mouth)
		mouth.add( controls.getObject() );

	// update stuff position based on myPosition
		introRoom.position.set( myPosition.x, myPosition.y-3.5, myPosition.z );
		UpdateRotationWithMe( introRoom );
		CreateMonsterAni();


	// start to animate()!
	animate(performance ? performance.now() : Date.now());

	trulyFullyStart = true;

	// v.1
	/*
	if(!DL_configs.skipIntro){
		setTimeout(function(){
			// introRoomFall!
			TweenMax.to( introRoomObject[0].rotation, 4, { x:Math.PI/2, ease: Back.easeInOut } );
			TweenMax.to( introRoomObject[1].rotation, 4, { x:-Math.PI/2, ease: Back.easeInOut } );
			TweenMax.to( introRoomObject[2].rotation, 4, { z:-Math.PI/2, ease: Back.easeInOut } );
			TweenMax.to( introRoomObject[3].rotation, 4, { z:Math.PI/2, ease: Back.easeInOut } );

			setTimeout(function(){
				console.log("ahh!");

				firstGuy.player.children[0].visible = false;
				controls.setMovYAnimation( -96.5, 15 );

				setTimeout(function(){
					renderer.setClearColor(0x77edda, 1); // daytime
				}, 7000);

				setTimeout(function(){
					daytimeChange(true);
				}, 10000);

				setTimeout(function(){
					firstGuy.player.children[0].visible = true;
					firstGuy.player.children[0].children[4].visible = true;
				}, 14000);

			}, 5000);
		}, 10000);
	}
	*/

	// v.2
	if(!DL_configs.skipIntro){
		controls.movingEnabled = false;

		setTimeout(function(){
			
			DoOpenroomAni();

		}, 10000);
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

function GeoFindMe() {
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

// TO-DO: pooling the poop heart instead of creating new one
function createHeart( fromIndex, toIndex ) {
	// Needs: camera position, camera direction

	var position_from = dailyLifePlayerDict[ fromIndex ].player.position.clone();
	var position_to = dailyLifePlayerDict[ toIndex ].player.position.clone();
	position_to.subVectors( position_to, position_from ).multiplyScalar(4/6).add( position_from );

	var shootT = position_from.distanceTo( position_to );

	var poopH = poopHeart.clone();
	poopH.scale.set(0.5,0.5,0.5);
	poopH.position.copy( dailyLifePlayerDict[ fromIndex ].player.position );
	poopH.lookAt( dailyLifePlayerDict[ toIndex ].player.position );
	scene.add(poopH);

	TweenMax.to( poopH.position, Math.floor(shootT)*0.4,
					{ x: position_to.x,
					  y: position_to.y-1,
					  z: position_to.z, ease: Power1.easeInOut, onComplete:()=>{
					  	
					  	TweenMax.to( poopH.scale, 1,
							{ x: 0.01,
							  y: 0.01,
							  z: 0.01, ease: Back.easeIn, onComplete: ()=>{
							  	scene.remove(poopH);
							  } });
					  } } );

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
			CloseMouth();
			break;

		case 56: //8 --> mouth open
			OpenMouth();
			break;

		case 57: //9 --> mouth wide open
			OpenMouthWide();
			break;
	}
}

function CloseMouth(){
	TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [1,0] });
	TweenMax.to( hemiLight, 1, {intensity: 0, delay: 0.5});
}

function OpenMouth(){
	TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [0,0] });
	TweenMax.to( hemiLight, .8, {intensity: 0.8});
}

function OpenMouthWide(){
	TweenMax.to( mouth.morphTargetInfluences, 2, { endArray: [0,1] });
	TweenMax.to( hemiLight, .8, {intensity: 1});
}

function myKeyUp(event){
	keyIsPressed = false;
}

function AnimateMonster(time) {
	// ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html
	// var time = Date.now();
	var looptime = 40 * 1000;
	var t = ( time % looptime ) / looptime;
	var pos = monsterPath.parameters.path.getPointAt( t );
	// interpolation
	var segments = monsterPath.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;
	m_binormal.subVectors( monsterPath.binormals[ pickNext ], monsterPath.binormals[ pick ] );
	m_binormal.multiplyScalar( pickt - pick ).add( monsterPath.binormals[ pick ] );
	var dir = monsterPath.parameters.path.getTangentAt( t );
	var offset = 5;
	//m_normal.copy( m_binormal ).cross( dir );
	// We move on a offset on its binormal
	//pos.add( m_normal.clone().multiplyScalar( offset ) );
	mouth.position.copy( pos );
	// Using arclength for stablization in look ahead.
	var lookAt = monsterPath.parameters.path.getPointAt( ( t + 10 / monsterPath.parameters.path.getLength() ) % 1 );
	mouth.matrix.lookAt(mouth.position, lookAt, m_normal);
	mouth.rotation.setFromRotationMatrix( mouth.matrix, mouth.rotation.order );
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
	// TWEEN.update();
	//controls.update( Date.now() - time );
	
	var dt = clock.getDelta();

	controls.update( dt*1000 );

	// SHADER
		foodShaderMat_uniforms.time.value += dt;
		foodShaderMat_uniforms2.time.value += dt;

	// STAR
	if(starAnimators.length>0){
		for(var i=0; i<starAnimators.length; i++){
			starAnimators[i].updateLaura( 300*dt );
		}
	}

	// eyeRay!
		var directionCam = controls.getDirection(1).clone();
		eyerayCaster.set( controls.position().clone(), directionCam );
		eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if( eyeIntersects.length > 0 ){
			var iName = eyeIntersects[ 0 ].object.name;
			iName = iName.split(" ");
			if(iName.length==2){
				lookingAtSomeone = iName[0];
			} else {
				lookingAtSomeone = -1;
			}

			// if ( eyeIntersects[ 0 ].object == flushHandler ){
			// 	// ...
			// }

			// if ( eyeIntersects.length > 1 ) {
				// if(eyeIntersects[ 1 ].object.name == "miniPoop"){
				// 	// console.log("See mini poop!");
				// 	lookAtMiniPoop = true;
				// } else {
				// 	lookAtMiniPoop = false;
				// }
			// }
		} else {
			lookingAtSomeone = -1;
		}		

	if(truck.children.length>0){
		var curtainNum = (sinWave.run()+1)/2;
		truck.children[7].morphTargetInfluences[0] = curtainNum;
	}

	if(lanternGroup.children.length>0){
		for(var i=0; i<lanternGroup.children.length; i++){
			var lanternRun = sinWaves[i].run()/10;
			lanternGroup.children[i].rotation.x = lanternRun;
			lanternGroup.children[i].rotation.z = lanternRun;
		}
	}

	//AnimateMonster(time);

	// === OPENING ===
	if(controls.yawObject != null && monsterArmMoving)
	{
		// get the world position of dummy
		chopPosDummy.getWorldPosition( chopPosVector );

		// update firstGuy.player to it
		controls.yawObject.position.lerp( chopPosVector, 0.1 );
		// firstGuy.player.position.lerp( chopPosVector, 0.1 );
	}

	// Update all the players
	for( var p in dailyLifePlayerDict )
	{
		if(p != whoIamInLife)
			dailyLifePlayerDict[p].transUpdate();
	}

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

function DoOpenroomAni()
{
	TweenMax.to( introRoomObject[0].rotation, 4, { x:Math.PI/2, ease: Back.easeInOut } );
	TweenMax.to( introRoomObject[1].rotation, 4, { x:-Math.PI/2, ease: Back.easeInOut } );
	TweenMax.to( introRoomObject[2].rotation, 4, { z:-Math.PI/2, ease: Back.easeInOut } );
	TweenMax.to( introRoomObject[3].rotation, 4, { z:Math.PI/2, ease: Back.easeInOut } );

	setTimeout( PlayMonsterAni );
}

function CreateMonsterAni()
{
	monsterTimeline = new TimelineMax({ onComplete:()=>{
		if(!landInMonster){
			monsterTimeline.removeCallback( DropCallBack, "drop" );
			monsterTimeline.removeCallback( UpCallback, "up" );
			landInMonster = true;
		}		
	} });

	monsterTimeline.add( "chop", "+=1" );
	monsterTimeline.add( 
		[
			// TweenMax.to( monster.children[0].children[1].children[0].rotation, 0.5, {y:-0.05, delay: 1.5} ),
			TweenMax.to( monster.children[0].children[1].children[1].rotation, 0.5*monsterSpeedMultiplier, {y:0.1, delay: 2.5*monsterSpeedMultiplier, ease: Power1.easeInOut} ),
			TweenMax.to( monster.children[0].rotation, 2*monsterSpeedMultiplier, {y:35*Math.PI/180} ),
			TweenMax.to( monster.children[0].rotation, .5*monsterSpeedMultiplier, {x:10*Math.PI/180, z:10*Math.PI/180, repeat: 1, repeatDelay: 1*monsterSpeedMultiplier, yoyo: true} )
		],
		"chop" );

	monsterTimeline.add( "up", "+=2" );
	monsterTimeline.add( [
			TweenMax.to( monster.children[0].rotation, 3*monsterSpeedMultiplier, {x:50*Math.PI/180, y:35*Math.PI/180, z:-10*Math.PI/180, ease: Power1.easeInOut} ), //40,35,20
			TweenMax.to( monster.children[0].children[1].rotation, 3*monsterSpeedMultiplier, {x:-7*Math.PI/180, y:-4*Math.PI/180, z:-20*Math.PI/180, ease: Power1.easeInOut} )
		], "up" );

	monsterTimeline.add( "in", "+=3" );
	monsterTimeline.add( TweenMax.to( monster.children[0].children[1].rotation, 4*monsterSpeedMultiplier, {y:90*Math.PI/180, z:-10*Math.PI/180, ease: Power1.easeInOut} ), "in" );

	monsterTimeline.add( "drop", "+=1" );
	monsterTimeline.add(
		[
			//TweenMax.to( monster.children[0].children[1].children[0].rotation, 0.5, {y:0.05} ),
			TweenMax.to( monster.children[0].children[1].children[1].rotation, 0.5*monsterSpeedMultiplier, {y:-0.1, ease: Power1.easeInOut} ),			
		]
		, "drop" );

	monsterTimeline.addCallback( UpCallback, "up" );
	monsterTimeline.addCallback( DropCallBack, "drop" );

	monsterTimeline.pause();
}

function DropCallBack()
{
	monsterArmMoving = false;

	// fall
	TweenMax.to( controls.yawObject.position, 3, {y:3.7, delay: 0.5} )
	// to table
	TweenMax.to( controls.yawObject.position, 6, {x: myStartX, z: myStartZ, delay: 4.5, onComplete:()=>{
		controls.movingEnabled = true;

		monsterTimeline.reverse();
		
	}} );
}

function UpCallback()
{
	monsterArmMoving = true;
	//controls.movingEnabled = false;
}

function PlayMonsterAni()
{
	Attach(chopPosDummy, scene, monster.children[0].children[1].children[0]);
	monsterTimeline.play();
}

function Detach ( child, parent, scene ) {
	scene.add( child );
    child.applyMatrix( parent.matrixWorld );    
}	

function Attach ( child, scene, parent ) {
	parent.add( child );
    var matrixWorldInverse = new THREE.Matrix4();
    matrixWorldInverse.getInverse( parent.matrixWorld );
    child.applyMatrix( matrixWorldInverse );    
}

function UpdatePplCount( thisWorldCount, totalCount, totalVisit ) {
	if(bathroom.visible) return;

	pplCountTex.clear().drawText("Pooper", undefined, 100, 'white');
	pplCountTex.drawText("Counter", undefined, 250, 'white');
	pplCountTex.drawText("this world: " + thisWorldCount, undefined, 400, 'white');
	pplCountTex.drawText("current: " + totalCount, undefined, 550, 'white');
	pplCountTex.drawText("visited: " + totalVisit, undefined, 700, 'white');
}

function LoadStarTexture() {
	var textureLoader = new THREE.TextureLoader( loadingManger );
	
	for(var i=0; i<starFiles.length; i++){
		textureLoader.load( starFiles[i], function(texture){
			glowTexture = texture;
			glowTextures.push(glowTexture);
			starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
			starAnimators.push(starAnimator);
		} );
	}	
}

function LoadTexModelPoopHeart( _tex, _model ){
	var h_texLoader = new THREE.TextureLoader( loadingManger );
	// h_texLoader.load(_tex, function(texture){
		// poopHeartTex = texture;
		// poopHeartMat = new THREE.MeshLambertMaterial({map: poopHeartTex});
		poopHeartTex = h_texLoader.load(_tex);
		poopHeartMat = new THREE.MeshLambertMaterial({map: poopHeartTex});
		
		// MODEL_BODY
		var h_loader = new THREE.JSONLoader( loadingManger );
		h_loader.load( _model, function( geometry ){
			poopHeartGeo = geometry.clone();
			// poopHeartGeo.computeBoundingSphere();

			poopHeart = new THREE.Mesh(poopHeartGeo, poopHeartMat);

			// then create person!

			// loadingCountText("poop heart");
		});
	// });
}

function CreateStars() {
	for(var i=0; i<50; i++){
		mat = new THREE.SpriteMaterial({map: glowTextures[i%4], color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		var st = new THREE.Sprite(mat);
		st.position.set( Math.random()*(myStartX+400)-(myStartX+200), Math.random()*-100+400, Math.random()*(myStartZ+400)-(myStartZ+200) );
		st.rotation.y = Math.random()*Math.PI;
		st.scale.set(7,7,7);
		scene.add(st);
		stars.push(st);
	}
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
