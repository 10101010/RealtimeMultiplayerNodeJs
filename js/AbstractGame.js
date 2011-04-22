(function(){
	RealtimeMultiplayerGame.AbstractGame = function() {
		return this;
	};

	RealtimeMultiplayerGame.AbstractGame.prototype = {
		// Properties
		gameClockReal  			: 0,											// Actual time via "new Date().getTime();"
		gameClock				: 0,											// Seconds since start
		gameTick				: 0,											// Ticks since start
		intervalGameTick		: null,											// Setinterval for gametick
		intervalFramerate		: 60,											// Try to call our tick function this often, intervalFramerate, is used to determin how often to call settimeout - we can set to lower numbers for slower computers
		intervalTargetDelta		: NaN,	// this.targetDelta, milliseconds between frames. Normally it is 16ms or 60FPS. The framerate the game is designed against - used to create framerate independent motion

		// Methods
		tick: function() {
			// Store previous time and update current
			var oldTime = this.gameClockReal;
			this.gameClockReal = new Date().getTime();

			// Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
			var delta = this.gameClockReal - oldTime;
			this.gameClock += delta;
			this.gameTick++;

			// Framerate Independent Motion -
			// 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
			var speedFactor = delta / ( this.intervalTargetDelta );
			if (speedFactor <= 0) speedFactor = 1;
		},


		/**
		 * Start/Restart the game tick
		 */
		startGameClock: function()
		{
			var that = this;

			this.intervalTargetDelta = Math.floor( 1000/this.intervalFramerate );
			this.intervalGameTick = setInterval( function(){ that.tick() }, this.intervalTargetDelta);
		},

		/**
		 * Stop the game tick
		 */
		stopGameClock: function()
		{
			clearInterval( this.intervalGameTick );
		}

		// Accessors
	}
})();