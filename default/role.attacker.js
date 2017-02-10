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
			let fighterFlag = creep.pos.findClosestByPath(Game.flags, { filter: (flag) => flag.name.indexOf('Fighter') != -1 });
			if (fighterFlag) {
				creep.moveTo(fighterFlag);
			}
		}
	}
};

module.exports = roleAttacker;
