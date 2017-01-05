var utility = require('utility');

var roleHealer = {
	run: function(creep) {
		var closestDamagedCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
			filter: (creep) => creep.hits < creep.hitsMax
		});

		if (closestDamagedCreep) {
			if (creep.heal(closestDamagedCreep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(closestDamagedCreep);
			}
		} else {
			// move to middle of room
			creep.moveTo(24, 24);
		}
	}
};

module.exports = roleHealer;
