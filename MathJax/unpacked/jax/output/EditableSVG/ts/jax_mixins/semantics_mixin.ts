/// <reference path="mbase_mixin.ts" />
/// <reference path="../bbox/null" />

class SemanticsMixin extends MBaseMixin {
    toSVG() {
        this.SVGgetStyles();
        var svg  = new this.SVG();
        if (this.data[0] != null) {
            this.SVGhandleSpace(svg);
            svg.Add(this.data[0].toSVG());
            svg.Clean();
        } else {
            svg.Clean()
        }
        this.SVGsaveData(svg);
        return svg;
    }

    SVGstretchH(w) {
        return (this.data[0] != null ? this.data[0].SVGstretchH(w) : new BBOX_NULL());
    }

    SVGstretchV(h, d) {
        return (this.data[0] != null ? this.data[0].SVGstretchV(h, d) : new BBOX_NULL());
    }
}
