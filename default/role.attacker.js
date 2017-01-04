var utility = require('utility');

var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		if (hostiles.length > 0) {
			let nearest = utility.findNearest(creep, hostiles);
			if (creep.attack(nearest) == ERR_NOT_IN_RANGE) {
				creep.moveTo(nearest);
			}
	    } else {
			// move to middle of room
			creep.moveTo(24, 24);
		}
	}
};

module.exports = roleAttacker;
