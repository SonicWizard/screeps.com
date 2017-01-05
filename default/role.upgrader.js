var utility = require('utility');

var roleUpgrader = {
	collecting: true,
    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
			if (this.collecting) {
				creep.say('collecting');
			} else {
				creep.say('harvesting');
			}
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

		if (creep.memory.upgrading) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		} else {
			if (this.collecting) {
				utility.withdrawFromFullestContainer(creep);
			} else {
				utility.harvestFromClosestSource(creep);
			}
		}
    }
};

module.exports = roleUpgrader;
