/// <reference path="Interfaces.ts" />


class Frac implements Drawable {

    static LINE_WIDTH = 1;
    static LINE_Y_PADDING = 3;

    num: Drawable;
    denom: Drawable;
    context: Context;
    bb: Dimensions;

    constructor(num: Drawable, denom: Drawable);
    constructor(num: any, denom: any) {
        this.num = num || new CanvasText(this);
        this.denom = denom || new CanvasText(this);
    }

    getBB(context: Context): Dimensions {
        return this.bb;
    }

    getHorizontalLine(context: Context) {
        return 42;
    }

    erase(context: Context) {
        var bb = this.getBB(context);
        console.log('erasing bb: ', bb);
        context.clearRect(0, 0, bb.width, bb.height);
    }

    draw(context: Context, depth = 0): void {
        this.context = context;

        // If we've been drawn before, erase before proceeding
        if (this.bb) {
            this.erase(context);
        }

        var numBB = this.num.getBB(context);
        var denomBB = this.denom.getBB(context);

        var width = Math.max(numBB.width, denomBB.width);

        var lineY = numBB.height + Frac.LINE_Y_PADDING;
        var lineX = 0;

        this.context.beginPath();
        this.context.moveTo(lineX, lineY);
        this.context.lineWidth = Frac.LINE_WIDTH;
        this.context.lineTo(lineX + width, lineY);
        this.context.stroke();

        // Step 1: render the numerator onto a shadow canvas, passing along a depth
        // Step 2: scale it down appropriately
        // Step 3: ???
        // Step 4: profit

        var numX0 = (width - this.num.getBB(context).width) / 2;
        this.context.withTransformedContext(numX0, 0, (context) => {
            this.num.draw(context);
        });

        var denomX0 = (width - this.denom.getBB(context).width) / 2;
        this.context.withTransformedContext(denomX0, lineY + Frac.LINE_Y_PADDING, (context) => {
            this.denom.draw(context);
        });

        var numBB = this.num.getBB(context);
        var denomBB = this.denom.getBB(context);
        this.bb = {
            width: Math.max( numBB.width, denomBB.width ),
            height: numBB.height + denomBB.height + Frac.LINE_WIDTH
        };
    }
};
