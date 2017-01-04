var utility = require('utility');

var roleMiner = {
	run: function(creep) {
		// find available containers to fill
		let containers = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) &&
					(structure.store[RESOURCE_ENERGY] < structure.storeCapacity) &&
					(structure.pos.lookFor(LOOK_CREEPS).length === 0 ||
					 structure.pos.lookFor(LOOK_CREEPS)[0].memory.role !== 'miner' ||
					 structure.pos.lookFor(LOOK_CREEPS)[0] === creep);
			}
		});

		if (containers.length > 0) {
			// find the nearest container and start mining
			let nearestContainer = utility.findNearest(creep, containers);
			if (creep.pos.getRangeTo(nearestContainer) == 0) {
				var source = creep.pos.findClosestByPath(FIND_SOURCES);
				creep.harvest(source);
			} else {
				creep.moveTo(nearestContainer);
			}
		}
	}
};

module.exports = roleMiner;
