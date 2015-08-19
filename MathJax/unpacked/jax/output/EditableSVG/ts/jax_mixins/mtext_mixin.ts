/// <reference path="mbase_mixin.ts" />

class MTextMixin extends MBaseMixin {
    toSVG() {
        if (SVG.config.mtextFontInherit || this.Parent().type === "merror") {
            this.SVGgetStyles();
            var svg = this.SVG(),
            scale = this.SVGgetScale(svg);
            this.SVGhandleSpace(svg);
            var variant = this.SVGgetVariant(),
            def = {
                direction: this.Get("dir")
            };
            if (variant.bold) {
                def["font-weight"] = "bold";
            }
            if (variant.italic) {
                def["font-style"] = "italic";
            }
            variant = this.Get("mathvariant");
            if (variant === "monospace") {
                def["class"] = "MJX-monospace"
            } else if (variant.match(/sans-serif/)) {
                def["class"] = "MJX-sans-serif"
            }
            svg.Add(BBOX.TEXT(scale * 100 / SVG.config.scale, this.data.join(""), def));
            svg.Clean();
            this.SVGhandleColor(svg);
            this.SVGsaveData(svg);
            return svg;
        } else {
            return this.SUPER(arguments).toSVG.call(this);
        }
    }
}
