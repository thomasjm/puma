/// <reference path="bbox.ts" />

class BBOX_HLINE extends BBOX {
    constructor(w, t, dash, color, def) {
        this.type = "line";
        this.removeable = false;

        if (def == null) {
            def = {
                "stroke-linecap": "square"
            }
        }
        if (color && color !== "") {
            def.stroke = color
        }

        def["stroke-width"] = SVG.Fixed(t, 2);
        def.x1 = def.y1 = def.y2 = Math.floor(t / 2);
        def.x2 = Math.floor(w - t / 2);
        if (dash === "dashed") {
            var n = Math.floor(Math.max(0, w - t) / (6 * t)),
            m = Math.floor(Math.max(0, w - t) / (2 * n + 1));
            def["stroke-dasharray"] = m + " " + m;
        }
        if (dash === "dotted") {
            def["stroke-dasharray"] = [1, Math.max(150, Math.floor(2 * t))].join(" ");
            def["stroke-linecap"] = "round";
        }

        super(def);

        this.w = this.r = w;
        this.l = 0;
        this.h = this.H = t;
        this.d = this.D = 0;
    }
}
