/// <reference path="mbase_mixin.ts" />

class MSqrtMixin extends MBaseMixin {
    toSVG() {
        this.SVGgetStyles();
        var svg = this.SVG(),
        scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        var base = this.SVGchildSVG(0),
        rule, surd;
        var t = Util.TeX.rule_thickness * scale,
        p, q, H, x = 0;
        if (this.Get("displaystyle")) {
            p = Util.TeX.x_height * scale
        } else {
            p = t
        }
        q = Math.max(t + p / 4, 1000 * Util.TeX.min_root_space / Util.em);
        H = base.h + base.d + q + t;
        surd = EditableSVG.createDelimiter(0x221A, H, scale);
        if (surd.h + surd.d > H) {
            q = ((surd.h + surd.d) - (H - t)) / 2
        }
        rule = new BBOX_RECT(t, 0, base.w);
        H = base.h + q + t;
        x = this.SVGaddRoot(svg, surd, x, surd.h + surd.d - H, scale);
        svg.Add(surd, x, H - surd.h);
        svg.Add(rule, x + surd.w, H - rule.h);
        svg.Add(base, x + surd.w, 0);
        svg.Clean();
        svg.h += t;
        svg.H += t;
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
    }

    SVGaddRoot(svg, surd, x, d, scale) {
        return x
    }
}
