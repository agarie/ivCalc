//
// ivCalc : A JavaScript Implementation of the IV calculation from the Pokémon Games
//

//
// The object stats has the information from the UI, making it acessible to the calculator.
// Its variables are:
// - level
// - nature
// - hp
// - atk
// - def
// - spd
// - spatk
// - spdef
// - hpBaseStat
// - atkBaseStat
// - defBaseStat
// - spdBaseStat
// - spatkBaseStat
// - spdefBaseStat
//

var interfaceIO = (function () {
	"use strict";
	var stats = {};

	var setPokemonStats = function () {
		// Get the parameters from the UI
		stats.level = $("#ivCalc input[name='level']").val() || 1;
		stats.nature = $("#ivCalc select[name='nature']").val();
		// stats & base stats
		stats.hpBaseStat = $("#ivCalc input[name='hpBaseStat']").val();
		stats.hp = $("#ivCalc input[name='hp']").val();
		stats.atkBaseStat = $("#ivCalc input[name='atkBaseStat']").val();
		stats.atk = $("#ivCalc input[name='atk']").val();
		stats.defBaseStat = $("#ivCalc input[name='defBaseStat']").val();
		stats.def = $("#ivCalc input[name='def']").val();
		stats.spdBaseStat = $("#ivCalc input[name='spdBaseStat']").val();
		stats.spd = $("#ivCalc input[name='spd']").val();
		stats.spatkBaseStat = $("#ivCalc input[name='spatkBaseStat']").val();
		stats.spatk = $("#ivCalc input[name='spatk']").val();
		stats.spdefBaseStat = $("#ivCalc input[name='spdefBaseStat']").val();
		stats.spdef = $("#ivCalc input[name='spdef']").val();
	};
	
	var getStats = function () {
		return stats;
	};
	
	//
	// This function receives a results object as a parameter and creates at the UI
	// a table with the resulting IV ranges.
	//
	// results must have the attributes range.hp, range.atk, ... range.spdef.
	//
	var showResultsOnUi = function (results) {
		var outputTable = "";
	
		// Must clean the previous calculation's output
		//
		// Hide the div to avoid excessive repaints.
		//
		$("#outputIvs").empty().hide();

		outputTable += "<span>IV Ranges</span>";
		outputTable += "<table class=\"outputTable\"><tr>" + results.range.hp + "</tr>";
		outputTable += "<tr>" + results.range.atk + "</tr>";
		outputTable += "<tr>" + results.range.def + "</tr>";
		outputTable += "<tr>" + results.range.spd + "</tr>";
		outputTable += "<tr>" + results.range.spatk + "</tr>";
		outputTable += "<tr>" + results.range.spdef + "</tr>";

		$("#outputIvs").append(outputTable).show();
	};
	
	return {
		setPokemonStats : setPokemonStats,
		getStats : getStats,
		showResultsOnUi : showResultsOnUi
	};
})();
		
//
// A brute force method is being employed to find the IVs. We have a finite and very small set
// of possible IVs, so it's no big deal in performance - but I hope it won't be used in more complex
// programs.
//
// Methods
// generateRanges : Populates an internal results object with the correspoding IV ranges for the stats.
// getResults : 
//
var ivCalc = (function () {
	"use strict";
	var results = {};

	//
	// This function is the "inverse" of the stat calculation, which is a non-linear
	// function itself. It returns an array with the possible IVs calculated.
	//
	// hp = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100)) + 10 + level
	// stat = (base_stat * 2 + iv + Math.floor(ev/4)) * (level/100) + 5) * nature)
	// 
	// PARAM: name ("atk", "def", etc) and stats (described at the beginning)
	// RETURN: possibleIvs = array with the possible values for the IV
	//
	var statsIvCalc = function (stats, name) {
		var possibleIvs = [],
			i = 0;
		
		for (i = 0; i < 32; i += 1) {
			stats.iv = i;
			
			if (calcStat(stats, name) === stats[name]) {
				possibleIvs.push(i);
			}
		}
		
		return possibleIvs;
	};
	
	//
	// Populates the results object with the IV ranges.
	//
	var generateRanges = function (stats) {
		results.range.hp = createRange(statsIvCalc(stats, "hp"));
		results.range.atk = createRange(statsIvCalc(stats, "atk"));
		results.range.def = createRange(statsIvCalc(stats, "def"));
		results.range.spd = createRange(statsIvCalc(stats, "spd"));
		results.range.spatk = createRange(statsIvCalc(stats, "spatk"));
		results.range.spdef = createRange(statsIvCalc(stats, "spdef"));
	};
	
	//
	// Returns the results object. Must be called AFTER generateRanges!
	//
	var getResults = function () {
		return results;
	};
	
	//
	// This function calculates the "name" stat using the parameters found in the stats object.
	// name MUST BE SETTED FOR IT TO WORK CORRECTLY.
	//
	var calcStat = function (stats, name) {
		if (typeof name === "string" && name !== "hp") {
			return (Math.floor(((stats[name + "baseStat"] * 2 + stats.iv)*stats.level)/100) + 5) * natures.multiplier(stats.nature, name);
		}
		else if (typeof name === "string") {
			return (Math.floor(((stats.hpBaseStat*2 + stats.iv)*stats.level)/100) + 10 + stats.level);
		}
		else {
			console.log("ERROR (in ivCalc.calcStat): the name parameter must be a string.");
			return undefined;
		}
	};
	
	return {
		generateRanges : generateRanges,
		getResults : getResults
	};
})(); // ivCalc

//
// natures is the object responsible for translating increases and decreases given the
// nature's name.
//
// Methods
// natures.multiplier(nature, name): Generates the stat multiplier for the given "name" stat;
// use stat.nature!
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

	//
	// Responsible for generating multipliers based on the stat and the nature.
	// If the nature ISN'T specified, it will return 1.
	//
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

//
// createRange takes an array input and returns a string representing the array's range
// in a "FIRST - LAST" format.
//
var createRange = function (array) {
	var range = "";
	
	range += array[0].toString();
	range += " - ";
	range += array[array.length - 1].toString();
	
	return range;
};

$(document).ready(function () {
	var _stats = {};
	
	// Gets the stuff from the UI
	interfaceIO.setPokemonStats();
	
	_stats = interfaceIO.getStats();
	
	// IV calculations
	ivCalc.generateRanges(_stats);
	interfaceIO.showResultsOnUi(ivCalc.getResults());
});