/// <reference path="interfaces.ts" />
/// <reference path="context.ts"/>

class Glyph implements Drawable {
    width: number;
    height: number;
    parent: Drawable;
    bb: Dimensions;
    symbol: string;

    static EMPTY_RECT_LINE_WIDTH = 1;

    getBB(context: Context): Dimensions {
        var measured = context.measureText(this.symbol);
        return {
            width: measured.width,
            height: 30
        };
    }

    constructor(parent: Drawable, symbol: string) {
        // TODO Assert symbol is 1 character
        if (!(symbol && symbol.length === 1)) {
            console.error("Invalid symbol for glyph: ", symbol);
        }

        this.parent = parent;
        this.symbol = symbol;
    }

    getHorizontalLine(context: Context) {
        var bb = this.getBB(context);
        return bb.height / 2;
    }

    erase(context: Context) {
        var bb = this.getBB(context);
        context.clearRect(0, 0, bb.width, bb.height);
    }

    draw(context: Context, depth = 0) {

    };
}
