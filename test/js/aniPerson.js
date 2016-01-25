
// THE ANI PERSON OBJECT
function AniPerson( _pos, _color, _id ) {

	this.color = _color;
	this.whoIam = _id;
	this.ahhRotation;

	// construct physical existence
	this.player = new THREE.Object3D();
	this.pMat = new THREE.MeshLambertMaterial( { map: personTex, color: this.color, side: THREE.DoubleSide } );

	// 1-body
	this.playerBody = new THREE.Mesh( personBody, this.pMat);
	this.playerBody.name = "body";

	// if it's ME, create inner poop
	if( this.whoIam == whoIamInLife ){
		this.poopMini = poop.clone();
		this.poopMini.scale.set(0.1,0.1,0.1);
		this.poopMini.rotation.x += Math.PI/2;
		this.poopMini.position.y -= 1.3;
		this.poopMini.position.z -= 0.1;
		this.playerBody.add( this.poopMini );
	} else {
		// attach toilet to body
		this.playerToilet = new THREE.Mesh( personToilet, toiletMat );
		this.playerToilet.name = "toilet";
		this.playerBody.add( this.playerToilet );
	}
	this.player.add( this.playerBody );

	// 2-head
	// if it's ME, create empty head
	if( this.whoIam == whoIamInLife ){
		this.playerHead = new THREE.Object3D();
		this.playerHead.name = "head";
	} else {
		this.playerHead = new THREE.Mesh( personHead, this.pMat );
		this.playerHead.name = "head";
		//
		var poopHat = poop.clone();
		poopHat.rotation.y += Math.PI;
		poopHat.position.y += 0.3;
		this.playerHead.add( poopHat );
	}
	this.player.add( this.playerHead );

	// 3-toilet
	// this.playerToilet = new THREE.Mesh( personToilet, toiletMat );
	// this.playerToilet.name = "toilet";
	// this.player.add( this.playerToilet );

	this.player.position.copy( _pos );
	scene.add( this.player );
}

Person.prototype.update = function( _playerLocX, _playerLocZ, _playerRotY, _playerQ ) {

	this.player.position.x = _playerLocX;
	this.player.position.z = _playerLocZ;

	// head
	if(this.player.children[1])
		this.player.children[1].rotation.setFromQuaternion( _playerQ );
	
	// body
	_playerQ._x = 0;
	_playerQ._z = 0;
	_playerQ.normalize();
	this.ahhRotation = new THREE.Euler().setFromQuaternion( _playerQ, 'YXZ');

	if(this.player.children[0]){
		this.player.children[0].rotation.y = this.ahhRotation.y;
	}
	// if(this.player.children[2]){
	// 	this.player.children[2].rotation.y = this.ahhRotation.y;
	// }
}