/// <reference path="mbase_mixin.ts" />

class MPhantomMixin extends MBaseMixin {
    toSVG(HW, D) {
        this.SVGgetStyles();
        var svg  = new this.SVG();
        this.SVGgetScale(svg);
        if (this.data[0] != null) {
            this.SVGhandleSpace(svg);
            svg.Add(this.EditableSVGdataStretched(0, HW, D));
            svg.Clean();
            while (svg.element.firstChild) {
                svg.element.removeChild(svg.element.firstChild)
            }
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        if (svg.removeable && !svg.element.firstChild) {
            delete svg.element
        }
        return svg;
    }
}
