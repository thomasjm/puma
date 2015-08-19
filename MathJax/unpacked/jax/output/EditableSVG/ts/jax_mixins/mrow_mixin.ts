/// <reference path="mbase_mixin.ts" />

class MRowMixin extends MBaseMixin {
    SVG = BBOX_ROW;

    focus() {
        console.log('focus!')
    }

    toSVG(h, d) {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        if (d != null) {
            svg.sh = h;
            svg.sd = d
        }
        for (var i = 0, m = this.data.length; i < m; i++) {
            if (this.data[i]) {
                svg.Check(this.data[i]);
            }
        }
        svg.Stretch();
        svg.Clean();
        if (this.data.length === 1 && this.data[0]) {
            var data = this.data[0].EditableSVGdata;
            if (data.skew) {
                svg.skew = data.skew
            }
        }
        if (this.SVGlineBreaks(svg)) {
            svg = this.SVGmultiline(svg)
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);

        this.EditableSVGelem = svg.element;

        return svg;
    }

    SVGlineBreaks(svg) {
        if (!this.parent.linebreakContainer) {
            return false
        }
        return (SVG.config.linebreaks.automatic &&
                svg.w > SVG.linebreakWidth) || this.hasNewline();
    }

    SVGmultiline(span) {
        MML.mbase.SVGautoloadFile("multiline")
    }

    SVGstretchH(w) {
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        for (var i = 0, m = this.data.length; i < m; i++) {
            svg.Add(this.EditableSVGdataStretched(i, w), svg.w, 0)
        }
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }
}
