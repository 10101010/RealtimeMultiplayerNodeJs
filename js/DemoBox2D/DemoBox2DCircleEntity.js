/**
File:
	DemoBox2D.CircleEntity
Created By:
	Mario Gonzalez
Project:
	DemoBox2D
Abstract:
	This is the base entity for the demo game
Basic Usage:

Version:
	1.0
*/
(function() {
	DemoBox2D.CircleEntity = function( anEntityid, aClientid) {
		DemoBox2D.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );
		this.radius = DemoBox2D.Constants.ENTITY_BOX_SIZE * DemoBox2D.Constants.PHYSICS_SCALE;
		return this;
	};

	DemoBox2D.CircleEntity.prototype = {
		b2Body		: null,												// Reference to Box2D body
		radius		: 1,
		entityType	: DemoBox2D.Constants.ENTITY_TYPES.CIRCLE,

		/**
		 * @inheritDoc
		 */
		updateView: function() {
			if(!this.view) return;
			this.view.x = this.position.x - this.radius;
			this.view.y = this.position.y - this.radius;

			this.view.setRotation( this.rotation * 0.017453292519943295 );
		},

		/**
		 * @inheritDoc
		 */
		updatePosition: function( speedFactor, gameClock, gameTick ) {
			this.position.x = this.b2Body.m_xf.position.x * 32;
			this.position.y = this.b2Body.m_xf.position.y * 32;
			this.rotation = this.b2Body.GetAngle();
		},

		/**
		 * @inheritDoc
		 */
		constructEntityDescription: function() {
			return DemoBox2D.CircleEntity.superclass.constructEntityDescription.call(this) + ',' + this.radius;
		},

		/**
		 * @inheritDoc
		 */
		dealloc: function() {
			if(this.b2Body) {
				// Destroy box2d body -
			}
			DemoBox2D.CircleEntity.superclass.dealloc.call(this);
		},

		///// ACCESSORS
		/**
		 * Set the Box2D body that represents this entity
		 * @param aBox2dBody
		 */
		setBox2DBody: function( aBox2dBody ) {
		   this.b2Body = aBox2dBody;
		},
		getBox2DBody: function() { return this.b2Body }
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoBox2D.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();