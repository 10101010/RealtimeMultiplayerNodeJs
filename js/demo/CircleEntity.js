/**
File:
	DemoApp.CircleEntity
Created By:
	Mario Gonzalez
Project:
	DemoApp
Abstract:
	This is the base entity for the demo game
Basic Usage:

Version:
	1.0
*/
(function(){

	DemoApp.CircleEntity = function( anEntityid, aClientid) {
		DemoApp.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );

		this.velocity = new RealtimeMultiplayerGame.model.Point(0,0);
		this.acceleration = new RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	DemoApp.CircleEntity.prototype = {
		radius					:	DemoApp.Constants.ENTITY_DEFAULT_RADIUS,
		velocity				:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		acceleration			:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		collisionCircle			:	null,										// An instance of RealtimeMultiplayerGame.modules.circlecollision.PackedCircle

		updateView: function() {
			if(!this.view) return;
			this.view.x = this.position.x - this.radius;
			this.view.y = this.position.y - this.radius;
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			this.collisionCircle.dealloc();
			this.collisionCircle = null;
			DemoApp.CircleEntity.superclass.dealloc.call(this);
		},

		///// ACCESSORS
		/**
		 * Set the CollisionCircle for this game entity.
		 * @param aCollisionCircle
		 */
		setCollisionCircle: function( aCollisionCircle ) {
			this.collisionCircle = aCollisionCircle;
			this.collisionCircle.setDelegate( this );
			this.collisionCircle.setPosition( this.position.clone() );
		},
		getCollisionCircle: function() { return this.collisionCircle }
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoApp.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();