//
// ivCalc : A JavaScript Implementation of the IV calculation from the Pokémon Games
//

/*
We need to get the stats and EVs from the UI, get the base stats from the database (currently from the UI)
and reverse-calculate the IVs

HP = ((2 * BaseStat + IV + (EV / 4)) * Level / 100 + Level + 10)

HP - 10 - Level = (2 * BaseStat + IV + (EV / 4)) * Level / 100

Stat = (((2 * BaseStat + IV + (EV / 4)) * Level / 100 + 5) * Nature)



*/

// old functions --> reuse!
//
// stats: object that holds baseStat, iv, ev, level

// Must decide where to store this object lol
var natures = {
	hardy: {
	increase: "none",
	decrease: "none"
	},
	docile: {
	increase: "none",
	decrease: "none"
	},
	serious: {
	increase: "none",
	decrease: "none"
	},
	bashful: {
	increase: "none",
	decrease: "none"
	},
	quirky: {
	increase: "none",
	decrease: "none"
	},
	lonely: {
	increase: "atk",
	decrease: "def"
	},
	adamant: {
	increase: "atk",
	decrease: "spatk"
	},
	naughty: {
	increase: "atk",
	decrease: "spdef"
	},
	brave: {
	increase: "atk",
	decrease: "spd"
	},
	bold: {
	increase: "def",
	decrease: "atk"
	},
	impish: {
	increase: "def",
	decrease: "spatk"
	},
	lax: {
	increase: "def",
	decrease: "spdef"
	},
	relaxed: {
	increase: "def",
	decrease: "spd"
	},
	timid: {
	increase: "spd",
	decrease: "atk"
	},
	hasty {
	increase: "spd",
	decrease: "def"
	},
	jolly {
	increase: "spd",
	decrease: "spatk"
	},
	naive: {
	increase: "spd",
	decrease: "spdef"
	},
	modest: {
	increase: "spatk",
	decrease: "atk"
	},
	mild: {
	increase: "spatk",
	decrease: "def"
	},
	rash: {
	increase: "spatk",
	decrease: "spdef"
	},
	quiet: {
	increase: "spatk",
	decrease: "spd"
	},
	calm: {
	increase: "spdef",
	decrease: "atk"
	},
	gentle: {
	increase: "spdef",
	decrease: "def"
	},
	careful: {
	increase: "spdef",
	decrease: "spatk"
	},
	sassy: {
	increase: "spdef",
	decrease: "spd"
	}
};

var ivCalc = function () {
	
	// This function is the "inverse" of the HP calculation, which is a non-linear
	// function itself. It returns an array with the possible IVs calculated.
	// 
	// I'm currently employing a very naive approach, so expect this to change soon. :)
	//
	// @PARAM: stats.hp, stats.baseStat, stats.ev (for the moment, it's considered zero) and stats.level
	// @RETURN: possibleIvs = array with the possible values for the HP IV
	var hpIvCalc = function (stats) {
	// This is the formula for HP given base stats, ivs, evs and level	
	// hp = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100)) + 10 + level
	
		var possibleIvs = [],
			evs = stats.evs || 0;
		
		possibleIvs.push(Math.floor((100*(stats.hp - 10 - stats.level)/stats.level) - 2*stats.baseStats - evs/4));
		
		return possibleIvs;
	};

	var statsIvCalc = function (stats) {
	// For the other stats...
	// stat = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100) + 5) * nature);
	};
	
};