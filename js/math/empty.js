var math = math || {};
math.empty = empty || {};
empty.emptyFactory = function() {
	var that = {};

	var getWidth = that.getWidth = function() {
		return 20;
	};

	var getHeight = that.getHeight = function() {
		return 30;
	};
	
	var draw = function(context) {
		var width = that.getWidth();
		var height = that.getHeight();
	};
	
	var init = function() {
		console.log("Initializing empty!");
		return that;
	};

	return init();
};
