/// <reference path="mbase_mixin.ts" />

class MathMixin extends MBaseMixin {
    // TODO: don't do subclass here
    SVG = BBOX.Subclass({
        type: "svg",
        removeable: false
    })

    toSVG(span, div) {
        var CONFIG = SVG.config;

        //  All the data should be in an inferred row
        if (this.data[0]) {
            this.SVGgetStyles();
            MML.mbase.prototype.displayAlign = HUB.config.displayAlign;
            MML.mbase.prototype.displayIndent = HUB.config.displayIndent;
            if (String(HUB.config.displayIndent).match(/^0($|[a-z%])/i))
                MML.mbase.prototype.displayIndent = "0";

            //  Put content in a <g> with defaults and matrix that flips y axis.
            //  Put that in an <svg> with xlink defined.
            var box = BBOX_G();

            box.Add(this.data[0].toSVG(), 0, 0, true);
            box.Clean();
            this.SVGhandleColor(box);
            SVG.Element(box.element, {
                stroke: "currentColor",
                fill: "currentColor",
                "stroke-width": 0,
                transform: "matrix(1 0 0 -1 0 0)"
            });
            box.removeable = false;
            var svg = this.SVG();
            svg.element.setAttribute("xmlns:xlink", XLINKNS);
            if (CONFIG.useFontCache && !CONFIG.useGlobalCache) {
                svg.element.appendChild(BBOX.defs)
            }
            svg.Add(box);
            svg.Clean();
            this.SVGsaveData(svg);

            //  If this element is not the top-level math element
            //    remove the transform and return the svg object
            //    (issue #614).
            if (!span) {
                svg.element = svg.element.firstChild; // remove <svg> element
                svg.element.removeAttribute("transform");
                svg.removable = true;
                return svg;
            }

            //  Style the <svg> to get the right size and placement
            var l = Math.max(-svg.l, 0),
            r = Math.max(svg.r - svg.w, 0);
            var style = svg.element.style;
            svg.element.setAttribute("width", SVG.Ex(l + svg.w + r));
            svg.element.setAttribute("height", SVG.Ex(svg.H + svg.D + 2 * SVG.em));
            style.verticalAlign = SVG.Ex(-svg.D - 2 * SVG.em); // remove extra pixel added below plus padding from above
            style.marginLeft = SVG.Ex(-l);
            style.marginRight = SVG.Ex(-r);
            svg.element.setAttribute("viewBox", SVG.Fixed(-l, 1) + " " + SVG.Fixed(-svg.H - SVG.em, 1) + " " +
                                     SVG.Fixed(l + svg.w + r, 1) + " " + SVG.Fixed(svg.H + svg.D + 2 * SVG.em, 1));
            style.marginTop = style.marginBottom = "1px"; // 1px above and below to prevent lines from touching

            //  If there is extra height or depth, hide that
            if (svg.H > svg.h) {
                style.marginTop = SVG.Ex(svg.h - svg.H)
            }
            if (svg.D > svg.d) {
                style.marginBottom = SVG.Ex(svg.d - svg.D);
                style.verticalAlign = SVG.Ex(-svg.d);
            }

            //  Add it to the MathJax span
            var alttext = this.Get("alttext");
            if (alttext && !svg.element.getAttribute("aria-label")) span.setAttribute("aria-label", alttext);
            if (!svg.element.getAttribute("role")) span.setAttribute("role", "math");
            //        span.setAttribute("tabindex",0);  // causes focus outline, so disable for now
            span.appendChild(svg.element);
            svg.element = null;

            //  Handle indentalign and indentshift for single-line displays
            if (!this.isMultiline && this.Get("display") === "block" && !svg.hasIndent) {
                var values = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
                if (values.indentalignfirst !== MML.INDENTALIGN.INDENTALIGN) {
                    values.indentalign = values.indentalignfirst;
                }
                if (values.indentalign === MML.INDENTALIGN.AUTO) {
                    values.indentalign = this.displayAlign;
                }
                if (values.indentshiftfirst !== MML.INDENTSHIFT.INDENTSHIFT) {
                    values.indentshift = values.indentshiftfirst;
                }
                if (values.indentshift === "auto") {
                    values.indentshift = "0";
                }
                var shift = SVG.length2em(values.indentshift, 1, SVG.cwidth);
                if (this.displayIndent !== "0") {
                    var indent = SVG.length2em(this.displayIndent, 1, SVG.cwidth);
                    shift += (values.indentalign === MML.INDENTALIGN.RIGHT ? -indent : indent);
                }
                div.style.textAlign = values.indentalign;
                if (shift) {
                    HUB.Insert(style, ({
                        left: {
                            marginLeft: SVG.Ex(shift)
                        },
                        right: {
                            marginRight: SVG.Ex(-shift)
                        },
                        center: {
                            marginLeft: SVG.Ex(shift),
                            marginRight: SVG.Ex(-shift)
                        }
                    })[values.indentalign]);
                }
            }
        }
        return span;
    }
}
