var math = math || {};
math.empty = math.empty || {};
math.empty.emptyFactory = function() {
    var that = {};

    var getWidth = that.getWidth = function() {
        return 20;
    };

    var getHeight = that.getHeight = function() {
        return 30;
    };

    var getBB = that.getBB = function() {
        return {
            width: 20,
            height: 30
        };
    };
    
    var draw = that.draw = function(context) {
        var width = that.getWidth();
        var height = that.getHeight();
        
        context.strokeRect(0, 0, width, height);        
    };
    
    var init = function() {
        console.log("Initializing empty!");
        return that;
    };

    return init();
};
