/// <reference path="mbase_mixin.ts" />

class MPaddedMixin extends MBaseMixin {
    mscale: number;

    toSVG(HW, D) {
        this.SVGgetStyles();
        var svg  = new this.SVG();
        if (this.data[0] != null) {
            this.SVGgetScale(svg);
            this.SVGhandleSpace(svg);
            var pad = this.EditableSVGdataStretched(0, HW, D),
            mu = this.SVGgetMu(svg);
            var values = this.getValues("height", "depth", "width", "lspace", "voffset"),
            X = 0,
            Y = 0;
            if (values.lspace) {
                X = this.SVGlength2em(pad, values.lspace, mu)
            }
            if (values.voffset) {
                Y = this.SVGlength2em(pad, values.voffset, mu)
            }
            var h = pad.h,
            d = pad.d,
            w = pad.w,
            y = pad.y; // these can change durring the Add()
            svg.Add(pad, X, Y);
            svg.Clean();
            svg.h = h + y;
            svg.d = d - y;
            svg.w = w;
            svg.removeable = false;
            if (values.height !== "") {
                svg.h = this.SVGlength2em(svg, values.height, mu, "h", 0)
            }
            if (values.depth !== "") {
                svg.d = this.SVGlength2em(svg, values.depth, mu, "d", 0)
            }
            if (values.width !== "") {
                svg.w = this.SVGlength2em(svg, values.width, mu, "w", 0)
            }
            if (svg.h > svg.H) {
                svg.H = svg.h
            };
            if (svg.d > svg.D) {
                svg.D = svg.d
            }
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }

    SVGlength2em(svg, length, mu, d, m) {
        if (m == null) {
            m = -Util.BIGDIMEN
        }
        var match = String(length).match(/width|height|depth/);
        var size = (match ? svg[match[0].charAt(0)] : (d ? svg[d] : 0));
        var v = Util.length2em(length, mu, size / this.mscale) * this.mscale;
        if (d && String(length).match(/^\s*[-+]/)) {
            return Math.max(m, svg[d] + v)
        } else {
            return v
        }
    }
}
