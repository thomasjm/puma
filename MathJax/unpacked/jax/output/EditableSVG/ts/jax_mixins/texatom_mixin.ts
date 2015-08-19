/// <reference path="mbase_mixin.ts" />

class TeXAtomMixin extends MBaseMixin {
    toSVG(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        if (this.data[0] != null) {
            var box = this.EditableSVGdataStretched(0, HW, D),
            y = 0;
            if (this.texClass === MML.TEXCLASS.VCENTER) {
                y = SVG.TeX.axis_height - (box.h + box.d) / 2 + box.d;
            }
            svg.Add(box, 0, y);
            svg.ic = box.ic;
            svg.skew = box.skew;
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }
}
