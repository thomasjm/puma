/// <reference path="Interfaces.ts" />
/// <reference path="../CanvasInput.ts"/>
/// <reference path="context.ts"/>

class CanvasText implements Drawable {
    width: number;
    height: number;
    canvasInput: CanvasInput;
    parent: Drawable;
    context: Context;
    bb: Dimensions;

    static EMPTY_RECT_LINE_WIDTH = 1;

    getBB(): Dimensions {
        return this.bb;
    }

    constructor(parent: Drawable) {
        this.width = 20;
        this.height = 30;
        this.parent = parent;
    }

    render(context: Context) {
        this.context.lineWidth = CanvasText.EMPTY_RECT_LINE_WIDTH;
        context.strokeRect(0, 0, this.width, this.height);
        this.canvasInput.render();
    }

    getHorizontalLine() {
        return 42;
    }

    erase(context: Context) {
        var bb = this.getBB();
        context.clearRect(0, 0, bb.width, bb.height);
    }

    draw(context: Context, depth = 0) {
        // TODO: if there's a current canvasInput, destroy it

        // If we've been drawn before, erase before proceeding
        if (this.bb) {
            this.erase(context);
            this.canvasInput.destroy();
        }

        this.canvasInput = new CanvasInput({
            x: context.getX(),
            y: context.getY(),

            canvas: context.canvas,
            context: context,
            fontSize: 14,
            fontFamily: 'Arial',
            fontColor: '#212121',
            // fontWeight: 'bold',
            width: this.width,
            height: this.height,
            placeHolder: '',

            onkeyup: (e, canvasInput) => {
                context.clearRect(0, 0, this.width+5, this.height)
                this.width = canvasInput._textWidth(canvasInput.value());
                console.log('new width: ', this.width);
                canvasInput.width(this.width);
                this.render(context);

                // Trigger a render on the parent
                this.parent.draw(context);
            },

            boxShadow: '0px 0px 0px rgba(255, 255, 255, 1)',
            innerShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',

            borderRadius: 0,
            padding: 0,
            borderWidth: 0
        });

        // Draw the box
        this.render(context);

        this.bb = {
            width: this.width,
            height: this.height
        }
    };
}
