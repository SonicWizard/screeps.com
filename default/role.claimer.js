var utility = require('utility');

var roleClaimer = {
	run: function(creep) {
		/*
		let claimerFlag = Game.flags.ClaimerFlag;
		if (claimerFlag) {
			creep.moveTo(claimerFlag);
		}
		*/

		let controller = creep.room.controller;

		if (controller) {
			if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(controller);
			}
		}
	}
};

module.exports = roleClaimer;
