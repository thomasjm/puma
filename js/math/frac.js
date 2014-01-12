var math = math || {};
math.frac = math.frac || {};
math.frac.fracFactory = function(num, denom) {

	var that = {};

	var LINE_WIDTH = 1;
	
	var num = that.num || math.emptyFactory();
	var denom = that.denom || math.emptyFactory();

	var draw = function(context) {
		var width = Math.max( num.getWidth(), denom.getWidth() );
		var height = num.getHeight + denom.getHeight + LINE_WIDTH;

		console.log("Frac height is: ", height);
	};
	
	var init = function() {
		console.log("Initializing fraction!");
		return that;
	};

	return init();
};
