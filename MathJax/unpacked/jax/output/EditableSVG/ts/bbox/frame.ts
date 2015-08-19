/// <reference path="bbox.ts" />

class BBOX_FRAME extends BBOX {
    constructor(h, d, w, t, dash, color, def) {
        this.type = "rect";
        this.removeable = false;

        if (def == null) {
            def = {}
        };
        def.fill = "none";
        def["stroke-width"] = SVG.Fixed(t, 2);
        def.width = Math.floor(w - t);
        def.height = Math.floor(h + d - t);
        def.transform = "translate(" + Math.floor(t / 2) + "," + Math.floor(-d + t / 2) + ")";
        if (dash === "dashed") {
            def["stroke-dasharray"] = [Math.floor(6 * SVG.em), Math.floor(6 * SVG.em)].join(" ")
        }
        super(def);
        this.w = this.r = w;
        this.h = this.H = h;
        this.d = this.D = d;
        this.l = 0;
    }
}
