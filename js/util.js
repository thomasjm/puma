var util = util || {};
util.getTranslatedContext = function(context, x0, y0) {
    var that = { };

    var delegate = that.delegate = context;
    
    var moveTo = that.moveTo = function(x, y) {
        delegate.moveTo(x + x0, y + y0);
    };

    var lineTo = that.lineTo = function(x, y) {
        delegate.lineTo(x + x0, y + y0);
    };

    var fillRect = that.fillRect = function(x, y, width, height) {
        delegate.fillRect(x + x0, y + y0, width, height);
    };

    var strokeRect = that.strokeRect = function(x, y, width, height) {
        delegate.strokeRect(x + x0, y + y0, width, height);
    };
    
    var rect = that.rect = function(x, y, width, height) {
        delegate.rect(x + x0, y + y0, width, height);
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

    var fill = that.fill = function() {
        delegate.fill();
    };
    
    var init = function() {
        return that;
    };

    return init();
}
