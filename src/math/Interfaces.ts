/// <reference path="context.ts" />

class Dimensions {
    width: number;
    height: number;
}

interface Drawable {
    draw(context: Context, depth?: number);
    erase(context: Context);
    getBB(context: Context): Dimensions;
    getHorizontalLine(context: Context): number;
}
