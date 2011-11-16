IVCalcTest = TestCase("IVCalcTest");

IVCalcTest.prototype.test_create_range_return_string = function () {
	assertString("createRange must return a string", createRange([1,3,4,5,6,7]) );
};

IVCalcTest.prototype.test_create_range_correct_range = function () {
	assertEquals("createRange must return a range with the first and last elements", "1 - 3", createRange([1,2,3]) );
	assertEquals("createRange must return the SAME range independently of the array's length", createRange([1,2,3]), createRange([1,2,2,2,2,2,2,3]));
}

IVCalcTest.prototype.test_natures_multiplier_return_correct_value = function () {
	assertNumber("natures.multiplier must return a number", natures.multiplier("adamant", "def"));
	assertEquals("natures.multiplier must return 1.1 if stat is to be boosted", 1.1, natures.multiplier("bold", "def"));
	assertEquals("natures.multiplier must return 0.9 if stat is to be diminished", 0.9, natures.multiplier("jolly", "spatk"));
	assertEquals("natures.multiplier must return 1.1 if stat is to be boosted", 1.1, natures.multiplier("jolly", "spd"));
};

IVCalcTest.prototype.test_ivCalc_calcStats_returns_right_values = function () {
	var stats = {};
	
	stats.level = 100;
	stats.nature = "jolly";
	stats.iv = 31;
	stats.hpBaseStat = 108;
	stats.atkBaseStat = 130;
	stats.defBaseStat = 95;
	
	assertEquals("ivCalc.calcStats must calculate right HP (EVs = 0)", 357, ivCalc.calcStat(stats, "hp"));
	assertEquals("ivCalc.calcStats must calculate right Atk (EVs = 0)", 296, ivCalc.calcStat(stats, "atk"));
	assertEquals("ivCalc.calcStats must calculate right Def (EVs = 0)", 226, ivCalc.calcStat(stats, "def"));
};

IVCalcTest.prototype.test_ivCalc_calcStats_needs_name_as_string = function () {
	var stats = {};
	
	assertUndefined("ivCalc.calcStats must return UNDEFINED if name isn't a string", ivCalc.calcStat(stats));
	assertUndefined("ivCalc.calcStats must return UNDEFINED if name isn't a string", ivCalc.calcStat(stats, 0));
	assertUndefined("ivCalc.calcStats must return UNDEFINED if name isn't a string", ivCalc.calcStat(stats, function () {}));
};

IVCalcTest.prototype.test_ivCalc_statsIvCalc_returns_array = function () {
	var stats = {};
	
	stats.level = 100;
	stats.nature = "jolly";
	stats.spdBaseStat = 102;
	stats.spd = 259;
	
	assertArray("ivCalc.statsIvCalc must return an array", ivCalc.statsIvCalc(stats, "spd"));
};

IVCalcTest.prototype.test_ivCalc_statsIvCalc_returns_correct_array = function () {
	var stats = {};
	
	stats.level = 27;
	stats.nature = "jolly";
	stats.spdefBaseStat = 85;
	stats.spdef = 58;
	
	assertEquals("ivCalc.statsIvCalc must return correct range", [27,28,29], ivCalc.statsIvCalc(stats, "spdef"));
	
	stats.level = 100;
	stats.spdBaseStat = 102;
	stats.spd = 259;
	
	assertEquals("ivCalc.statsIvCalc must return correct range", [27], ivCalc.statsIvCalc(stats, "spd"));
};
	