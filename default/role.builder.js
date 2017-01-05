var utility = require('utility');

var roleBuilder = {
	collecting: true,
    /** @param {Creep} creep **/
    run: function(creep) {

		// set status
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
			if (this.collecting) {
				creep.say('collecting');
			} else {
				creep.say('harvesting');
			}
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if (creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length > 0) {
				let nearest = utility.findNearest(creep, targets);
				if (creep.build(nearest) == ERR_NOT_IN_RANGE) {
					creep.moveTo(nearest);
				}
			} else {
				// commit suicide since there's nothing to build
				creep.suicide();
			}
	    }
	    else {
			if (this.collecting) {
				utility.withdrawFromFullestContainer(creep);
			} else {
				utility.harvestFromClosestSource(creep);
			}
	    }
	}
};

module.exports = roleBuilder;
