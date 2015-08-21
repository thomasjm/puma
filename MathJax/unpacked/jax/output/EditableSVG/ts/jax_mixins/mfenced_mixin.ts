/// <reference path="mbase_mixin.ts" />

class MFencedMixin extends MBaseMixin {
    SVG = BBOX_ROW;

    toSVG() {
        this.SVGgetStyles();
        var svg  = new this.SVG();
        this.SVGhandleSpace(svg);
        if (this.data.open) {
            svg.Check(this.data.open)
        }
        if (this.data[0] != null) {
            svg.Check(this.data[0])
        }
        for (var i = 1, m = this.data.length; i < m; i++) {
            if (this.data[i]) {
                if (this.data["sep" + i]) {
                    svg.Check(this.data["sep" + i])
                }
                svg.Check(this.data[i]);
            }
        }
        if (this.data.close) {
            svg.Check(this.data.close)
        }
        svg.Stretch();
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }
}
