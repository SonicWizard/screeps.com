var roleAttacker = require('role.attacker');
var roleHealerBasic = require('role.healer.basic');
var roleHealerFighter = require('role.healer.fighter');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var structureTower = require('structure.tower');
var utility = require('utility');

module.exports.loop = function () {
	let desiredPopulations = {
		"Spawn1": {
			claimer: {
				amount: 0,
				body: [MOVE,MOVE,CLAIM,CLAIM],
				script: roleClaimer
			},
			miner: {
				amount: 5,
				body: [WORK,WORK,MOVE],
				script: roleMiner
			},
			harvester: {
				amount: 5,
				body: [WORK,CARRY,CARRY,CARRY,MOVE],
				script: roleHarvester
			},
			fighter: {
				amount: 5,
				body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK],
				script: roleAttacker
			},
			fighterHealer: {
				amount: 3,
				body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,HEAL],
				script: roleHealerFighter
			},
			basicHealer: {
				amount: 0,
				body: [MOVE,HEAL],
				script: roleHealerBasic
			},
			upgrader: {
				amount: 5,
				body: [WORK,WORK,CARRY,MOVE],
				script: roleUpgrader
			},
			builder: {
				amount: 0,
				body: [WORK,WORK,CARRY,MOVE],
				script: roleBuilder
			},
			bigFighter: {
				amount: 1,
				body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK],
				script: roleAttacker
			},
			bigHarvester: {
				amount: 0,
				body: [WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE],
				script: roleHarvester
			},
			bigUpgrader: {
				amount: 1,
				body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE],
				script: roleUpgrader
			}
		},
		"Spawn2": {
			builder: {
				amount: 2,
				body: [WORK,WORK,CARRY,MOVE],
				script: roleBuilder
			},
			harvester: {
				amount: 2,
				body: [WORK,CARRY,CARRY,CARRY,MOVE],
				script: roleHarvester
			},
			miner: {
				amount: 1,
				body: [WORK,WORK,MOVE],
				script: roleMiner
			},
			upgrader: {
				amount: 4,
				body: [WORK,WORK,CARRY,MOVE],
				script: roleUpgrader
			}
		}
	};

	// clear creeps
	for(var name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}

	// report on spawn/room and spawn creeps
	for (let spawn in desiredPopulations) {
		let spawnObj = Game.spawns[spawn];
		let room = spawnObj.room;

		console.log('---', spawnObj.name, 'in room', room.name, 'has:');
		console.log('-', room.energyAvailable + ' energy available');

		activateTowers(spawnObj);

		// Containers
		let containers = spawnObj.room.find(FIND_STRUCTURES, {
			filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
		});
		containers.forEach((container) => {
			console.log(container, 'has', container.store[RESOURCE_ENERGY], 'energy of', container.storeCapacity);
		});

		// Creeps
		let myCreeps = {};
		for (let type in desiredPopulations[spawn]) {
			myCreeps[type] = _.filter(Game.creeps, (creep) => creep.memory.role == type && creep.room == room);
		}

		// Report on numbers of creeps
		let totalNumCreeps = 0;
		let totalDesiredCreeps = 0;
		for (let type in desiredPopulations[spawn]) {
			console.log(type + 's: ' + myCreeps[type].length + ' of ' + desiredPopulations[spawn][type].amount);
			totalNumCreeps += myCreeps[type].length;
			totalDesiredCreeps += desiredPopulations[spawn][type].amount;
		}
		console.log('Total # of creeps:', totalNumCreeps, 'of', totalDesiredCreeps);

		// Spawn creeps
		for (let type in desiredPopulations[spawn]) {
			if (myCreeps[type].length < desiredPopulations[spawn][type].amount) {
				let body = desiredPopulations[spawn][type].body;
				if (spawnObj.canCreateCreep(body) == OK) {
					// TODO if role is builder, but there's nothing to build, then 'continue' to let someone else spawn
					let creepName = spawnObj.createCreep(body, undefined, {role: type});
					console.log('Spawning new ' + type + ':', creepName);
					break;
				}
			}
		}

		// run the creeps
		for (var name in Game.creeps) {
			var creep = Game.creeps[name];
			if (desiredPopulations[spawn][creep.memory.role]) {
				desiredPopulations[spawn][creep.memory.role].script.run(creep);
			}
		}
	}

}

function activateTowers(spawn) {
	var towers = spawn.room.find(FIND_MY_STRUCTURES, {
		filter: { structureType: STRUCTURE_TOWER }
	});
	console.log('-', towers.length + ' tower(s)');
	towers.forEach(function (tower) {
		structureTower.defendAndProtect(tower);
	});
}
