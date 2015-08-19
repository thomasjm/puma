/// <reference path="mbase_mixin.ts" />


class MFracMixin extends MBaseMixin {
    static name = "mfrac";

    toSVG() {
        console.log('mfrac toSVG called!');

        this.SVGgetStyles();
        var svg = this.SVG();
        var scale = this.SVGgetScale(svg);
        var frac = BBOX();
        frac.scale = svg.scale;
        this.SVGhandleSpace(frac);
        var num = this.SVGchildSVG(0),
        den = this.SVGchildSVG(1);
        var values = this.getValues("displaystyle", "linethickness", "numalign", "denomalign", "bevelled");
        var isDisplay = values.displaystyle;
        var a = SVG.TeX.axis_height * scale;
        if (values.bevelled) {
            var delta = (isDisplay ? 400 : 150);
            var H = Math.max(num.h + num.d, den.h + den.d) + 2 * delta;
            var bevel = SVG.createDelimiter(0x2F, H);
            frac.Add(num, 0, (num.d - num.h) / 2 + a + delta);
            frac.Add(bevel, num.w - delta / 2, (bevel.d - bevel.h) / 2 + a);
            frac.Add(den, num.w + bevel.w - delta, (den.d - den.h) / 2 + a - delta);
        } else {
            var W = Math.max(num.w, den.w);
            var t = SVG.thickness2em(values.linethickness, this.scale) * this.mscale,
            p, q, u, v;
            var mt = SVG.TeX.min_rule_thickness / SVG.em * 1000;
            if (isDisplay) {
                u = SVG.TeX.num1;
                v = SVG.TeX.denom1
            } else {
                u = (t === 0 ? SVG.TeX.num3 : SVG.TeX.num2);
                v = SVG.TeX.denom2
            }
            u *= scale;
            v *= scale;
            if (t === 0) { // \atop
                p = Math.max((isDisplay ? 7 : 3) * SVG.TeX.rule_thickness, 2 * mt); // force to at least 2 px
                q = (u - num.d) - (den.h - v);
                if (q < p) {
                    u += (p - q) / 2;
                    v += (p - q) / 2
                }
                frac.w = W;
                t = 0;
            } else { // \over
                p = Math.max((isDisplay ? 2 : 0) * mt + t, t / 2 + 1.5 * mt); // force to be at least 1.5px
                q = (u - num.d) - (a + t / 2);
                if (q < p) {
                    u += p - q
                }
                q = (a - t / 2) - (den.h - v);
                if (q < p) {
                    v += p - q
                }
                frac.Add(new BBOX_RECT(t / 2, t / 2, W + 2 * t), 0, a);
            }
            frac.Align(num, values.numalign, t, u);
            frac.Align(den, values.denomalign, t, -v);
        }
        frac.Clean();
        svg.Add(frac, 0, 0);
        svg.Clean();

        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        this.EditableSVGelem = svg.element;
        return svg;
    }

    SVGcanStretch(direction) {
        return false
    }

    SVGhandleSpace(svg) {
        if (!this.texWithDelims && !this.useMMLspacing) {
            //
            //  Add nulldelimiterspace around the fraction
            //   (TeXBook pg 150 and Appendix G rule 15e)
            //
            svg.x = svg.X = SVG.TeX.nulldelimiterspace * this.mscale;
        }

        super.SVGhandleSpace(svg);
    }
}
