/// <reference path="Interfaces.ts" />

class Basic implements Drawable {
    getWidth() {
        return 20;
    }

    getHeight() {
        return 30;
    }

    getBB() {
        return {
            width: 20,
            height: 30
        };
    }

    draw(context: any) {
        var width = this.getWidth();
        var height = this.getHeight();

        context.strokeRect(0, 0, width, height);
		var origin = context.getOrigin();

	    // var input = new CanvasInput({

        //     x: context.getOrigin().x,
        //     y: context.getOrigin().y,

        //     canvas: document.getElementById("myCanvas"),
        //     context: document.getElementById("myCanvas").getContext("2d"), // context,
        //     fontSize: 14,
        //     fontFamily: 'Arial',
        //     fontColor: '#212121',
        //     fontWeight: 'bold',
        //     width: width,
        //     height: height,
        //     placeHolder: 'a',

        //     boxShadow: '0px 0px 0px rgba(255, 255, 255, 1)',
        //     innerShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',

        //     borderRadius: 0,
        //     padding: 0,
        //     borderWidth: 0

        // });
    };
}
