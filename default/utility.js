var utility = {
	source: {
		types: {
			CLOSEST: 0,
			BIGGEST: 1
		}
	},
	findBiggestSource: function(creep) {
		let sources = creep.room.find(FIND_SOURCES);
		let biggestSource = sources[0];
		sources.forEach(function(source) {
			if (source.energy > biggestSource.energy) {
				biggestSource = source;
			}
		});
		//console.log('Biggest source for', creep.memory.role, creep.name, 'is', biggestSource.id);
		return biggestSource;
	},
	findClosestActiveSource: (creep) => creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE),
	findClosestDroppedEnergy: (creep) => creep.pos.findClosestByPath(FIND_DROPPED_ENERGY),
	findSource: function(creep, type) {
		if (type === this.source.types.CLOSEST) {
			return this.findClosestActiveSource(creep);
		}
		if (type === this.source.types.BIGGEST) {
			return this.findBiggestSource(creep);
		}
	},
	findNearest: (creep, targets) => creep.pos.findClosestByPath(targets),
	harvestFromClosestSource: function (creep) {
		let source = this.findClosestActiveSource(creep);

		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source);
		}
	},
	withdrawFromClosestContainer: (creep) => {
		let containers = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0);
			}
		});
		let closestContainer = creep.pos.findClosestByPath(containers);
		if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(closestContainer);
		}
	},
	withdrawFromFullestContainer: (creep) => {
		let containers = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0);
			}
		});

		let sortedContainers = containers.sort((a, b) => {
			if (a.store[RESOURCE_ENERGY] > b.store[RESOURCE_ENERGY]) {
				return -1;
			}
			if (a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY]) {
				return 1;
			}
			return 0;
		});

		let fullestContainer = sortedContainers[0];

		if (creep.withdraw(fullestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(fullestContainer);
		}
	},
	getNumContainers: (room) => {
		var containers = room.find(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_CONTAINER }
		});
		return containers.length;
	},
	getNumBuildersBasedOnConstruction: (room) => {
		let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
		let progressTotal = 0;
		let progress = 0;
		constructionSites.forEach((site) => {
			progressTotal += site.progressTotal;
			progress += site.progress;
		});

		let remainingProgress = progressTotal - progress;
		let numBuilders = Math.ceil(remainingProgress / 1000);

		console.log('construction need is', progressTotal, 'and remaining progress is', remainingProgress, 'so number of builders will be', numBuilders);

		return numBuilders;
	}
};

module.exports = utility;
