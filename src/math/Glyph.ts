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

    // getTextHeight(font) {

    //     var text = $('<span>Hg</span>').css({ fontFamily: font });
    //     var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

    //     var div = $('<div></div>');
    //     div.append(text, block);

    //     var body = $('body');
    //     body.append(div);

    //     try {

    //         var result = {};

    //         block.css({ verticalAlign: 'baseline' });
    //         result.ascent = block.offset().top - text.offset().top;

    //         block.css({ verticalAlign: 'bottom' });
    //         result.height = block.offset().top - text.offset().top;

    //         result.descent = result.height - result.ascent;

    //     } finally {
    //         div.remove();
    //     }

    //     return result;
    // }

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
        context.fillStyle = '#000';
        context.font = 'normal normal 14px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(this.symbol, 0, 0);
    };
}
