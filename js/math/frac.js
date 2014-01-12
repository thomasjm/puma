var math = math || {};
math.frac = math.frac || {};
math.frac.fracFactory = function(num, denom) {

    var that = {};

    var LINE_WIDTH = 1;
    var LINE_Y_PADDING = 3;

    var num = that.num || math.empty.emptyFactory();
    var denom = that.denom || math.empty.emptyFactory();

    var getWidth = that.getWidth = function() {
        return Math.max( num.getWidth(), denom.getWidth() );
    };

    var getHeight = that.getHeight = function() {
        return num.getHeight() + denom.getHeight() + LINE_WIDTH;
    };
    
    var draw = that.draw = function(context) {
        var numBB = num.getBB();
        var denomBB = num.getBB();

        var width = getWidth();
        var height = getHeight();

        console.log("Frac height is: ", height);

        var lineY = num.getHeight() + LINE_Y_PADDING;
        var lineX = 0;

        context.beginPath();
        context.moveTo(lineX, lineY);
        context.lineTo(lineX + width, lineY);
        context.stroke();

        num.draw( util.getTranslatedContext(context, 0, 0) );
        denom.draw( util.getTranslatedContext(context, 0, lineY + LINE_Y_PADDING) );            
    };
    
    var init = function() {
        console.log("Initializing fraction!");
        return that;
    };

    return init();
};
