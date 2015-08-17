
class BoundingBox {
    width: number;
    height: number;
}

interface Drawable {
    draw(context: any);
    getWidth(): number;
    getHeight(): number;
    getBB(): BoundingBox;
}

class Context {
    delegate: any;
    canvas: any;
    x0: number;
    y0: number;

    constructor(delegate, canvas, x0, y0) {
        this.delegate = delegate;
        this.canvas = canvas;
        this.x0 = x0;
        this.y0 = y0;
    }

	getOrigin() {
		return {x: this.x0, y: this.y0};
	}

	getCanvas() {
		return this.canvas;
	}

    moveTo(x, y) {
        this.delegate.moveTo(x + this.x0, y + this.y0);
    }

    lineTo(x, y) {
        this.delegate.lineTo(x + this.x0, y + this.y0);
    }

    fillRect(x, y, width, height) {
        this.delegate.fillRect(x + this.x0, y + this.y0, width, height);
    }

    fillText(text, x, y, maxWidth) {
        this.delegate.fillText(text, x + this.x0, y + this.y0, maxWidth);
    }

    strokeRect(x, y, width, height) {
        this.delegate.strokeRect(x + this.x0, y + this.y0, width, height);
    }

    rect(x, y, width, height) {
        this.delegate.rect(x + this.x0, y + this.y0, width, height);
    }

	setFont(font) {
		this.delegate.font = font;
	}

	measureText(text) {
		return this.delegate.measureText(text);
	}

    setFillStyle(fillStyle) {
        this.delegate.fillStyle = fillStyle;
    }

    setLineWidth(lineWidth) {
        this.delegate.lineWidth = lineWidth;
    }

    setStrokeStyle(strokeStyle) {
        this.delegate.strokeStyle = strokeStyle;
    }

    beginPath() {
        this.delegate.beginPath();
    }

    stroke() {
        this.delegate.stroke();
    }

	createLinearGradient(xorig, yorig, x1, y1) {
		return this.delegate.createLinearGradient(xorig + this.x0, yorig + this.y0, x1 + this.x0, y1 + this.y0);
	}

    fill() {
        this.delegate.fill();
    }

    clearRect(x, y, width, height) {
        this.delegate.clearRect(x + this.x0, y + this.y0, width, height);
    };

    drawImage(canvas, x, y) {
        this.delegate.drawImage(canvas, x + this.x0, y + this.y0);
    };
}
