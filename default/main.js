var roleAttacker = require('role.attacker');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var structureTower = require('structure.tower');
var utility = require('utility');

module.exports.loop = function () {
    let desiredPopulation = {
        attackers: {
            amount: 4,
            body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK]
        },
        harvesters: {
            amount: 5,
            body: [WORK,CARRY,CARRY,MOVE]
        },
		miners: {
			// Spawn the same amount of miners as there are containers
			amount: utility.getNumContainers(Game.spawns.Spawn1.room),
			body: [WORK,WORK,MOVE]
		},
        upgraders: {
            amount: 6,
            body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE]
        },
        builders: {
			// Spawn builders only when there are construction sites
			// Make amount based on the amount of construction needed
            amount: utility.getNumBuildersBasedOnConstruction(Game.spawns.Spawn1.room),
            body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE]
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
	 console.log('Spawn has ' + towers.length + ' towers available');
	 towers.forEach(function (tower) {
		 structureTower.defendAndProtect(tower);
	 });

    // Creeps
	let myCreeps = {
		attackers: _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker'),
		harvesters: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
		miners: _.filter(Game.creeps, (creep) => creep.memory.role == 'miner'),
		upgraders: _.filter(Game.creeps, (creep) => {
			return creep.memory.role == 'upgrader';
		}),
		builders: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
	};

    // Report on numbers of creeps
	// TODO make this dynamic based on types in desiredPopulation
	// similar to for in loop below
	let totalNumCreeps = 0;
	let totalDesiredCreeps = 0;
	for (let type in desiredPopulation) {
        console.log(type + ': ' + myCreeps[type].length + ' of ' + desiredPopulation[type].amount);
        totalNumCreeps += myCreeps[type].length;
        totalDesiredCreeps += desiredPopulation[type].amount;
	}
	console.log('Total # of creeps:', totalNumCreeps, 'of', totalDesiredCreeps);


	for (let type in desiredPopulation) {
		if (myCreeps[type].length < desiredPopulation[type].amount) {
			let spawn = Game.spawns['Spawn1'];
			let body = desiredPopulation[type].body;
			if (spawn.canCreateCreep(body) == OK) {
				let role = type.substring(0, type.length -1);
				// TODO if role is builder, but there's nothing to build, then 'continue' to let someone else spawn
				let creepName = spawn.createCreep(body, undefined, {role: role});
				console.log('Spawning new ' + role + ':', creepName);
				break;
			}
		}
	}

	// run the creeps
	for (var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (creep.memory.role == 'attacker') {
			roleAttacker.run(creep);
		}
		if (creep.memory.role == 'harvester') {
			roleHarvester.run(creep);
		}
		if (creep.memory.role == 'miner') {
			roleMiner.run(creep);
		}
		if (creep.memory.role == 'upgrader') {
			roleUpgrader.run(creep);
		}
		if (creep.memory.role == 'builder') {
			roleBuilder.run(creep);
		}
	}
}
