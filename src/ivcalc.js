//
// ivCalc : A JavaScript Implementation of the IV calculation from the Pokémon Games
//

/*
We need to get the stats and EVs from the UI, get the base stats from the database (currently from the UI)
and reverse-calculate the IVs
*/

// old functions --> reuse!
//
// stats: object that holds baseStat, iv, ev, level
// natureTable: originated from the JSON archive

function calcHP(stats) {
	return Math.floor((base_stat * 2 + iv + Math.floor(ev/4)) * (level/100)) + 10 + level;
}

function calcStat(stats) {
	return Math.floor(Math.floor((base_stat * 2 + iv + Math.floor(ev/4)) * (level/100) + 5) * nature);
}