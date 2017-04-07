
// m_chopL, m_chopR, m_arm_down, m_arm, m_m_open, m_m_close, m_m_openWide, m_snore
function loadModelMonster ( _chopR, _chopL, _armD, _arm, _snore, _mOpen, _mClose, _mWOpen, _bowl ) {

	var loader = new THREE.JSONLoader( loadingManger );
	loader.load(_chopR, function(geometry){ m_chopR = geometry });
	loader.load(_chopL, function(geometry){ m_chopL = geometry });
	loader.load(_armD, function(geometry){ m_arm_down = geometry });
	loader.load(_arm, function(geometry){ m_arm = geometry });
	loader.load(_snore, function(geometry){ m_snore = geometry });
	loader.load(_mOpen, function(geometry){ m_m_open = geometry });
	loader.load(_mClose, function(geometry){ m_m_close = geometry });
	loader.load(_mWOpen, function(geometry){ m_m_openWide = geometry });
	loader.load(_bowl, function(geometry){ m_bowl = geometry });
}

function CreateMonster()
{
	var monsterMat = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});

	var c_l = new THREE.Mesh(m_chopL, monsterMat);
	c_l.position.set(19.9, 2.37, -12.09);
	//c_l.rotation.y = -0.05;
	var c_r = new THREE.Mesh(m_chopR, monsterMat);
	c_r.position.set(22.16, 2.38, -11.2);
	c_r.rotation.y = -0.1;
	var a_d = new THREE.Mesh(m_arm_down, monsterMat);
	a_d.add(c_l);
	a_d.add(c_r);
	a_d.position.set(28.06, -8.8, -15.8);

	var aa = new THREE.Mesh(m_arm, monsterMat);
	aa.position.set(4.75, -4.76, -5.77);

	var monsArm = new THREE.Object3D();
	monsArm.add(aa);
	monsArm.add(a_d);
	monsArm.position.set(19.49, -12.84, 18.19);

	var snore = new THREE.Mesh(m_snore, monsterMat);
	snore.position.set(-2.4, 19.5, -20.5);
	TweenMax.to(snore.scale, 3, { x:1.3, y:1.3, z:1.3, repeat:-1, yoyo:true, ease:Power1.easeInOut });

	var bowl = new THREE.Mesh(m_bowl, new THREE.MeshLambertMaterial());

	m_m_open.morphTargets.push({name: 'm1', vertices: m_m_close.vertices});
	m_m_open.morphTargets.push({name: 'm2', vertices: m_m_openWide.vertices});
	m_m_open.computeMorphNormals();
	monster = new THREE.Mesh( m_m_open, new THREE.MeshLambertMaterial({color: 0xe9ceda, morphTargets: true, side: THREE.DoubleSide}) );
	monster.add(monsArm);
	monster.add(snore);
	monster.add(bowl);
	//monster.position.x = 100;
	monster.scale.multiplyScalar(2);
	monster.position.y = -2;
	scene.add(monster);

	chopPosVector = new THREE.Vector3();
	chopPosDummy = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
	chopPosDummy.position.set(143, -39, -37.5);
	scene.add(chopPosDummy);
	//Attach(chopPosDummy, scene, monster.children[0].children[1].children[0]);
}

function loadModelTruck ( cart, lantern, rooftop, supports, wheels, wood ) {

	var loader = new THREE.JSONLoader( loadingManger );
	truck = new THREE.Object3D();
	var truckMat = new THREE.MeshLambertMaterial();

	loader.load(cart, function(geometry){
		var c_mesh = new THREE.Mesh(geometry, truckMat);
		truck.add(c_mesh);

		loader.load(rooftop, function(geometry2){
			var r_mesh = new THREE.Mesh(geometry2, truckMat);
			truck.add(r_mesh);

			loader.load(supports, function(geometry3){
				var s_mesh = new THREE.Mesh(geometry3, truckMat);
				truck.add(s_mesh);

				loader.load(wheels, function(geometry4){
					var w_mesh = new THREE.Mesh(geometry4, truckMat);
					truck.add(w_mesh);

					loader.load(wood, function(geometry5){
						var ww_mesh = new THREE.Mesh(geometry5, truckMat);
						truck.add(ww_mesh);

						loader.load(lantern, function(geometry6){
							lanternGroup = new THREE.Object3D();

							var lanternPos = [ new THREE.Vector3(4.8, 4.4, 2.6), new THREE.Vector3(-4.8, 4.7, 2.6),  new THREE.Vector3(-4.8, 4.7, -3)];
							for(var i=0; i<3; i++){
								var lanternMesh = new THREE.Mesh(geometry6, truckMat);
								lanternMesh.position.copy( lanternPos[i] );
								lanternGroup.add(lanternMesh);
							}
							truck.add(lanternGroup);

							//
							var truckLightBulb = new THREE.Mesh( new THREE.SphereGeometry(0.05), new THREE.MeshLambertMaterial({color: 0xffffff}) );
							truckLightBulb.position.y = 4;
							var truckLight = new THREE.PointLight( 0xff8a4f, 0.6, 10 );
							truckLight.position.y = -0.2;
							TweenMax.to(truckLight, 3, { intensity: 1, repeat: -1, yoyo: true, ease: RoughEase.ease.config({ template: Power0.easeNone, strength: .2, points: 20, taper: "none", randomize: true, clamp: true}) });
							truckLightBulb.add(truckLight);
							truck.add(truckLightBulb);

							scene.add( truck );

							//
							loadModelCurtain( basedURL + "models/foodCart/foodcarttest2_c1.json", basedURL + "models/foodCart/foodcarttest2_c2.json" );
						});
					});
				});
			});	
		});	
	});
}

function loadModelCurtain (model, model2) {

	var loader = new THREE.JSONLoader( loadingManger );
	loader.load(model, function(geometry){

		curtainGeo1 = geometry;
		
		loader.load(model2, function(geometry2){
			curtainGeo2 = geometry2;
			curtainGeo2.computeVertexNormals();
			// curtainGeo2.computeMorphNormals();

			curtainGeo1.morphTargets.push( {name: 't1', vertices: curtainGeo2.vertices} );
			curtainGeo1.computeVertexNormals();
			curtainGeo1.computeMorphNormals();

			curtain = new THREE.Mesh( curtainGeo1, new THREE.MeshLambertMaterial({morphTargets: true, morphNormals: true, side: THREE.DoubleSide}) );
			truck.add(curtain);
			// scene.add(curtain);
		});
		
	});
}

function loadModelHighChair( _chair, _table, _stuff, _smallPlate, _bigPlate ) {
	highChair = new THREE.Object3D();

	var loader = new THREE.JSONLoader( loadingManger );
	loader.load(_chair, function(geo_chair){
		var chair = new THREE.Mesh( geo_chair, highChairMat );
		highChair.add(chair);
		
		loader.load(_table, function(geo_table){
			var table = new THREE.Mesh( geo_table, highChairMat );

			loader.load(_stuff, function(geo_stuff){
				var stuff = new THREE.Mesh( geo_stuff, highChairMat );
				table.add(stuff);

				loader.load(_smallPlate, function(geo_s_p){
					var s_p = new THREE.Mesh( geo_s_p, highChairMat );
					s_p.position.set(0,0.05,0.9);
					table.add(s_p);

					loader.load(_bigPlate, function(geo_b_p){
						var b_p = new THREE.Mesh( geo_b_p, highChairMat );
						b_p.position.set(0,0,0.9);
						table.add(b_p);
						table.position.y = 2.4;

						highChair.add(table);

						// highChair.position.z = 20;
						// scene.add(highChair);
					});
				});
			});
		});
	});
}

function loadSitModelPlayer( _head, _body, _emptyStomach, _fullStomach ){
	var sp_loader = new THREE.JSONLoader( loadingManger );

	// BODY
	sp_loader.load( _body, function( geometry ){
		personBody = geometry;
	});

	// HEAD
	sp_loader.load( _head, function( geometry2 ){
		geometry2.center();
		personHead = geometry2;
	});

	sp_loader.load( _emptyStomach, function( geometry3 ){
		stomach = geometry3;

		sp_loader.load( _fullStomach, function( geometry4 ){
			stomach.morphTargets.push({name: 's_1', vertices: geometry4.vertices });
			//stomach.computeMorphNormals();

			console.log(stomach);
		});
	});
}

function loadModelChewers( _A1, _A2, _A3, _B1, _B2, _C1, _C2, _C3, _D1, _D2 ){
	var loader = new THREE.JSONLoader( loadingManger );

	// chewerA
	loader.load( _A1, function( geoA1 ){
		chewerA = geoA1;

		loader.load( _A2, function( geoA2 ){
			var chewerA2 = geoA2;

			loader.load( _A3, function( geoA3 ){
				var chewerA3 = geoA3;

				chewerA.morphTargets.push({name: 'a_1', vertices: chewerA2.vertices});
				chewerA.morphTargets.push({name: 'a_2', vertices: chewerA3.vertices});
				chewerA.computeMorphNormals();
				chewers[0] = chewerA;
			});
		});
	});

	// chewerB
	loader.load( _B1, function( geoB1 ){
		chewerB = geoB1;
		loader.load( _B2, function( geoB2 ){
			var chewerB2 = geoB2;
			chewerB.morphTargets.push({name: 'b1', vertices: chewerB2.vertices});
			chewerB.computeMorphNormals();
			chewers[1] = chewerB;
		});
	});

	// chewerC
	loader.load( _C1, function( geoC1 ){
		chewerC = geoC1;
		loader.load( _C2, function( geoC2 ){
			var chewerC2 = geoC2;
			loader.load( _C3, function( geoC3 ){
				var chewerC3 = geoC3;

				chewerC.morphTargets.push({name: 'c1', vertices: chewerC2.vertices});
				chewerC.morphTargets.push({name: 'c2', vertices: chewerC3.vertices});
				chewerC.computeMorphNormals();
				chewers[2] = chewerC;
			});
		});
	});

	// chewerD
	loader.load( _D1, function( geoD1 ){
		chewerD = geoD1;
		loader.load( _D2, function( geoD2 ){
			var chewerD2 = geoD2;

			chewerD.morphTargets.push({name: 'd1', vertices: chewerD2.vertices});
			chewerD.computeMorphNormals();
			chewers[3] = chewerD;
		});
	});
}
