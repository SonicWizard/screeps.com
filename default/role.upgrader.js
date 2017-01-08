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
			    // Withdraw from storage first
				let storages = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
					}
				});
				if (storages.length > 0) {
					let nearest = utility.findNearest(creep, storages);
					if (creep.withdraw(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(nearest);
					}
				} else {
					// then withdraw from containers
					utility.withdrawFromFullestContainer(creep);
				}
			} else {
				utility.harvestFromClosestSource(creep);
			}
		}
    }
};

module.exports = roleUpgrader;
