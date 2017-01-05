var utility = require('utility');

var roleHealerFighter = {
	run: function(creep) {
		// TODO Heal fighters first, then heal others

		var closestDamagedCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
			filter: (creep) => {
				return (creep.memory.role === 'fighter' || creep.memory.role === 'bigFighter') && creep.hits < creep.hitsMax;
			}
		});

		if (closestDamagedCreep) {
			if (creep.heal(closestDamagedCreep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(closestDamagedCreep);
			}
		} else {
			let fighterFlag = Game.flags.FighterFlag;
			if (fighterFlag) {
				creep.moveTo(fighterFlag);
			}
		}
	}
};

module.exports = roleHealerFighter;
