/// <reference path="mbase_mixin.ts" />

class MoMixin extends MBaseMixin {
    toSVG(HW, D) {
        this.SVGgetStyles();
        var svg = this.svg = this.SVG();
        var scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        if (this.data.length == 0) {
            svg.Clean();
            this.SVGsaveData(svg);
            return svg
        }

        //  Stretch the operator, if that is requested
        if (D != null) {
            return this.SVGstretchV(HW, D)
        } else if (HW != null) {
            return this.EditableSVG.strechH(HW)
        }

        //  Get the variant, and check for operator size
        var variant = this.SVGgetVariant();
        var values = this.getValues("largeop", "displaystyle");
        if (values.largeop) {
            variant = EditableSVG.FONTDATA.VARIANT[values.displaystyle ? "-largeOp" : "-smallOp"]
        }

        //  Get character translation for superscript and accents
        var parent = this.CoreParent(),
        isScript = (parent && parent.isa(MML.msubsup) && this !== parent.data[0]),
        mapchars = (isScript ? this.remapChars : null);
        if (this.data.join("").length === 1 && parent && parent.isa(MML.munderover) &&
            this.CoreText(parent.data[parent.base]).length === 1) {
            var over = parent.data[parent.over],
            under = parent.data[parent.under];
            if (over && this === over.CoreMO() && parent.Get("accent")) {
                mapchars = EditableSVG.FONTDATA.REMAPACCENT
            } else if (under && this === under.CoreMO() && parent.Get("accentunder")) {
                mapchars = EditableSVG.FONTDATA.REMAPACCENTUNDER
            }
        }

        //  Primes must come from another font
        if (isScript && this.data.join("").match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
            variant = EditableSVG.FONTDATA.VARIANT["-TeX-variant"]
        }

        //  Typeset contents
        for (var i = 0, m = this.data.length; i < m; i++) {
            if (this.data[i]) {
                var text = this.data[i].toSVG(variant, scale, this.remap, mapchars),
                x = svg.w;
                if (x === 0 && -text.l > 10 * text.w) {
                    x += -text.l
                } // initial combining character doesn't combine
                svg.Add(text, x, 0, true);
                if (text.skew) {
                    svg.skew = text.skew
                }
            }
        }
        svg.Clean();
        if (this.data.join("").length !== 1) {
            delete svg.skew
        }

        //  Handle large operator centering
        if (values.largeop) {
            svg.y = Util.TeX.axis_height - (svg.h - svg.d) / 2 / scale;
            if (svg.r > svg.w) {
                svg.ic = svg.r - svg.w;
                svg.w = svg.r
            }
        }

        //  Finish up
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        this.EditableSVGelem = svg.element;

        return svg;
    }

    SVGcanStretch(direction) {
        if (!this.Get("stretchy")) {
            return false
        }
        var c = this.data.join("");
        if (c.length > 1) {
            return false
        }
        var parent = this.CoreParent();
        if (parent && parent.isa(MML.munderover) &&
            this.CoreText(parent.data[parent.base]).length === 1) {
            var over = parent.data[parent.over],
            under = parent.data[parent.under];
            if (over && this === over.CoreMO() && parent.Get("accent")) {
                c = EditableSVG.FONTDATA.REMAPACCENT[c] || c
            } else if (under && this === under.CoreMO() && parent.Get("accentunder")) {
                c = EditableSVG.FONTDATA.REMAPACCENTUNDER[c] || c
            }
        }
        c = EditableSVG.FONTDATA.DELIMITERS[c.charCodeAt(0)];
        var can = (c && c.dir == direction.substr(0, 1));
        if (!can) {
            delete this.svg
        }
        this.forceStretch = can && (this.Get("minsize", true) || this.Get("maxsize", true));
        return can;
    }

    SVGstretchV(h, d) {
        var svg = this.svg || this.toSVG();
        var values = this.getValues("symmetric", "maxsize", "minsize");
        var axis = Util.TeX.axis_height * svg.scale,
        mu = this.SVGgetMu(svg),
        H;
        if (values.symmetric) {
            H = 2 * Math.max(h - axis, d + axis)
        } else {
            H = h + d
        }
        values.maxsize = Util.length2em(values.maxsize, mu, svg.h + svg.d);
        values.minsize = Util.length2em(values.minsize, mu, svg.h + svg.d);
        H = Math.max(values.minsize, Math.min(values.maxsize, H));
        if (H != values.minsize) {
            H = [Math.max(H * Util.TeX.delimiterfactor / 1000, H - Util.TeX.delimitershortfall), H]
        }
        svg = EditableSVG.createDelimiter(this.data.join("").charCodeAt(0), H, svg.scale);
        if (values.symmetric) {
            H = (svg.h + svg.d) / 2 + axis
        } else {
            H = (svg.h + svg.d) * h / (h + d)
        }
        svg.y = H - svg.h;
        this.SVGhandleSpace(svg);
        this.SVGhandleColor(svg);
        delete this.svg.element;
        this.SVGsaveData(svg);
        svg.stretched = true;
        return svg;
    }

    SVGstretchH(w) {
        var svg = this.svg || this.toSVG(),
        mu = this.SVGgetMu(svg);
        var values = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
        // FIXME:  should take style="font-weight:bold" into account as well
        if ((values.fontweight === "bold" || parseInt(values.fontweight) >= 600) &&
            !this.Get("mathvariant", true)) {
            values.mathvariant = MML.VARIANT.BOLD
        }
        values.maxsize = Util.length2em(values.maxsize, mu, svg.w);
        values.minsize = Util.length2em(values.minsize, mu, svg.w);
        w = Math.max(values.minsize, Math.min(values.maxsize, w));
        svg = EditableSVG.createDelimiter(this.data.join("").charCodeAt(0), w, svg.scale, values.mathvariant);
        this.SVGhandleSpace(svg);
        this.SVGhandleColor(svg);
        delete this.svg.element;
        this.SVGsaveData(svg);
        svg.stretched = true;
        return svg;
    }
}
