window.export('PlaneInteraction', function() {
	'use strict';
	class PlaneInteraction{
		constructor(gameObjects, game, flyAway) {
			this.gameObjects = gameObjects;
			this.game = game;
			//false flags when turned to true, will prompt some action
			this.visitedPlaneLastFrame = false;
			this.isLieOrTruthInput = false;
			this.isIDInput = false;
			this.isBomb = false;
			this.flyAway = flyAway;
		}

		update() {
			let self = this;
			let currentlyVisitingPlane = false;
			this.game.physics.arcade.overlap(this.gameObjects.player, this.gameObjects.plane, function() {
				currentlyVisitingPlane = true;

				if(!self.visitedPlaneLastFrame) {
					self.beginInteraction(); //starts interaction
				}

			}, null, this.game);

			if(currentlyVisitingPlane) {
				self.visitedPlaneLastFrame = true;
			} else {
				self.visitedPlaneLastFrame = false;
			}


			if(this.isBomb) {
				this.game.physics.arcade.collide(this.bombObj, this.gameObjects.platforms, function() {
					self.bombExplode();
				});
			}

			if(this.isLieOrTruthInput) {
				let input = this.gameObjects.input;
				if(input.one.isDown) {
					this.isLieOrTruthInput = false; //will not prompt an action
					this.lie();
				} else if(input.two.isDown) {
					this.isLieOrTruthInput = false; //once we get bomb animation, this will turn to true
					this.truth();
				}
			} else if(this.isIDInput) { //all of these are lies, will not prompt anything but continue the convo
				let input = this.gameObjects.input;
				if(input.one.isDown) {
					this.isIDInput = false;
					this.idNum();
				} else if(input.two.isDown) {
					this.isIDInput = false;
					this.idNum();
				} else if(input.three.isDown) {
					this.isIDInput = false;
					this.idNum();
				}
			}
		}

		beginInteraction() { //all this shit is the text
			let self = this;
			setTimeout(function(){
				self.gameObjects.dialog.visible = true;
				self.gameObjects.dialogLines = ['[Radio garble]'];
				setTimeout(function(){
					self.gameObjects.dialogLines = ['[Radio] FLIGHT PAPA TANGO SIERRA 18 REPORT!'];
					setTimeout(function(){
						self.gameObjects.dialogLines.push('FLIGHT PAPA TANGO SIERRA 18,');
						self.gameObjects.dialogLines.push('THIS IS THE WARDEN AT SUPER SECRET PRISON.');
						setTimeout(function(){
							self.gameObjects.dialogLines.push('YOU WERE DUE IN AN HOUR AGO!');
							self.gameObjects.dialogLines.push('WHAT IS GOING ON?!');
							self.gameObjects.dialogLines.push('');
							setTimeout(function(){
								self.gameObjects.playerResponse.visible = true;
								self.gameObjects.playerLines = ['1) Lie and say everything is under control.', '2) Tell the truth.'];
								self.isLieOrTruthInput = true;
							}, 1000);
						}, 2000);
					}, 2000);
				}, 2000);
			}, 1000);
		}

		lie() { //will not get blown up
			let self = this;
			self.gameObjects.playerResponse.visible = false;
			self.gameObjects.playerLines = [''];
			self.gameObjects.dialogLines = ['[You clear your throat]', '[You] Yes Warden?'];
			setTimeout(function(){
				self.gameObjects.dialogLines.push('This is uhhhhh...');
				setTimeout(function(){
					self.gameObjects.dialogLines.push('... we ummm...');
					setTimeout(function(){
						self.gameObjects.dialogLines.push('We crash-landed on an island, but we still');
						self.gameObjects.dialogLines.push('have control of the prisoner. We need rescue.');
						setTimeout(function(){
							self.gameObjects.dialogLines = ["[Radio] I don't recognize your voice."];
							setTimeout(function(){
								self.gameObjects.dialogLines.push("What is your ID number?");
								setTimeout(function(){
									self.gameObjects.playerResponse.visible = true;
									self.gameObjects.playerLines = [];
									self.gameObjects.playerLines.push('1) 4324357262');
									self.gameObjects.playerLines.push('2) 1234567890');
									self.gameObjects.playerLines.push('3) 0978544776');
									self.isIDInput = true;
								}, 1000);
							}, 1000);
						}, 4000);
					}, 1000);
				}, 1000);
			}, 1000);
		}

		truth() {
			// get blown up
			let self = this;
			self.gameObjects.playerResponse.visible = false;
			self.gameObjects.playerLines = [''];
			self.gameObjects.dialogLines = ["[You] The plane crashed, and I'm the only", 'survivor. All of the guards mysteriously', 'went ...missing.'];
			setTimeout(function(){
				self.gameObjects.dialogLines.push('[Radio] PRISONER! YOU WILL BE');
				setTimeout(function(){
					self.gameObjects.dialogLines.push('TERMINATED');
					setTimeout(function(){
						self.gameObjects.dialogLines.push('IMMEDIATELY.');
						setTimeout(function(){
							self.gameObjects.dialog.visible = false;
							self.gameObjects.dialogLines = [''];
							self.bomb();
						}, 3000);
					}, 3000);
				}, 1000);
			}, 3000);
		}

		idNum() {
			let self = this;
			self.gameObjects.playerResponse.visible = false;
			self.gameObjects.playerLines = [''];
			self.gameObjects.dialogLines = ["[Radio] I can't find your ID in the system."];
			setTimeout(function(){
				self.gameObjects.dialogLines.push('We are transmiting your GPS coordinates to');
				self.gameObjects.dialogLines.push('the US Marshals.');
				self.gameObjects.dialogLines.push('Just stay there until they arrive.');
				setTimeout(function(){
					// conversation over, hide dialog
					self.gameObjects.dialog.visible = false;
					self.gameObjects.dialogLines = [''];
					self.flyAway.enable();
				}, 3000);
			}, 2000);
		}

		bomb() {
			this.isBomb = true;
			this.bombObj = this.game.add.sprite(this.gameObjects.player.x, this.gameObjects.player.y - 500, 'bomb');
			this.bombObj.anchor.setTo(0.5, 0.5);
			this.bombObj.animations.add('falling', [0]);
			this.bombObj.animations.add('explosion', [1]);
			this.bombObj.scale.x = 2.5;
			this.bombObj.scale.y = 2.5;
			this.bombObj.animations.play('falling');
			this.game.physics.arcade.enable(this.bombObj);
			this.bombObj.body.gravity.y = 500;
		}

		bombExplode() {
			this.isBomb = false;
			this.bombObj.body.gravity.y = 0;
			this.bombObj.scale.x = 20;
			this.bombObj.scale.y = 20;
			this.bombObj.animations.play('explosion');
			let self = this;
			setTimeout(function() {
				// game over
				// TODO: Add game over screen
				self.game.state.start('Level1');
				//window.location.reload();
			}, 2000);
		}
	}
	
	return PlaneInteraction;
});