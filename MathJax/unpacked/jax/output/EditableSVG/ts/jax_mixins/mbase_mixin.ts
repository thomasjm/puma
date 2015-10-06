/// <reference path="../bbox/bbox.ts" />
/// <reference path="../bbox/rect.ts" />

interface ElementJax {
    Get: any;
    getValues(): any;
}

class MBaseMixin implements ElementJax {
    SVG = BBOX;
    HUB: any;
    MML: any;

    public SVGsaveData(svg: any): any;
    data: any;
    base: any;
    EditableSVGdata: any;
    EditableSVGelem: any;
    mscale: any;
    toSVG(): any;

    Core: any;
    Get(): any;
    Parent: any;
    attr: any;
    attrNames: any;
    background: any;
    defaults: any;
    fontWeight: any;
    forceStretch: any;
    getValues(): any;
    hasValue: any;
    href: any;
    id: any;
    isEmbellished: any;
    isToken: any;
    mathbackground: any;
    mathcolor: any;
    mathsize: any;
    scale: any;
    style: any;
    styles: any;
    texSpacing: any;
    type: any;
    useMMLspacing: any;
    variantForm: any;

    getBB(relativeTo) {
        var elem = this.EditableSVGelem;
        if (!elem) {
            console.log('Oh no! Couldn\'t find elem for this');
            return;
        }

        return elem.getBBox();
    }

    static getMethods() {
        // TODO: return a dict suitable for using with Mathjax Augment method
    }

    toSVG() {
        this.SVGgetStyles();
        var variant = this.SVGgetVariant();
        var svg = new this.SVG();
        this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        for (var i = 0, m = this.data.length; i < m; i++) {
            if (this.data[i]) {
                var child = svg.Add(this.data[i].toSVG(variant, svg.scale), svg.w, 0, true);
                if (child.skew) {
                    svg.skew = child.skew
                }
            }
        }
        svg.Clean();
        var text = this.data.join("");
        if (svg.skew && text.length !== 1) {
            delete svg.skew
        }
        if (svg.r > svg.w && text.length === 1 && !variant.noIC) {
            svg.ic = svg.r - svg.w;
            svg.w = svg.r
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        this.EditableSVGelem = svg.element;
        return svg;
    }

    SVGchildSVG(i) {
        return (this.data[i] ? this.data[i].toSVG() : new BBOX(this.HUB));
    }

    EditableSVGdataStretched(i, HW, D) {
        this.EditableSVGdata = {
            HW: HW,
            D: D
        };
        if (!this.data[i]) {
            return new BBOX(this.HUB);
        }
        if (D != null) {
            return this.data[i].SVGstretchV(HW, D)
        }
        if (HW != null) {
            return this.data[i].SVGstretchH(HW)
        }
        return this.data[i].toSVG();
    }

    SVGsaveData(svg) {
        if (!this.EditableSVGdata) {
            this.EditableSVGdata = {}
        }
        this.EditableSVGdata.w = svg.w, this.EditableSVGdata.x = svg.x;
        this.EditableSVGdata.h = svg.h, this.EditableSVGdata.d = svg.d;
        if (svg.y) {
            this.EditableSVGdata.h += svg.y;
            this.EditableSVGdata.d -= svg.y
        }
        if (svg.X != null) {
            this.EditableSVGdata.X = svg.X
        }
        if (svg.tw != null) {
            this.EditableSVGdata.tw = svg.tw
        }
        if (svg.skew) {
            this.EditableSVGdata.skew = svg.skew
        }
        if (svg.ic) {
            this.EditableSVGdata.ic = svg.ic
        }
        if (this["class"]) {
            svg.removeable = false;
            EditableSVG.Element(svg.element, {
                "class": this["class"]
            })
        }
        // FIXME:  if an element is split by linebreaking, the ID will be the same on both parts
        // FIXME:  if an element has an id, its zoomed copy will have the same ID
        if (this.id) {
            svg.removeable = false;
            EditableSVG.Element(svg.element, {
                "id": this.id
            })
        }
        if (this.href) {
            var a = EditableSVG.Element("a", {
                "class": "mjx-svg-href"
            });
            a.setAttributeNS(XLINKNS, "href", this.href);
            a.onclick = this.SVGlink;
            EditableSVG.addElement(a, "rect", {
                width: svg.w,
                height: svg.h + svg.d,
                y: -svg.d,
                fill: "none",
                stroke: "none",
                "pointer-events": "all"
            });
            if (svg.type === "svg") {
                // for svg element, put <a> inside the main <g> element
                var g = svg.element.firstChild;
                while (g.firstChild) {
                    a.appendChild(g.firstChild)
                }
                g.appendChild(a);
            } else {
                a.appendChild(svg.element);
                svg.element = a;
            }
            svg.removeable = false;
        }
        if (EditableSVG.config.addMMLclasses) {
            this.SVGaddClass(svg.element, "mjx-svg-" + this.type);
            svg.removeable = false;
        }
        var style = this.style;
        if (style && svg.element) {
            svg.element.style.cssText = style;
            if (svg.element.style.fontSize) {
                svg.element.style.fontSize = ""
            } // handled by scale
            svg.element.style.border = svg.element.style.padding = "";
            if (svg.removeable) {
                svg.removeable = (svg.element.style.cssText === "")
            }
        }
        this.SVGaddAttributes(svg);
    }
    SVGaddClass(node, name) {
        var classes = node.getAttribute("class");
        node.setAttribute("class", (classes ? classes + " " : "") + name);
    }
    SVGaddAttributes(svg) {
        //
        //  Copy RDFa, aria, and other tags from the MathML to the HTML-CSS
        //  output spans Don't copy those in the MML.nocopyAttributes list,
        //  the ignoreMMLattributes configuration list, or anything tha
        //  already exists as a property of the span (e.g., no "onlick", etc.)
        //  If a name in the ignoreMMLattributes object is set to false, then
        //  the attribute WILL be copied.
        //
        if (this.attrNames) {
            var copy = this.attrNames,
            skip = this.MML.nocopyAttributes,
            ignore = this.HUB.config.ignoreMMLattributes;
            var defaults = (this.type === "mstyle" ? this.MML.math.prototype.defaults : this.defaults);
            for (var i = 0, m = copy.length; i < m; i++) {
                var id = copy[i];
                if (ignore[id] == false || (!skip[id] && !ignore[id] &&
                                            defaults[id] == null && typeof(svg.element[id]) === "undefined")) {
                    svg.element.setAttribute(id, this.attr[id]);
                    svg.removeable = false;
                }
            }
        }
    }
    //
    //  WebKit currently scrolls to the BOTTOM of an svg element if it contains the
    //  target of the link, so implement link by hand, to the containing span element.
    //
    SVGlink() {
        var href = this.href.animVal;
        if (href.charAt(0) === "#") {
            var target = EditableSVG.hashCheck(document.getElementById(href.substr(1)));
            if (target && target.scrollIntoView) {
                setTimeout(function() {
                    target.parentNode.scrollIntoView(true)
                }, 1)
            }
        }
        document.location = href;
    }

    SVGgetStyles() {
        if (this.style) {
            var span = HTML.Element("span");
            span.style.cssText = this.style;
            this.styles = this.SVGprocessStyles(span.style);
        }
    }
    SVGprocessStyles(style) {
        var styles = {
            border: EditableSVG.getBorders(style),
            padding: EditableSVG.getPadding(style)
        };
        if (!styles.border) {
            delete styles.border
        }
        if (!styles.padding) {
            delete styles.padding
        }
        if (style.fontSize) {
            styles['fontSize'] = style.fontSize
        }
        if (style.color) {
            styles['color'] = style.color
        }
        if (style.backgroundColor) {
            styles['background'] = style.backgroundColor
        }
        if (style.fontStyle) {
            styles['fontStyle'] = style.fontStyle
        }
        if (style.fontWeight) {
            styles['fontWeight'] = style.fontWeight
        }
        if (style.fontFamily) {
            styles['fontFamily'] = style.fontFamily
        }
        if (styles['fontWeight'] && styles['fontWeight'].match(/^\d+$/)) {
            styles['fontWeight'] = (parseInt(styles['fontWeight']) > 600 ? "bold" : "normal")
        }
        return styles;
    }

    SVGhandleSpace(svg) {
        if (this.useMMLspacing) {
            if (this.type !== "mo") return;
            var values = this.getValues("scriptlevel", "lspace", "rspace");
            if (values.scriptlevel <= 0 || this.hasValue("lspace") || this.hasValue("rspace")) {
                var mu = this.SVGgetMu(svg);
                values.lspace = Math.max(0, Util.length2em(values.lspace, mu));
                values.rspace = Math.max(0, Util.length2em(values.rspace, mu));
                var core = this,
                parent = this.Parent();
                while (parent && parent.isEmbellished() && parent.Core() === core) {
                    core = parent;
                    parent = parent.Parent()
                }
                if (values.lspace) {
                    svg.x += values.lspace
                }
                if (values.rspace) {
                    svg.X = values.rspace
                }
            }
        } else {
            var space = this.texSpacing();
            this.SVGgetScale();
            if (space !== "") {
                svg.x += Util.length2em(space, this.scale) * this.mscale
            }
        }
    }

    SVGhandleColor(svg) {
        var values = this.getValues("mathcolor", "color");
        if (this.styles && this.styles.color && !values.color) {
            values.color = this.styles.color
        }
        if (values.color && !this.mathcolor) {
            values.mathcolor = values.color
        }
        if (values.mathcolor) {
            EditableSVG.Element(svg.element, {
                fill: values.mathcolor,
                stroke: values.mathcolor
            })
            svg.removeable = false;
        }
        var borders = (this.styles || {}).border,
        padding = (this.styles || {}).padding,
        bleft = ((borders || {}).left || 0),
        pleft = ((padding || {}).left || 0),
        id;
        values.background = (this.mathbackground || this.background ||
                             (this.styles || {}).background || this.MML.COLOR.TRANSPARENT);
        if (bleft + pleft) {
            //
            //  Make a box and move the contents of svg to it,
            //    then add it back into svg, but offset by the left amount
            //
            var dup = new BBOX(this.HUB);
            for (id in svg) {
                if (svg.hasOwnProperty(id)) {
                    dup[id] = svg[id]
                }
            }
            dup.x = 0;
            dup.y = 0;
            svg.element = EditableSVG.Element("g");
            svg.removeable = true;
            svg.Add(dup, bleft + pleft, 0);
        }
        //
        //  Adjust size by padding and dashed borders (left is taken care of above)
        //
        if (padding) {
            svg.w += padding.right || 0;
            svg.h += padding.top || 0;
            svg.d += padding.bottom || 0
        }
        if (borders) {
            svg.w += borders.right || 0;
            svg.h += borders.top || 0;
            svg.d += borders.bottom || 0
        }
        //
        //  Add background color
        //
        if (values.background !== this.MML.COLOR.TRANSPARENT) {
            var nodeName = svg.element.nodeName.toLowerCase();
            if (nodeName !== "g" && nodeName !== "svg") {
                var g = EditableSVG.Element("g");
                g.appendChild(svg.element);
                svg.element = g;
                svg.removeable = true;
            }
            svg.Add(new BBOX_RECT(svg.h, svg.d, svg.w, {
                fill: values.background,
                stroke: "none"
            }), 0, 0, false, true)
        }
        //
        //  Add borders
        //
        if (borders) {
            var dd = 5; // fuzz factor to avoid anti-alias problems at edges
            var sides = {
                left: ["V", svg.h + svg.d, -dd, -svg.d],
                right: ["V", svg.h + svg.d, svg.w - borders.right + dd, -svg.d],
                top: ["H", svg.w, 0, svg.h - borders.top + dd],
                bottom: ["H", svg.w, 0, -svg.d - dd]
            }
            for (id in sides) {
                if (sides.hasOwnProperty(id)) {
                    if (borders[id]) {
                        var side = sides[id],
                        box = BBOX[side[0] + "LINE"];
                        svg.Add(box(side[1], borders[id], borders[id + "Style"], borders[id + "Color"]), side[2], side[3]);
                    }
                }
            }
        }
    }

    SVGhandleVariant(variant, scale, text) {
        return EditableSVG.HandleVariant(variant, scale, text);
    }

    SVGgetVariant() {
        var values = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle");
        var variant = values.mathvariant;
        if (this.variantForm) {
            variant = "-TeX-variant"
        }
        values.hasVariant = this.Get("mathvariant", true); // null if not explicitly specified
        if (!values.hasVariant) {
            values.family = values.fontfamily;
            values.weight = values.fontweight;
            values.style = values.fontstyle;
        }
        if (this.styles) {
            if (!values.style && this.styles.fontStyle) {
                values.style = this.styles.fontStyle;
            }
            if (!values.weight && this.styles.fontWeight) {
                values.weight = this.styles.fontWeight;
            }
            if (!values.family && this.styles.fontFamily) {
                values.family = this.styles.fontFamily;
            }
        }
        if (values.family && !values.hasVariant) {
            if (!values.weight && values.mathvariant.match(/bold/)) {
                values.weight = "bold"
            }
            if (!values.style && values.mathvariant.match(/italic/)) {
                values.style = "italic"
            }
            variant = {
                forceFamily: true,
                font: {
                    "font-family": values.family
                }
            };
            if (values.style) {
                variant.font["font-style"] = values.style
            }
            if (values.weight) {
                variant.font["font-weight"] = values.weight
            }
            return variant;
        }
        if (values.weight === "bold") {
            variant = {
                normal: this.MML.VARIANT.BOLD,
                italic: this.MML.VARIANT.BOLDITALIC,
                fraktur: this.MML.VARIANT.BOLDFRAKTUR,
                script: this.MML.VARIANT.BOLDSCRIPT,
                "sans-serif": this.MML.VARIANT.BOLDSANSSERIF,
                "sans-serif-italic": this.MML.VARIANT.SANSSERIFBOLDITALIC
            }[variant] || variant;
        } else if (values.weight === "normal") {
            variant = {
                bold: this.MML.VARIANT.normal,
                "bold-italic": this.MML.VARIANT.ITALIC,
                "bold-fraktur": this.MML.VARIANT.FRAKTUR,
                "bold-script": this.MML.VARIANT.SCRIPT,
                "bold-sans-serif": this.MML.VARIANT.SANSSERIF,
                "sans-serif-bold-italic": this.MML.VARIANT.SANSSERIFITALIC
            }[variant] || variant;
        }
        if (values.style === "italic") {
            variant = {
                normal: this.MML.VARIANT.ITALIC,
                bold: this.MML.VARIANT.BOLDITALIC,
                "sans-serif": this.MML.VARIANT.SANSSERIFITALIC,
                "bold-sans-serif": this.MML.VARIANT.SANSSERIFBOLDITALIC
            }[variant] || variant;
        } else if (values.style === "normal") {
            variant = {
                italic: this.MML.VARIANT.NORMAL,
                "bold-italic": this.MML.VARIANT.BOLD,
                "sans-serif-italic": this.MML.VARIANT.SANSSERIF,
                "sans-serif-bold-italic": this.MML.VARIANT.BOLDSANSSERIF
            }[variant] || variant;
        }
        if (!(variant in EditableSVG.FONTDATA.VARIANT)) {
            // If the mathvariant value is invalid or not supported by this
            // font, fallback to normal. See issue 363.
            variant = "normal";
        }
        return EditableSVG.FONTDATA.VARIANT[variant];
    }

    SVGgetScale(svg) {
        var scale = 1;
        if (this.mscale) {
            scale = this.scale;
        } else {
            var values = this.getValues("scriptlevel", "fontsize");
            values.mathsize = (this.isToken ? this : this.Parent()).Get("mathsize");
            if ((this.styles || {}).fontSize && !values.fontsize) {
                values.fontsize = this.styles.fontSize
            }
            if (values.fontsize && !this.mathsize) {
                values.mathsize = values.fontsize
            }
            if (values.scriptlevel !== 0) {
                if (values.scriptlevel > 2) {
                    values.scriptlevel = 2
                }
                scale = Math.pow(this.Get("scriptsizemultiplier"), values.scriptlevel);
                values.scriptminsize = Util.length2em(this.Get("scriptminsize")) / 1000;
                if (scale < values.scriptminsize) {
                    scale = values.scriptminsize
                }
            }
            this.scale = scale;
            this.mscale = Util.length2em(values.mathsize) / 1000;
        }
        if (svg) {
            svg.scale = scale;
            if (this.isToken) {
                svg.scale *= this.mscale
            }
        }
        return scale * this.mscale;
    }
    SVGgetMu(svg) {
        var mu = 1,
        values = this.getValues("scriptlevel", "scriptsizemultiplier");
        if (svg.scale && svg.scale !== 1) {
            mu = 1 / svg.scale
        }
        if (values.scriptlevel !== 0) {
            if (values.scriptlevel > 2) {
                values.scriptlevel = 2
            }
            mu = Math.sqrt(Math.pow(values.scriptsizemultiplier, values.scriptlevel));
        }
        return mu;
    }

    SVGnotEmpty(data) {
        while (data) {
            if ((data.type !== "mrow" && data.type !== "texatom") ||
                data.data.length > 1) {
                return true
            }
            data = data.data[0];
        }
        return false;
    }

    SVGcanStretch(direction) {
        var can = false;
        if (this.isEmbellished()) {
            var core = this.Core();
            if (core && core !== this) {
                can = core.SVGcanStretch(direction);
                if (can && core.forceStretch) {
                    this.forceStretch = true
                }
            }
        }
        return can;
    }

    SVGstretchV(h, d) {
        return this.toSVG(h, d)
    }

    SVGstretchH(w) {
        return this.toSVG(w)
    }

    SVGlineBreaks() {
        return false
    }

    // TODO: these two go in the second argument to Augment
    SVGautoload() {
        var file = EditableSVG.autoloadDir + "/" + this.type + ".js";
        this.HUB.RestartAfter(AJAX.Require(file));
    }

    SVGautoloadFile(name) {
        var file = EditableSVG.autoloadDir + "/" + name + ".js";
        this.HUB.RestartAfter(AJAX.Require(file));
    }
}
