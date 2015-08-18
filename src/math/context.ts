
class Context implements CanvasRenderingContext2D {
    x0: number;
    y0: number;
    private delegate: CanvasRenderingContext2D;
    getX(): number {
        return this.x0;
    }

    getY(): number {
        return this.y0;
    }

    constructor(delegate, x, y) {
        this.delegate = delegate;
        this.x0 = x || 0;
        this.y0 = y || 0;
    }

    withTransformedContext(x: number, y: number, callback: any) {
        var ctx = this.getTransformedContext(x, y)
        callback(ctx);
    }

    getTransformedContext(x: number, y: number) {
        return new Context(this.delegate, this.x0 + x, this.y0 + y);
    }

    /**************/

    get canvas(): HTMLCanvasElement { return this.delegate.canvas; }
    set canvas(value: HTMLCanvasElement) { this.delegate.canvas = value; }

    get fillStyle(): any { return this.delegate.fillStyle; }
    set fillStyle(value: any) { this.delegate.fillStyle = value; }

    get font(): string { return this.delegate.font; }
    set font(value: string) { this.delegate.font = value; }

    globalAlpha: number;
    globalCompositeOperation: string;
    lineCap: string;
    lineDashOffset: number;
    lineJoin: string;
    lineWidth: number;
    miterLimit: number;
    msFillRule: string;
    msImageSmoothingEnabled: boolean;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    strokeStyle: any;
    textAlign: string;
    textBaseline: string;

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.delegate.arc(x + this.x0, y + this.y0, radius, startAngle, endAngle, anticlockwise);
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    arcTo(x1, y1, x2, y2, radius) {
        var x = this.x0;
        var y = this.y0;
        this.delegate.arcTo(x1 + x, y1 + y, x2 + x, y2 + y, radius);
    }

    beginPath(): void;
    beginPath() { this.delegate.beginPath(); }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        var x0 = this.x0;
        var y0 = this.y0;
        this.delegate.bezierCurveTo(cp1x + x0, cp1y + y0, cp2x + x0, cp2y + y0, x + x0, y + y0);
    }

    clearRect(x: number, y: number, w: number, h: number): void;
    clearRect(x, y, width, height) { this.delegate.clearRect(x + this.x0, y + this.y0, width, height); }

    clip(fillRule?: string): void;
    clip(fillRule) { this.delegate.clip(fillRule); }

    closePath(): void;
    closePath() { this.delegate.closePath(); }

    createImageData(imageDataOrSw: number, sh?: number): ImageData;
    createImageData(imageDataOrSw: ImageData, sh?: number): ImageData;
    createImageData(imageDataOrSw, sh) {
        return this.delegate.createImageData(imageDataOrSw, sh);
    }

    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createLinearGradient(xorig, yorig, x1, y1) {
        return this.delegate.createLinearGradient(xorig + this.x0, yorig + this.y0, x1 + this.x0, y1 + this.y0);
    }

    createPattern(image: HTMLImageElement, repetition: string): CanvasPattern;
    createPattern(image: HTMLCanvasElement, repetition: string): CanvasPattern;
    createPattern(image: HTMLVideoElement, repetition: string): CanvasPattern;
    createPattern(image, repetition) {
        return this.delegate.createPattern(image, repetition);
    }

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
        var x = this.x0;
        var y = this.y0;
        return this.delegate.createRadialGradient(x0 + x, y0 + y, r0, x1 + x, y1 + y, r1);
    }

    drawImage(image: HTMLImageElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
    drawImage(image: HTMLCanvasElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
    drawImage(image: HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
    drawImage(image, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight) {
        if (arguments.length == 3) {
            this.delegate.drawImage(image, offsetX + this.x0, offsetY + this.y0);
        } else if (arguments.length == 5) {
            this.delegate.drawImage(image,
                                    offsetX + this.x0,
                                    offsetY + this.y0,
                                    width,
                                    height);

        } else if (arguments.length == 9) {
            this.delegate.drawImage(image,
                                    offsetX + this.x0,
                                    offsetY + this.y0,
                                    width,
                                    height,
                                    canvasOffsetX,
                                    canvasOffsetY,
                                    canvasImageWidth,
                                    canvasImageHeight);
        }
    }

    fill(fillRule?: string): void;
    fill() { this.delegate.fill(); }

    fillRect(x: number, y: number, w: number, h: number): void;
    fillRect(x, y, width, height) { this.delegate.fillRect(x + this.x0, y + this.y0, width, height); }

    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    fillText(text, x, y, maxWidth) {
        console.log('doing filltext: ', text, x + this.x0, y + this.y0, maxWidth);
        this.delegate.fillText(text, x + this.x0, y + this.y0, maxWidth);
    }

    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    getImageData(sx, sy, sw, sh) {
        console.error('NOT IMPLEMENTED');
        return null;
    }

    getLineDash(): number[];
    getLineDash() { return this.delegate.getLineDash();}

    isPointInPath(x: number, y: number, fillRule?: string): boolean;
    isPointInPath(x, y, fillRule) {
        return this.delegate.isPointInPath(x + this.x0, y + this.y0, fillRule);
    }

    lineTo(x: number, y: number): void;
    lineTo(x, y) { this.delegate.lineTo(x + this.x0, y + this.y0); }

    measureText(text: string): TextMetrics;
    measureText(text) { return this.delegate.measureText(text); }

    moveTo(x: number, y: number): void;
    moveTo(x, y) { this.delegate.moveTo(x + this.x0, y + this.y0); }

    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void;
    putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        console.error('NOT IMPLEMENTED');
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    quadraticCurveTo(cpx, cpy, x, y) {
        this.delegate.quadraticCurveTo(cpx + this.x0, cpy + this.y0, x + this.x0, y + this.y0);
    }

    rect(x: number, y: number, w: number, h: number): void;
    rect(x, y, w, h) { this.delegate.rect(x + this.x0, y + this.y0, w, h); }

    restore(): void;
    restore() { this.delegate.restore(); }

    rotate(angle: number): void;
    rotate(angle) { this.delegate.rotate(angle); }

    save(): void;
    save() { this.delegate.save(); }

    scale(x: number, y: number): void;
    scale(x, y) { this.delegate.scale(x, y); }

    setLineDash(segments: number[]): void;
    setLineDash(segments) { this.delegate.setLineDash(segments); }

    setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    setTransform(m11, m12, m21, m22, dx, dy) {
        console.error("DON'T USE SETTRANSFORM ON THIS");
    }

    stroke(): void;
    stroke() { this.delegate.stroke(); }

    strokeRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x, y, width, height) { this.delegate.strokeRect(x + this.x0, y + this.y0, width, height); }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    strokeText(text, x, y, maxWidth) { this.delegate.strokeText(text, x + this.x0, y + this.y0); }

    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    transform(m11, m12, m21, m22, dx, dy) {
        this.delegate.transform(m11, m12, m21, m22, dx, dy);
    }

    translate(x: number, y: number): void;
    translate(x, y) {
        // this.delegate.translate(x, y);
        console.error("DON'T USE TRANSLATE ON THIS")
    }
}
