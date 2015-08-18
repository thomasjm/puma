
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
