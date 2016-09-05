/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Based on 
 * 		THREE.PointerLockControls by mrdoob
 * 		OculusRiftControls by benvanik
 * 		DeviceOrientationControls by	richt / http://richt.me
 * 										WestLangley / http://github.com/WestLangley
 * 										jonobr1 / http://jonobr1.com
 * 										arodic / http://aleksandarrodic.com
 * 										doug / http://github.com/doug
 * @author Laura / http://jhclaura.com
 */

var deviceOrientation = {};
var screenOrientation = window.orientation || 0;

var eyeFinalQ = new THREE.Quaternion();			// for screen in front of eyes
var eyeFinalQ2 = new THREE.Quaternion();		// for others
var eyeFinalQ3 = new THREE.Quaternion();		// for others & only Y axis

function onDeviceOrientationChangeEvent(evt) {
deviceOrientation = evt;
}
window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

function getOrientation() {
switch (window.screen.orientation || window.screen.mozOrientation) {
  case 'landscape-primary':
    return 90;
  case 'landscape-secondary':
    return -90;
  case 'portrait-secondary':
    return 180;
  case 'portrait-primary':
    return 0;
}
// this returns 90 if width is greater then height
// and window orientation is undefined OR 0
// if (!window.orientation && window.innerWidth > window.innerHeight)
//   return 90;
return window.orientation || 0;
}

// portrait or landscape
function onScreenOrientationChangeEvent() {
	screenOrientation = getOrientation();
}
window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);

var mouseActive = false, keyActive = false, touchActive = false;
var mouseTimeOut;
var rotatable = true;
var quaternionChanged = false;

var smoothBeta={}, smoothAlpha={}, smoothGamma={};
var betaRecordings=[], gammaRecordings=[], alphaRecordings=[];

var thisIsTouchDevice = false;
if( isTouchDevice() ) thisIsTouchDevice = true;

//
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);

//
var updatedBathroom = false;

// var myStartX = Math.random()*20, myStartZ = Math.random()*50;

THREE.DeviceControls = function ( camera, worldCenter ) {

	var scope = this;

	//
	this.getOutBathroomPosition = new THREE.Vector3();

	// Use the method of THREE.PointerLockControls
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	var yawObjectOriginal = new THREE.Object3D();

	yawObject.position.y = myStartY;
	yawObject.position.x = myStartX;
	yawObject.position.z = myStartZ;
	yawObject.add( pitchObject );

	yawObjectOriginal.position.copy(yawObject.position);

	//
	this.lookAtCenterQ = new THREE.Quaternion();
	this.worldCenter = worldCenter;

	//LOOKAT_CENTER_TWEAK SO HARD!
	// v1
		// var m1 = new THREE.Matrix4();
		// var center = new THREE.Vector3(0,yawObject.position.y,0);
		// m1.lookAt( yawObject.position, center, yawObject.up );

		// if(thisIsTouchDevice)
		// 	this.lookAtCenterQ.setFromRotationMatrix( m1 );
		// else
		// 	yawObject.quaternion.setFromRotationMatrix( m1 );

		// var checkQ = Math.abs( Math.sin( yawObject.rotation.y / 2 ) - yawObject.quaternion.y );
		
		// if( checkQ > 0.001 )
		// 	quaternionChanged = true;

	// v2
		var m1 = new THREE.Matrix4();
		var center = new THREE.Vector3(0,yawObject.position.y,0);
		// m1.lookAt( yawObject.position, center, yawObject.up );
		m1.lookAt( yawObject.position, this.worldCenter, yawObject.up );

		if (thisIsTouchDevice) {
			this.lookAtCenterQ.setFromRotationMatrix( m1 );
		} else {
			var tmpQ = new THREE.Quaternion();
			tmpQ.setFromRotationMatrix(m1);
			var tmpE = new THREE.Euler(0, 0, 0, 'YXZ');
			tmpE.setFromQuaternion(tmpQ);

			tmpE.set(0, tmpE.y, 0);
			yawObject.rotation.copy(tmpE);

			// yawObject.quaternion.setFromRotationMatrix( m1 );
		}
		// var checkQ = Math.abs( Math.sin( yawObject.rotation.y / 2 ) - yawObject.quaternion.y );
		// if( checkQ > 0.001 ){
		// 	quaternionChanged = true;
		// 	console.log("quaternion changed!");
		// }
		// playerStartRotY = yawObject.rotation.y;

	//
	var controlsEnabled = false;
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	this.moveSpeed = 0.12 / 8;
	this.jumpSpeed = 5;

	var _q1 = new THREE.Quaternion();
	var axisX = new THREE.Vector3( 1, 0, 0 );
	var axisZ = new THREE.Vector3( 0, 0, 1 );

	//TOUCH
	var touchStartLoc = new THREE.Vector2();
	var touchCurrentLoc = new THREE.Vector2();
	var touch2ndStartLoc = new THREE.Vector2();
	var touch2ndCurrentLoc = new THREE.Vector2();

	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	// WEBSOCKET
	if( !addNewPlayerYet ){
		var msg = {
			'type': 'addNewPlayer',
			'camID': camID,
			// 'peerid': peer_id,
			'id': -1,
			'playerStartX': myStartX,
			'playerStartY': myStartY,
			'playerStartZ': myStartZ,
			'playerStartRotY': yawObject.rotation.y,
			'myHex': myColor
		};

		sendMessage( JSON.stringify(msg) );
		addNewPlayerYet = true;
	}
	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////

	// DEVICE_ORIENTATION_CONTROL
	this.freeze = false;		// origin: true
	this.rollSpeed = 0.005;
	this.autoAlign = true;
	this.autoForward = false;

	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;
	this.orient = 0;

	this.alignQuaternion = new THREE.Quaternion();
	var alignQuaternionPublic = new THREE.Quaternion();
	this.orientationQuaternion = new THREE.Quaternion();
	var orientationQuaternionPublic = new THREE.Quaternion();

	this.finalQ = new THREE.Quaternion();

	// for rotate things other than eyeScreen
	this.finalQ2 = new THREE.Quaternion();

	this.screenOrientationQuaternion = new THREE.Quaternion();


	var quaternion = new THREE.Quaternion(), quaternion2 = new THREE.Quaternion();
	var quaternionLerp = new THREE.Quaternion(), quaternionLerp2 = new THREE.Quaternion();

	var tempVector3 = new THREE.Vector3();
	var tempMatrix4 = new THREE.Matrix4();
	var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
	var tempQuaternion = new THREE.Quaternion();

	var zee = new THREE.Vector3(0, 0, 1);
	var up = new THREE.Vector3(0, 1, 0);
	var v0 = new THREE.Vector3(0, 0, 0);
	var euler = new THREE.Euler();
	var euler2 = new THREE.Euler();
	var screenTransform = new THREE.Quaternion();
	var worldTransform = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
	var worldTransform2 = new THREE.Quaternion( Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
	var minusHalfAngle = 0;

	this.neckAngle = new THREE.Euler();

	//
	this.calQ = function() {
		this.alpha = deviceOrientation.alpha ? THREE.Math.degToRad(deviceOrientation.alpha) : 0; // Z
		this.beta = deviceOrientation.beta ? THREE.Math.degToRad(deviceOrientation.beta) : 0; // X'
		this.gamma = deviceOrientation.gamma ? THREE.Math.degToRad(deviceOrientation.gamma) : 0; // Y''
		this.orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0; // O

		// console.log("alpha: " +  deviceOrientation.gamma + ", beta: " +  deviceOrientation.beta + ", gamma: " +  deviceOrientation.gamma);
		// console.log("alpha: " +  this.alpha + ", beta: " +  this.beta + ", gamma: " +  this.gamma);

		// The angles alpha, beta and gamma
		// form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

		// 'ZXY' for the device, but 'YXZ' for us
		// euler.set(bTmp, aTmp, - gTmp, 'YXZ');
		euler.set( this.beta, this.alpha, - this.gamma, 'YXZ');

		quaternion.setFromEuler(euler);
		quaternionLerp.slerp(quaternion, 0.5); // interpolate

		// orient the device
		if (this.autoAlign) orientationQuaternionPublic.copy(quaternion); // interpolation breaks the auto alignment
		else orientationQuaternionPublic.copy(quaternionLerp);

		// camera looks out the back of the device, not the top
		orientationQuaternionPublic.multiply(worldTransform);

		// adjust for screen orientation
		orientationQuaternionPublic.multiply(screenTransform.setFromAxisAngle(zee, - this.orient));

		// this.finalQ.copy(this.lookAtCenterQ);
		this.finalQ.copy( alignQuaternionPublic );
		this.finalQ.multiply( orientationQuaternionPublic );

		////////////
		////////////
		////////////

		// for rotate things other than eyeScreen
		euler2.set( this.beta, this.alpha, -this.gamma, 'YXZ');
		quaternion2.setFromEuler(euler2);
		quaternionLerp2.slerp(quaternion2, 0.5); // interpolate

		if (this.autoAlign) orientationQuaternionPublic.copy(quaternion2); // interpolation breaks the auto alignment
		else orientationQuaternionPublic.copy(quaternionLerp2);

		orientationQuaternionPublic.multiply(worldTransform2);
		orientationQuaternionPublic.multiply(screenTransform.setFromAxisAngle(zee, - this.orient));
		this.finalQ2.copy( alignQuaternionPublic );
		this.finalQ2.multiply( orientationQuaternionPublic );

		// console.log( this.finalQ );
		
		if (this.autoAlign && this.alpha !== 0) {
				this.autoAlign = false;
				align();
	 	}
	};

	// align
	// v1
		// this.align = function() {

		// 	// tempVector3.set(0, 0, -1).applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );
		// 	tempVector3.copy(yawObject.position).applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );
			
		// 	// yawObject.position, center

		// 	tempEuler.setFromQuaternion(
		// 		tempQuaternion.setFromRotationMatrix(
		// 			tempMatrix4.lookAt(tempVector3, v0, up)
		// 		)
		// 	);

		// 	tempEuler.set(0, tempEuler.y, 0);
		// 	this.alignQuaternion.setFromEuler(tempEuler);
		// };

		// //
		// if( thisIsTouchDevice ) {
		// 	// calculate the Quaternion
		// 	this.calQ();
			
		// 	if (this.autoAlign && this.alpha !== 0) {
		// 		this.autoAlign = false;
		// 		this.align();
		// 		console.log("aligned!");
	 // 		}
	 // 	}

	// v2
		var align = function() {
			
			tempQuaternion = new THREE.Quaternion();

			// tempVector3.set(0, 0, 1).applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );
			// tempVector3.set(yawObject.position.x, yawObject.position.y, yawObject.position.z).applyQuaternion( tempQuaternion.copy( orientationQuaternionPublic ).inverse(), 'ZXY' );
			tempVector3.copy(yawObject.position).applyQuaternion( tempQuaternion.copy( orientationQuaternionPublic ).inverse(), 'ZXY' );

			// yawObject.position, center
			tempMatrix4 = new THREE.Matrix4();

			tempEuler.setFromQuaternion(
				tempQuaternion.setFromRotationMatrix(
					// look at center v0
					tempMatrix4.lookAt(tempVector3, v0, up)
				)
			);

			var ttt = tempEuler.y + Math.PI;
			tempEuler.set(0, ttt, 0);
			alignQuaternionPublic.setFromEuler(tempEuler);

			console.log(ttt);
			console.log("aligneddd!");
		};

	//

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		mousemove = true;
		mouseActive = true;

		yawObjectOriginal.rotation.y -= movementX * 0.001;

		if( quaternionChanged )
			yawObject.rotation.y += movementX * 0.001;
		else
			yawObject.rotation.y -= movementX * 0.001;

		pitchObject.rotation.x -= movementY * 0.001;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		if( !thisIsTouchDevice ){

			// if you're not mobile phone
			// create quaternion from rotation created by mouseMove
			var tempEuler = new THREE.Euler();
			tempEuler.set(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ');
			eyeFinalQ.setFromEuler(tempEuler);

			// for rotating things other than fixed eyeScreen
			tempEuler.set(-pitchObject.rotation.x, yawObject.rotation.y-Math.PI, 0, 'YXZ');
			eyeFinalQ2.setFromEuler(tempEuler);
			//
			eyeFinalQ3.copy(yawObject.quaternion);
		}

		//TIMEOUT_detect mouse stop
			clearTimeout(mouseTimeOut);
			mouseTimeOut = setTimeout(function(){
				mouseActive = false;
			}, 50);

		// console.log("aa");
	};
	
	var onKeyDown = function ( event ) {
		keyActive = true;
		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				// if ( canJump === true ) velocity.y += this.jumpSpeed;
				// canJump = false;
				break;
		}
	}.bind(this);

	var onKeyUp = function ( event ) {
		keyActive = false;

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	// DEVICE
	var onTouchStart = function ( event ) {
		touchActive = true;

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var touch = event.touches[0];

		var startPointX = touch.clientX;
		var startPointY = touch.clientY;

		touchStartLoc.set(startPointX, startPointY);

		// console.log("startX: " + startPointX + ", startY: " + startPointY);

		/*
		// Right, 1 up 1 down		
		if( startPointX>screenWidth-100 && startPointY<50 ) {
			console.log(startPointX + ", " + startPointY);
			sample.trigger(0,5);
		}
		if( startPointX>screenWidth-100 && startPointY>screenHeight-50 ) {
			console.log(startPointX + ", " + startPointY);
			sample.trigger(1,5);
		}
		// Left 1 up 1 down, right 1 down
		if( startPointX<100 && startPointY<50 ) {
			console.log("trigger ding");
			sample.trigger(3,5);		// ding --> explain thesis
		}
		if( startPointX<100 && startPointY>screenHeight-50 ) {
			console.log("trigger mouth");
			sample.trigger(2,3);		// mouth --> hi 
		}
		if( startPointX>screenWidth-100 && startPointY>screenHeight-50 ) {
			console.log("trigger hug!");
			sample.trigger(0,5);		// hug --> giggle
		}
		*/

		if(event.touches.length==2){
			var touch2nd = event.touches[1];
			touch2ndStartLoc.set(touch2nd.clientX, touch2nd.clientY);
		}

		createPoop( yawObject.position );

		//
		// align();
	};


	var onTouchMove = function ( event ) {

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var touchFirst = event.touches[0];

		var currentLocX = touchFirst.clientX;
		var currentLocY = touchFirst.clientY;

		touchCurrentLoc.set(currentLocX, currentLocY);

		var movementX = touchCurrentLoc.clone().sub(touchStartLoc).x;
		var movementY = touchCurrentLoc.clone().sub(touchStartLoc).y;

		//HRAD_ROTATION
		// replace by device orientation
		/*	
		//adjust_rotY
			mouseActive = true;

			if( quaternionChanged )
				yawObject.rotation.y += movementX * 0.00009;
			else
				yawObject.rotation.y -= movementX * 0.00009;
		//

		// yawObject.rotation.y -= movementX * 0.00009;
		pitchObject.rotation.x -= movementY * 0.00009;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		*/

		//MOVE_AROUND
		if( event.touches.length>=2) {
			var touchSecond = event.touches[1];

			// if( (touchStartLoc.x<window.innerWidth/2 && touchSecond.clientX>=window.innerWidth/2)
			// 	|| (touchStartLoc.x>=window.innerWidth/2 && touchSecond.clientX<=window.innerWidth/2) ){

				touch2ndCurrentLoc.set(touchSecond.clientX, touchSecond.clientY);

				var movement2X = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).x;
				var movement2Y = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).y;

				// console.log("movement2X: " + movement2X + ", movement2Y: " + movement2Y);

				if(movement2X > 15){
					moveRight = true;
					console.log("moveRight");
				}

				if(movement2X < -15){
					moveLeft = true;
					console.log("moveLeft");
				}

				if(movement2Y > 15){
					moveBackward = true;
					console.log("moveBackward");
				}

				if(movement2Y < -15){
					moveForward = true;
					console.log("moveForward");
				}
			// }
		} else {
			moveLeft = false;
			moveRight = false;
			moveBackward = false;
			moveForward = false;
		}
		// console.log(event.touches.length);
	};

	var onTouchEnd = function ( event ) {
		touchActive = false;

		moveLeft = false;
		moveRight = false;
		moveBackward = false;
		moveForward = false;

		// console.log(event);
	};

	//

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	//TOUCH
	if(thisIsTouchDevice) {
		document.addEventListener( 'touchstart', onTouchStart, false );
		document.addEventListener( 'touchmove', onTouchMove, false );
		document.addEventListener( 'touchend', onTouchEnd, false );
	}

	this.enabled = false;

	this.getObject = function () {
		return yawObject;
	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	// FOR_DEBUGGING
	this.getDirection = function() {

		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {
			var v = new THREE.Vector3( 0, 0, -1 );

			if(thisIsTouchDevice) {
				rotation.setFromQuaternion(eyeFinalQ, 'YXZ');
				// rotation.set( yawObject.rotation.x, yawObject.rotation.y, 0 );
			}
			else
				rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;
		}
	}();

	this.rotation = function(){
		var rr = new THREE.Vector3(yawObject.rotation.x, yawObject.rotation.y, yawObject.rotation.z);
		return rr;
	};

	this.setRotation = function(newRotation){
		yawObject.rotation.x = newRotation.x;
		yawObject.rotation.y = newRotation.y;
		yawObject.rotation.z = newRotation.z;
	};

	this.setRotationByQ = function(newRotationQ){
		yawObject.rotation.setFromQuaternion( newRotationQ );
	};

	this.setPosX = function(newPosX){
		yawObject.position.x = newPosX;
		// console.log(newPosX);
	};

	this.setPosY = function(newPosY){
		yawObject.position.y = newPosY;
	};

	this.setPosZ = function(newPosZ){
		yawObject.position.z = newPosZ;
	};

	this.setPosition = function(newPositin){
		yawObject.position.copy(newPosition);
		// console.log(newPosition);
	};

	this.dirF = function(){
		return moveForward;
	};

	this.posX = function(){
		return yawObject.position.x;
	};

	this.posY = function(){
		return yawObject.position.y;
	};

	this.posZ = function(){
		return yawObject.position.z;
	};

	this.position = function(){
		return yawObject.position;
	};

	this.rotX = function(){
		return yawObject.rotation.x;
	};

	this.rotY = function(){
		return yawObject.rotation.y;
	};

	this.rotZ = function(){
		return yawObject.rotation.z;
	};

	// FOR_MOVING
	this.setMoveF = function(moveF){
		moveForward = moveF;
	};

	this.setMoveB = function(moveB){
		moveBackward = moveB;
	};

	this.setMoveL = function(moveL){
		moveLeft = moveL;
	};

	this.setMoveR = function(moveR){
		moveRight = moveR;
	};

	//
	this.setMovXAnimation = function(_distance, _time){
		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		v2.copy(yawObject.position);
		v1.copy( xAxis ).applyQuaternion( eyeFinalQ3 );
		v2.add( v1.multiplyScalar( _distance ) );

		this.createTweenForMove( v2, _time );
	}
	this.setMovYAnimation = function(_distance, _time){
		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		v2.copy(yawObject.position);
		v1.copy( yAxis ).applyQuaternion( eyeFinalQ3 );
		v2.add( v1.multiplyScalar( _distance ) );

		this.createTweenForMove( v2, _time );
	}
	this.setMovZAnimation = function(_distance, _time){
		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		v2.copy(yawObject.position);
		// v1.copy( zAxis ).applyQuaternion( yawObject.quaternion );
		v1.copy( zAxis ).applyQuaternion( eyeFinalQ3 );
		v2.add( v1.multiplyScalar( _distance ) );

		this.createTweenForMove( v2, _time );
	}

	this.createTweenForMove = function( _newPos, _time ){
		new TWEEN.Tween( yawObject.position )
			.to( {x: _newPos.x, y: _newPos.y, z: _newPos.z}, _time )
			// .easing( TWEEN.Easing.Cubic.InOut )
			.onUpdate(function(){
				var msg = {
					'type': 'updatePlayer',
					'index': whoIamInLife,
					'playerPosX': yawObject.position.x,
					'playerPosY': yawObject.position.y,
					'playerPosZ': yawObject.position.z,
					'playerRotY': yawObject.rotation.y,
					'playerQ' : eyeFinalQ2,
					'eyeQ' : eyeFinalQ,
					'playerQ3' : eyeFinalQ3
				};

				if(ws){
					sendMessage( JSON.stringify(msg) );
				}
			})
			.start();
	};

	//
	this.update = function ( delta ) {

		if (scope.enabled === false) return;

		// DEVICE
		if (scope.freeze) return;

		

		delta *= 0.5;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		// velocity.y -= 0.10 * delta;

		if ( moveForward ) velocity.z -= this.moveSpeed * delta;
		if ( moveBackward ) velocity.z += this.moveSpeed * delta;

		if ( moveLeft ) velocity.x -= this.moveSpeed * delta;
		if ( moveRight ) velocity.x += this.moveSpeed * delta;

		// if ( isOnObject === true ) {
		// 	velocity.y = Math.max( 0, velocity.y );
		// }


		// Rotate by Device
		if( thisIsTouchDevice ) {
			// calculate the Quaternion
			this.calQ();

			// if (this.autoAlign && this.alpha !== 0) {
			// 	this.autoAlign = false;
			// 	this.align();
			// 	console.log("aligned!");
	 	// 	}

			eyeFinalQ.copy( this.finalQ.clone() );
			eyeFinalQ2.copy( this.finalQ2.clone() );

			// rotate camera
	 		yawObject.rotation.setFromQuaternion( this.finalQ );
	 		// console.log( eyeFinalQ );

	 		//
	 		eyeFinalQ3.copy(yawObject.quaternion);
	 		eyeFinalQ3._x = 0;
			eyeFinalQ3._z = 0;
			eyeFinalQ3.normalize();

	 		if(!updatedBathroom){
	 			bathroom.rotation.y = yawObject.rotation.y;
				console.log("update bathroom, mobile!");

	 			setTimeout(function(){
					bathroom.rotation.y = yawObject.rotation.y;
					console.log("update bathroom, mobile, again!");
					EnterSceneTwo();
				},1000);				
				updatedBathroom = true;

				// get position for getting out of the bathroom
				var v1 = new THREE.Vector3();
				v1.copy( zAxis ).applyQuaternion( eyeFinalQ3 );

				this.getOutBathroomPosition.copy(yawObject.position);				
				this.getOutBathroomPosition.add( v1.multiplyScalar( -90 ) );

				console.log(bathroom.position);
				console.log(this.getOutBathroomPosition);

				
			}
	 	}

	 	this.neckAngle.setFromQuaternion( eyeFinalQ2 );
			
		//

		yawObject.translateY( velocity.y );
		yawObject.translateX( velocity.x );
		yawObject.translateZ( velocity.z );

		// yawObject.position.y = myStartY;

		// if ( yawObject.position.y < 1 ) {
		// 	velocity.y = 0;
		// 	yawObject.position.y = 1;
		// 	canJump = true;
		// }

		//
 		eyeFinalQ3.copy(yawObject.quaternion);
 		eyeFinalQ3._x = 0;
		eyeFinalQ3._z = 0;
		eyeFinalQ3.normalize();

		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
		//WEB_SOCKET
			var msg = {
				'type': 'updatePlayer',
				'index': whoIamInLife,
				'playerPosX': yawObject.position.x,
				'playerPosY': yawObject.position.y,
				'playerPosZ': yawObject.position.z,
				'playerRotY': yawObject.rotation.y,
				'playerQ' : eyeFinalQ2,
				'eyeQ' : eyeFinalQ,
				'playerQ3' : eyeFinalQ3
			};

			if(ws){
				sendMessage( JSON.stringify(msg) );
				// console.log('A msg sent by DeviceControls when updating.');
			}
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////

		
	};

	if(!updatedBathroom && !thisIsTouchDevice){
		bathroom.rotation.y = yawObject.rotation.y;
		updatedBathroom = true;
		console.log("update bathroom!");

		// get position for getting out of the bathroom
		var v1 = new THREE.Vector3();
		this.getOutBathroomPosition.copy( yawObject.position );
		v1.copy( zAxis ).applyQuaternion( yawObject.quaternion );
		this.getOutBathroomPosition.add( v1.multiplyScalar( -90 ) );

		EnterSceneTwo();
	}

	// //debug
	// window.addEventListener('click', (function(){
	//   this.align();
	// }).bind(this));

	this.connect = function() {
		this.freeze = false;
	};

	this.disconnect = function() {
		this.freze = true;
	};

};

function smooth(target, readings, input){

	target.total -= readings[target.index];
	readings[target.index] = input;
	target.total += readings[target.index];
	target.index++;

	if(target.index >= target.sampleNumber)
		target.index = 0;

	target.average = target.total / target.sampleNumber;

	return target.average;
}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}