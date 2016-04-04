
// SET_UP
var express = require('express');
var app = express();
//
var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 7000;

var allPlayers = [];

//
server.listen(port);

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});
console.log('Server started on port ' + port);

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Use WebSocket to send the data to html
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({'server': server});

var allSockets = [], allSocketIDs = [];
var thisId = -1;	// first one will be 0
var totalCount = -1;

var lifeIndex = {};
lifeIndex.type = "index";

var mySocket = undefined;

// object - index: occupancy
var occuList = {};
var occuIndex = 1, worldIndex;

// Should I cap a world's total pp number??
wss.on('connection', function(ws){

	mySocket = ws;

	thisId++;
	totalCount++;
	/*
	ws.id = thisId;

	// remember the id & socket match
	allSockets.push(ws);
	*/

	console.log("new player #%d connected!", thisId);

	var haveEmptySeat = false;
	for( prop in occuList ){
		// if it's an empty seat
		if( occuList[prop] != "occupied" ){
			// get the index of the seat 
			occuIndex = prop;
			haveEmptySeat = true;

			// change it to be unoccupied
			occuList[prop] = "occupied";
			break;
		}
	}

	// all the seat are already occupied
	if(!haveEmptySeat){
		occuIndex = Object.keys(occuList).length + 1;
		// console.log( "occuIndex: " + occuIndex );
		occuList[occuIndex] = "occupied";
	}

	ws.id = occuIndex;
	ws.worldId = Math.floor(occuIndex/18);
	allSockets.push(ws);

	// SEND BACK INDEX INFO!
	if(mySocket){
		// lifeIndex.index = thisId;
		lifeIndex.index = occuIndex;
		lifeIndex.worldIndex = Math.floor(occuIndex/18);

		mySocket.send( JSON.stringify(lifeIndex) );
	}

	ws.on('message', function(data){
		var msg = JSON.parse(data);
		socketHandlers(ws,msg);
	});

	ws.on('close', function(){
		for(var i=0; i<allSockets.length; i++){

			// Found the CLOSE socket in allSockets
			// if this is the one, remove it
			if(allSockets[i]==ws){
				var msg = {
					'type': 'removePlayer',
					'removeID': ws.id
				};
				console.log("player #%d disconnected.", ws.id);		// allSocketIDs[i]

				allSockets.splice(i,1);
				// allSocketIDs.splice(i,1);
				allPlayers.splice(i,1);

				//
				occuList[ws.id] = "empty";
				totalCount--;

				msg.totalCount = totalCount;
				//
				socketHandlers(ws, msg);

				break;
			}
		}
		mySocket = undefined;
	});

});


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////



//
var socketHandlers = function(socket,msg){

	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{

			if(msg.type=='addNewPlayer'){

				// FOR_GENERATING_HISTORY_PLAYERS
				// ONLY_HAPPENS_ONCE
				if(msg.camID==0){
					msg.id = socket.id;
					// console.log('newPlayer Peer ID -->' + msg.peerid);
					msg.camID++;
					// console.log('camID -->' + msg.camID);

					//
					msg.worldId = socket.worldId;
					msg.totalCount = totalCount;

					allPlayers.push(msg);	// restoring all the players
				}
			}

			// SERVER_SEND_GENERAL_THING
			allSockets[i].send(JSON.stringify(msg));

			// SERVER_SEND_ARRAY_THING
			if(msg.type=='addNewPlayer'){
				allSockets[i].send(JSON.stringify(allPlayers));
				// console.log('Server sent a BROADCAST thing.');				
				// console.log(players.length);
			}
		}
		catch(error){
			console.log('that socket was closed');
		}
	}
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////