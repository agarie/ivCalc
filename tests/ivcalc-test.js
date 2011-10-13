IVCalcTest = TestCase("IVCalcTest");

IVCalcTest.prototype.test_create_range = function () {
	assertString("createRange must return a string", createRange([1,3,4,5,6,7]) );
	assertEquals("createRange must return a range with the first and last elements", "1 - 3", createRange([1,2,3]) );
	assertEquals("createRange must return the SAME range independently of the array's length", createRange([1,2,3]), createRange([1,2,2,2,2,2,2,3]));
};