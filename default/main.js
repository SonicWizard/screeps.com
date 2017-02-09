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
	let desiredPopulation = {
		claimer: {
			amount: 1,
			body: [MOVE,MOVE,CLAIM,CLAIM],
			script: roleClaimer
		},
		miner: {
			// Spawn the same amount of miners as there are containers
			amount: utility.getNumContainers(Game.spawns.Spawn1.room),
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
			// Spawn builders only when there are construction sites
			// Make amount based on the amount of construction needed
			amount: utility.getNumBuildersBasedOnConstruction(Game.spawns.Spawn1.room),
			//amount: 7, // TODO set a maxAmount
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
	};

    for (var name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

     for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

	// Activate towers
	 var towers = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
		 filter: { structureType: STRUCTURE_TOWER }
	 });
	 console.log('Room has ' + towers.length + ' tower(s) available');
	 towers.forEach(function (tower) {
		 structureTower.defendAndProtect(tower);
	 });

	 // Containers
	 var containersWithEnergy = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
		 filter: (i) => i.structureType == STRUCTURE_CONTAINER
	 });
	 containersWithEnergy.forEach((container) => {
		 console.log(container, 'has', container.store[RESOURCE_ENERGY], 'energy of', container.storeCapacity);
	 });

    // Creeps
	let myCreeps = {};
	for (let type in desiredPopulation) {
		myCreeps[type] = _.filter(Game.creeps, (creep) => creep.memory.role == type);
	}

    // Report on numbers of creeps
	let totalNumCreeps = 0;
	let totalDesiredCreeps = 0;
	for (let type in desiredPopulation) {
        console.log(type + 's: ' + myCreeps[type].length + ' of ' + desiredPopulation[type].amount);
        totalNumCreeps += myCreeps[type].length;
        totalDesiredCreeps += desiredPopulation[type].amount;
	}
	console.log('Total # of creeps:', totalNumCreeps, 'of', totalDesiredCreeps);

	// auto increment num of creeps
	/*
	if (totalNumCreeps == totalDesiredCreeps) {
		desiredPopulation.fighter.amount += 1;
		desiredPopulation.fighterHealer.amount += 1;
	}
	*/

	// Spawn creeps
	for (let type in desiredPopulation) {
		if (myCreeps[type].length < desiredPopulation[type].amount) {
			let spawn = Game.spawns['Spawn1'];
			let body = desiredPopulation[type].body;
			if (spawn.canCreateCreep(body) == OK) {
				// TODO if role is builder, but there's nothing to build, then 'continue' to let someone else spawn
				let creepName = spawn.createCreep(body, undefined, {role: type});
				console.log('Spawning new ' + type + ':', creepName);
				break;
			}
		}
	}

	// run the creeps
	for (var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (desiredPopulation[creep.memory.role]) {
			desiredPopulation[creep.memory.role].script.run(creep);
		}
	}
}
