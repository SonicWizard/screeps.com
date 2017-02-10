var utility = require('utility');

var roleBuilder = {
	collecting: true, // true will collect from containers, false will harvest from sources
    /** @param {Creep} creep **/
    run: function(creep) {

		this.collecting = utility.areContainersInRoom(creep);

		// set status
	    if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
			if (this.collecting) {
				creep.say('collecting');
			} else {
				creep.say('harvesting');
			}
	    }
	    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
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
				//creep.suicide();
				//this.die(creep);

				let builderFlag = Game.flags.BuilderFlag;
				this.moveToFlag(creep, builderFlag);
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
	},
	die: function(creep) {
		creep.suicide();
	},
	moveToFlag: function(creep, flag) {
		if (flag) {
			creep.moveTo(flag);
		}
	}
};

module.exports = roleBuilder;
