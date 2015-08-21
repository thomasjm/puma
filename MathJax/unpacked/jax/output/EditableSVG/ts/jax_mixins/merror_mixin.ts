/// <reference path="mbase_mixin.ts" />

class MErrorMixin extends MBaseMixin {

    toSVG(HW, D) {
        this.SVGgetStyles();
        var svg  = new this.SVG(),
        scale = Util.length2em(this.styles.fontSize || 1) / 1000;
        this.SVGhandleSpace(svg);
        var def = (scale !== 1 ? {
            transform: "scale(" + this.SVG.Fixed(scale) + ")"
        } : {});
        var bbox = new BBOX(this.HUB, def);
        bbox.Add(this.SVGchildSVG(0));
        bbox.Clean();
        if (scale !== 1) {
            bbox.removeable = false;
            var adjust = ["w", "h", "d", "l", "r", "D", "H"];
            for (var i = 0, m = adjust.length; i < m; i++) {
                bbox[adjust[i]] *= scale
            }
        }
        svg.Add(bbox);
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }

    SVGgetStyles() {
        var span = HTML.Element("span", {
            style: this.SVG.config.merrorStyle
        });
        this.styles = this.SVGprocessStyles(span.style);
        if (this.style) {
            span.style.cssText = this.style;
            this.HUB.Insert(this.styles, this.SVGprocessStyles(span.style));
        }
    }
}
