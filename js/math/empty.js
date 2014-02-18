/*global CanvasText CanvasInput */

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
		var origin = context.getOrigin();

		// new CanvasText( context.getCanvas(), {
		// 	x: 0,
		// 	y: 0,
		// 	width: width,
		// 	height: height,
		// 	context: context,
		// 	placeholder: 'Enter your username...'
		// } );


	    var input = new CanvasInput({
            canvas: fe.c ,
            context: context,
            fontSize: 14,
            fontFamily: 'Arial',
            fontColor: '#212121',
            fontWeight: 'bold',
            width: width,
            height: height,
            padding: 0,
            placeHolder: 'a',

            boxShadow: '0px 0px 0px rgba(255, 255, 255, 1)',
            innerShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',

            borderRadius: 0,
            padding: 0,
            borderWidth: 0

        });
    };

    var init = function() {
        return that;
    };

    return init();
};
