/// <reference path="interfaces.ts" />
/// <reference path="context.ts"/>

class HorizontalComposite implements Drawable {
    width: number;
    height: number;
    parent: Drawable;
    bb: Dimensions;
    children: Drawable[];

    static X_PADDING = 10;

    getAboveBelowHeights(context): any {
        var aboveLineHeight = 0;
        var belowLineHeight = 0;

        for (var i = 0; i < this.children.length; i++) {
            var bb = this.children[i].getBB(context);
            var horizontalLine = this.children[i].getHorizontalLine(context);

            aboveLineHeight = Math.max(aboveLineHeight, horizontalLine);
            belowLineHeight = Math.max(belowLineHeight, bb.height - horizontalLine);
        }

        return {
            aboveLineHeight: aboveLineHeight,
            belowLineHeight: belowLineHeight
        };
    }

    getBB(context: Context): Dimensions {
        var width = 0;
        var children = this.children;

        for (var i = 0; i < this.children.length; i++) {
            var bb = this.children[i].getBB(context);
            var horizontalLine = this.children[i].getHorizontalLine(context);

            width += bb.width;

            if (i === 0 || i === this.children.length-1) {
                width += HorizontalComposite.X_PADDING;
            } else {
                width += 2 * HorizontalComposite.X_PADDING
            }
        }

        var aboveBelowHeights = this.getAboveBelowHeights(context);

        return {
            width: width,
            height: aboveBelowHeights.aboveLineHeight + aboveBelowHeights.belowLineHeight
        };
    }

    constructor(parent: Drawable, children: Drawable[]) {
        // TODO Assert symbol is 1 character
        this.parent = parent;
        this.children = children;
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
        var bb = this.getBB(context);
        var x = 0;

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            var childBB = child.getBB(context);
            var horizontalLine = child.getHorizontalLine(context);

            var aboveBelowHeights = this.getAboveBelowHeights(context);
            var y = aboveBelowHeights.aboveLineHeight - horizontalLine;

            context.withTransformedContext(x, y, (context) => {
                child.draw(context);
            });

            x += childBB.width;
            if (i === 0 || i === this.children.length-1) {
                x += HorizontalComposite.X_PADDING;
            } else {
                x += 2 * HorizontalComposite.X_PADDING
            }
        }
    };
}
