IVCalcTest = TestCase("IVCalcTest");

IVCalcTest.prototype.test_create_range = function () {
	assertString("createRange must return a string", createRange([1,3,4,5,6,7]) );
	assertEquals("createRange must return a range with the first and last elements", "1 - 3", createRange([1,2,3]) );
	assertEquals("createRange must return the SAME range independently of the array's length", createRange([1,2,3]), createRange([1,2,2,2,2,2,2,3]));
};

IVCalcTest.prototype.test_natures_multiplier_return_correct_value = function () {
	assertNumber("natures.multiplier must return a number", natures.multiplier("adamant", "def"));
	assertEquals("natures.multiplier must return 1.1 if stat is to be boosted", 1.1, natures.multiplier("bold", "def"));
	assertEquals("natures.multiplier must return 0.9 if stat is to be diminished", 0.9, natures.multiplier("jolly", "spatk"));
};