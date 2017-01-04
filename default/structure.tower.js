let structureTower = {
	defendAndProtect: function(tower) {
		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		} else {
			let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < structure.hitsMax
			});
			if (closestDamagedStructure) {
				tower.repair(closestDamagedStructure);
			}
		}
	}
};

module.exports = structureTower;
