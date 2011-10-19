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
		stats.level = parseFloat($("#ivCalc input[name='level']").val() || 1);
		stats.nature = ($("#ivCalc select[name='nature']").val()).toLowerCase();
		// stats & base stats
		stats.hpBaseStat = parseFloat($("#ivCalc input[name='hpBaseStat']").val());
		stats.hp = parseFloat($("#ivCalc input[name='hp']").val());
		stats.atkBaseStat = parseFloat($("#ivCalc input[name='atkBaseStat']").val());
		stats.atk = parseFloat($("#ivCalc input[name='atk']").val());
		stats.defBaseStat = parseFloat($("#ivCalc input[name='defBaseStat']").val());
		stats.def = parseFloat($("#ivCalc input[name='def']").val());
		stats.spdBaseStat = parseFloat($("#ivCalc input[name='spdBaseStat']").val());
		stats.spd = parseFloat($("#ivCalc input[name='spd']").val());
		stats.spatkBaseStat = parseFloat($("#ivCalc input[name='spatkBaseStat']").val());
		stats.spatk = parseFloat($("#ivCalc input[name='spatk']").val());
		stats.spdefBaseStat = parseFloat($("#ivCalc input[name='spdefBaseStat']").val());
		stats.spdef = parseFloat($("#ivCalc input[name='spdef']").val());
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
		outputTable += "<table class=\"outputTable\"><tr><td>" + results.range.hp + "</td></tr>";
		outputTable += "<tr><td>" + results.range.atk + "</td></tr>";
		outputTable += "<tr><td>" + results.range.def + "</td></tr>";
		outputTable += "<tr><td>" + results.range.spd + "</td></tr>";
		outputTable += "<tr><td>" + results.range.spatk + "</td></tr>";
		outputTable += "<tr><td>" + results.range.spdef + "</td></tr>";
		outputTable += "</table>";

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
		
		if (possibleIvs.length < 1) {
			console.log("ERROR: Impossible base stat / stat combination for " + name);
		}

		return possibleIvs;
	};
	
	//
	// Populates the results object with the IV ranges.
	//
	var generateRanges = function (stats) {
		var array = [];
		
		results.range = {};
		
		array = statsIvCalc(stats, "hp");
		results.range.hp = createRange(array);
		
		array = statsIvCalc(stats, "atk");
		results.range.atk = createRange(array);
		
		array = statsIvCalc(stats, "def");
		results.range.def = createRange(array);
		
		array = statsIvCalc(stats, "spd");
		results.range.spd = createRange(array);
		
		array = statsIvCalc(stats, "spatk");
		results.range.spatk = createRange(array);
		
		array = statsIvCalc(stats, "spdef");
		results.range.spdef = createRange(array);
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
			return Math.floor( ( Math.floor( ( ( stats[name + "BaseStat"] * 2 + stats.iv ) * stats.level ) /100 ) + 5 ) * natures.multiplier( stats.nature, name ) );
		}
		else if (typeof name === "string") {
			return Math.floor(Math.floor(((stats.hpBaseStat*2 + stats.iv)*stats.level)/100) + 10 + stats.level);
		}
		else {
			return undefined;
		}
	};
	
	return {
		calcStat : calcStat,
		statsIvCalc : statsIvCalc,
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
			multiplier = parseFloat(1.1);
		}
		else if (info[nature].decrease === name) {
			multiplier = parseFloat(0.9);
		}
		
		return multiplier;
	};
	
	return {
		multiplier : multiplier
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

function calculation () {
	var _stats = {};

	// Gets the stuff from the UI
	interfaceIO.setPokemonStats();

	_stats = interfaceIO.getStats();

	// IV calculations
	ivCalc.generateRanges(_stats);
	interfaceIO.showResultsOnUi(ivCalc.getResults());
};

$("#ivCalc :button").click(onCalculationKeydown);

var onCalculationKeydown = function (event) {
	if (event.keyCode === 32 || event.keyCode === 13) {
		calculation();
		console.log("LOL");
	}
}

$(document).ready(function () {
	$("#ivCalc :button").click(calculation)
	$("#ivCalc :button").click(onCalculationKeydown);
});
