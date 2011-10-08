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

//
// natures is the object responsible for translating increases and decreases given the
// nature's name.
//
var natures = (function () {
	var info = {
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
		hasty: {
		increase: "spd",
		decrease: "def"
		},
		jolly: {
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

	var multiplier = function (nature, name) {
		var multiplier = 1;
		
		if (info[nature].increase === name) {
			multiplier = 1.1;
		}
		else if (info[nature].decrease === name) {
			multiplier = 0.9;
		}
		
		return multiplier;
	};

})(); // natures

var ivCalc = (function () {
	
	//
	// This function is the "inverse" of the HP calculation, which is a non-linear
	// function itself. It returns an array with the possible IVs calculated.
	// hp = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100)) + 10 + level
	// 
	// A brute force method is being employed to find the IVs. We have a finite and very small set
	// of possible IVs, so it's no big deal in performance - but I hope it won't be used in more complex
	// programs.
	//
	// @PARAM: stats.hp, stats.baseStat, stats.evs and stats.level
	// @RETURN: possibleIvs = array with the possible values for the HP IV
	//
	var hpIvCalc = function (stats) {
		var possibleIvs = [],
			evs = stats.evs || 0,
			i = 0;
		
		for (i = 0; i < 32; i += 1) {
			stats.iv = i;
			
			if (calcHp(stats) === stats.hp) {
				possibleIvs.push(i);
			}
		}
		
		return possibleIvs;
	};

	//
	// This function is the "inverse" of the HP calculation, which is a non-linear
	// function itself. It returns an array with the possible IVs calculated.
	// stat = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100) + 5) * nature)
	// 
	// A brute force method is being employed to find the IVs. We have a finite and very small set
	// of possible IVs, so it's no big deal in performance - but I hope it won't be used in more complex
	// programs.
	//
	// @PARAM: type (atk, def, etc), stats.value, stats.baseStatValue,
	// stats.evs, stats.nature and stats.level
	// @RETURN: possibleIvs = array with the possible values for the IV
	//
	var statsIvCalc = function (stats, type) {
		var possibleIvs = [],
			evs = stats.evs || 0,
			name = type;
			i = 0;
		
		for (i = 0; i < 32; i += 1) {
			stats.iv = i;
			
			if (calcStat(stats, name) === stats.value) {
				possibleIvs.push(i);
			}
		}
		
		return possibleIvs;
	};
	
	var calcHp = function (stats) {
		return (Math.floor(((stats.baseStat*2 + stats.iv + Math.floor(stats.evs/4))*stats.level)/100) + 10 + stats.level);
	};

	//
	// name: atk, def, spd, spatk, spdef
	//
	var calcStat = function (stats, name) {
		if (typeof name === "string") {
			return (Math.floor(((stats.baseStat * 2 + stats.iv + Math.floor(stats.evs/4))*stats.level)/100) + 5) * natures.multiplier(stats.nature, name);
		}
		else {
			return (Math.floor(((stats.baseStat * 2 + stats.iv + Math.floor(stats.evs/4))*stats.level)/100) + 5);
		}
	};
	
	return {
		hpIvCalc : hpIvCalc,
		statsIvCalc : statsIvCalc
	};
})(); // ivCalc