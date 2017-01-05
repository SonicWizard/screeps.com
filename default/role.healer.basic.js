var utility = require('utility');

var roleHealerBasic = {
	run: function(creep) {
		var closestDamagedCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
			filter: (creep) => creep.hits < creep.hitsMax
		});

		if (closestDamagedCreep) {
			if (creep.heal(closestDamagedCreep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(closestDamagedCreep);
			}
		} else {
			let healerFlag = Game.flags.HealerFlag;
			if (healerFlag) {
				creep.moveTo(healerFlag);
			}
		}
	}
};

module.exports = roleHealerBasic;
