/// <reference path="mbase_mixin.ts" />

class MSpaceMixin extends MBaseMixin {
    toSVG() {
        this.SVGgetStyles();
        var values = this.getValues("height", "depth", "width");
        values.mathbackground = this.mathbackground;
        if (this.background && !this.mathbackground) {
            values.mathbackground = this.background
        }
        var svg = this.SVG();
        this.SVGgetScale(svg);
        var scale = this.mscale,
        mu = this.SVGgetMu(svg);
        svg.h = SVG.length2em(values.height, mu) * scale;
        svg.d = SVG.length2em(values.depth, mu) * scale;
        svg.w = svg.r = SVG.length2em(values.width, mu) * scale;
        if (svg.w < 0) {
            svg.x = svg.w;
            svg.w = svg.r = 0
        }
        if (svg.h < -svg.d) {
            svg.d = -svg.h
        }
        svg.l = 0;
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }
}
