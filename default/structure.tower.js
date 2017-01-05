let structureTower = {
	repairClosest: true,
	defendAndProtect: function(tower) {
		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		} else {
			if (this.repairClosest) {
				let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => structure.hits < structure.hitsMax
				});
				if (closestDamagedStructure) {
					tower.repair(closestDamagedStructure);
				}
			} else {
				let damagedStructures = tower.room.find(FIND_STRUCTURES);
				damagedStructures.sort(function(a, b) {
					if (((a.hitsMax - a.hits) / a.hitsMax) > ((b.hitsMax - b.hits) / b.hitsMax)) {
						return -1;
					}
					if (((a.hitsMax - a.hits) / a.hitsMax) < ((b.hitsMax - b.hits) / b.hitsMax)) {
						return 1;
					}
					return 0;
				});

				if (damagedStructures) {
					let mostDamagedStructure = damagedStructures[0];
					console.log('The most damaged structure is', mostDamagedStructure, 'with', mostDamagedStructure.hitsMax, 'maxHits and', mostDamagedStructure.hits, 'hits:', ((mostDamagedStructure.hitsMax - mostDamagedStructure.hits) / mostDamagedStructure.hitsMax * 100).toFixed(3) + '% structural loss');
					tower.repair(mostDamagedStructure);
				}
			}
		}
	}
};

module.exports = structureTower;
