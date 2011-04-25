/**
File:
	Client.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
 	Stores information about a connection to a client
Basic Usage:
 	var aNewClient = new Client(this, connection, false);

	// Add to our list of connected users
	this.clients[clientID] = aNewClient;

	// broadcast message to all clients
	for( var clientID in this.clients ) {
		this.clients[clientID].sendMessage(encodedMessage);
	}
Version:
	1.0
*/
(function(){

	var BUFFER_MASK = RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER;

	// Retrieve the namespace
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.network");

	RealtimeMultiplayerGame.network.Client = function( aConnection ) {
		this.connection = aConnection;
		return this;
	};

	RealtimeMultiplayerGame.network.Client.prototype = {
		connection				: null,				// SocketIO connection for this specific client
		id						: -1,				// UUID for this client
		// Configuration
		cl_updateRate			: RealtimeMultiplayerGame.Constants.CLIENT_SETTING.UPDATE_RATE,		// How often we can receive messages per sec
		outgoingMessageBuffer	: [],				// Store array of incoming messages, slots are resused
		outgoingSequenceNumber	: 0,                // Number of total outgoing messages received
		incomingMessageBuffer	: [],              	// Store array of incoming messages, slots are resused
		incomingSequenceNumber	: 0,                // Number of total incoming messages received
		entityDescriptionBuffer	: [],				// Store WorldEntityDescriptions before ready to send

		// Used to track if we can send a new message to this user
		lastSentMessageTime 	: -1,
		lastReceivedMessageTime : -1,


		onMessage: function( messageData )
		{
			var messageIndex = this.incomingSequenceNumber & RealtimeMultiplayerGame.Constants.CLIENT_SETTING.UPDATE_RATE;
			this.incomingMessageBuffer[messageIndex] = messageData;
			this.incomingSequenceNumber++;
		},

		/**
		 * Compares the worldDescription to the last one we sent - removes unchanged values
		 * @param worldDescription A description of all the entities currently in the world
		 * @param gameClock		   The current (zero-based) game clock
		 */
		compressDeltaAndQueueMessage: function( worldDescription, gameClock )
		{
			var allEntities = worldDescription.entities,
				len = allEntities.length;

			var resultDescStr = '';
			while(len--) {
				var anEntityDescStr = allEntities[len],
					anEntityDesc = anEntityDescStr.split(','),
					objectID = +anEntityDesc[0],
					clientID = +anEntityDesc[1];

				// 0 = Server owned
				var hasNewData = true;
				if(clientID == 0) {
				   var previouslySentEntityDescription = this.stagnentEntities.objectForKey(objectID);
				   if(previouslySentEntityDescription) {
					   // hasNewData = false;
				   }
				}

				// Store for next time
				// this.stagnentEntities.setObjectForKey(anEntityDesc, objectID);

				// Only send if it has new data
				if(hasNewData) {
					resultDescStr += "|" + anEntityDescStr;
				}
			}
			var entityDescriptionObject = {};
			entityDescriptionObject.entities = resultDescStr;
			entityDescriptionObject.gameClock = worldDescription.gameClock;
			entityDescriptionObject.gameTick = worldDescription.gameTick;

			this.entityDescriptionBuffer.push( entityDescriptionObject );
		},

		/**
		 * Sends the current cmdBuffer
		 */
		sendQueuedCommands: function( gameClock )
		{
			var messageContent = {
				gameClock: gameClock,
				id:1,
				seq: this.outgoingSequenceNumber,
				cmd: RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE,
				data:this.entityDescriptionBuffer
			};
			var anEncodedMessage = messageContent;	// Encode?
//			var encodedMessage = BISON.encode(messageContent);

			this.sendMessage( anEncodedMessage, gameClock);

			this.entityDescriptionBuffer = [];
		},

		/**
		 * Send an encoded (and delta compressed) message to the connection
		 * @param anEncodedMessage Bison Encoded message
		 * @param gameClock		   The current (zero-based) game clock
		 */
		sendMessage: function( anEncodedMessage, gameClock )
		{
			this.lastSentMessageTime = gameClock;

			// Store inside our outgoingMessageBuffer - which holds 'MESSAGE_BUFFER_MASK' lerped number of messages
			var messageIndex = this.outgoingSequenceNumber & BUFFER_MASK;
			this.outgoingMessageBuffer[messageIndex] = anEncodedMessage;

			// Send and increment our message count
			this.connection.send( anEncodedMessage );
			this.outgoingSequenceNumber++;
		},

	///// ACCESSORS
		/**
		 * Returns true if its ok to send this client a new message
		 * @param {Number} gameClock
		 */
		canSendMessage: function( gameClock ) {
			return (gameClock - this.lastSentMessageTime) > this.cl_updateRate;
		},

		/**
		 * Returns the sessionId as created by Socket.io for this client
		 * @return {String} A hash representing the session id
		 */
		getSessionId: function() {
			return this.connection.sessionId
		},

		getId: function() {
			return this.getSessionId();
		},

		/**
		 * @return {
		 */
		getConnection: function() {
			return this.connection;
		}
	}
})();