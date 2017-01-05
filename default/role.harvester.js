var utility = require('utility');

var roleHarvester = {
	collecting: true,
    /** @param {Creep} creep **/
    run: function(creep) {
		// set status
		if (creep.memory.delivering && creep.carry.energy == 0) {
			creep.memory.delivering = false;
			if (this.collecting) {
				creep.say('collecting');
			} else {
				creep.say('harvesting');
			}
		}
		if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
			creep.memory.delivering = true;
			creep.say('delivering');
		}

		if (creep.memory.delivering) {
			let towers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
				}
			});
			let spawns = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity;
				}
			});
			let extensions = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
				}
			});

			// make harvesters to spawns first, then towers, then extensions
			if (spawns.length > 0) {
				let nearest = utility.findNearest(creep, spawns);
				if (creep.transfer(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(nearest);
				}
			} else if (towers.length > 0) {
				let nearest = utility.findNearest(creep, towers);
				if (creep.transfer(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(nearest);
				}
			} else if (extensions.length > 0) {
				let nearest = utility.findNearest(creep, extensions);
				if (creep.transfer(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(nearest);
				}
			}
		} else {
			// collecting
			// find dropped energy first
			let source = utility.findClosestDroppedEnergy(creep);
			if (source) {
				if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			} else {
				if (this.collecting) {
					utility.withdrawFromFullestContainer(creep);
				} else {
					utility.harvestFromClosestSource(creep);
				}
			}
		}
	}
};

module.exports = roleHarvester;
