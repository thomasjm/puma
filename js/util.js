var util = util || {};
util.getTranslatedContext = function(context, canv, x0, y0) {
    var that = { };

    var delegate = that.delegate = context;
	var canvas = canv;
	
	var getOrigin = that.getOrigin = function() {
		return {x: x0, y: y0};
	};

	var getCanvas = that.getCanvas = function() {
		return canvas;
	};
    
    var moveTo = that.moveTo = function(x, y) {
        delegate.moveTo(x + x0, y + y0);
    };

    var lineTo = that.lineTo = function(x, y) {
        delegate.lineTo(x + x0, y + y0);
    };

    var fillRect = that.fillRect = function(x, y, width, height) {
        delegate.fillRect(x + x0, y + y0, width, height);
    };

    var fillText = that.fillText = function(text, x, y, maxWidth) {
        delegate.fillText(text, x + x0, y + y0, maxWidth);
    };
	
    var strokeRect = that.strokeRect = function(x, y, width, height) {
        delegate.strokeRect(x + x0, y + y0, width, height);
    };
    
    var rect = that.rect = function(x, y, width, height) {
        delegate.rect(x + x0, y + y0, width, height);
    };

	var setFont = that.setFont = function(font) {
		delegate.font = font;
	};

	var measureText = that.measureText = function(text) {
		return delegate.measureText(text);
	};
	
    var setFillStyle = that.setFillStyle = function(fillStyle) {
        delegate.fillStyle = fillStyle;
    };

    var setLineWidth = that.setLineWidth = function(lineWidth) {
        delegate.lineWidth = lineWidth;
    };

    var setStrokeStyle = that.setStrokeStyle = function(strokeStyle) {
        delegate.strokeStyle = strokeStyle;
    };
    
    var beginPath = that.beginPath = function() {
        delegate.beginPath();
    };

    var stroke = that.stroke = function() {
        delegate.stroke();
    };

	var createLinearGradient = that.createLinearGradient = function(xorig, yorig, x1, y1) {
		return delegate.createLinearGradient(xorig + x0, yorig + y0, x1 + x0, y1 + y0);
	};

    var fill = that.fill = function() {
        delegate.fill();
    };
    
    var init = function() {
        return that;
    };

    return init();
}
