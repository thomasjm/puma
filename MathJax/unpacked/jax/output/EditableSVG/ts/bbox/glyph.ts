/// <reference path="bbox.ts" />

class BBOX_GLYPH extends BBOX {

    constructor(scale, id, h, d, w, l, r, p) {
        this.type = "path";
        this.removeable = false;

        var def, t = SVG.config.blacker,
        var cache = SVG.config.useFontCache;
        var transform = (scale === 1 ? null : "scale(" + SVG.Fixed(scale) + ")");
        if (cache && !SVG.config.useGlobalCache) {
            id = "E" + this.n + "-" + id
        }
        if (!cache || !this.glyphs[id]) {
            def = {
                "stroke-width": t
            };
            if (cache) {
                def.id = id
            } else if (transform) {
                def.transform = transform
            }
            def.d = (p ? "M" + p + "Z" : "");
            super(def);
            if (cache) {
                this.defs.appendChild(this.element);
                this.glyphs[id] = true;
            }
        }
        if (cache) {
            def = {};
            if (transform) {
                def.transform = transform
            }
            this.element = SVG.Element("use", def);
            this.element.setAttributeNS(XLINKNS, "href", "#" + id);
        }
        this.h = (h + t) * scale;
        this.d = (d + t) * scale;
        this.w = (w + t / 2) * scale;
        this.l = (l + t / 2) * scale;
        this.r = (r + t / 2) * scale;
        this.H = Math.max(0, this.h);
        this.D = Math.max(0, this.d);
        this.x = this.y = 0;
        this.scale = scale;
    }
}
