/// <reference path="Interfaces.ts" />
var Frac = (function () {
    function Frac(context, num, denom) {
        this.context = context;
        this.num = num;
        this.denom = denom;
    }
    Frac.prototype.getBB = function () {
        return { width: 10, height: 10 };
    };
    Frac.prototype.getWidth = function () {
        return Math.max(this.num.getWidth(), this.denom.getWidth());
    };
    Frac.prototype.getHeight = function () {
        return this.num.getHeight() + this.denom.getHeight() + Frac.LINE_WIDTH;
    };
    Frac.prototype.draw = function (context) {
        var numBB = this.num.getBB();
        var denomBB = this.num.getBB();
        var width = this.getWidth();
        var height = this.getHeight();
        console.log("Frac height is: ", height);
        var lineY = this.num.getHeight() + Frac.LINE_Y_PADDING;
        var lineX = 0;
        this.context.beginPath();
        this.context.moveTo(lineX, lineY);
        this.context.lineTo(lineX + width, lineY);
        this.context.stroke();
        this.num.draw(Util.getTranslatedContext(context, context.getCanvas(), 0, 0));
        this.denom.draw(Util.getTranslatedContext(context, context.getCanvas(), 0, lineY + Frac.LINE_Y_PADDING));
    };
    Frac.LINE_WIDTH = 1;
    Frac.LINE_Y_PADDING = 3;
    return Frac;
})();
;
