/// <reference path="bbox.ts" />

class BBOX_RECT extends BBOX {
    constructor(h, d, w, def) {
        this.type = "rect";
        this.removeable = false;

        if (def == null) {
            def = {
                stroke: "none"
            }
        }
        def.width = Math.floor(w);
        def.height = Math.floor(h + d);
        super(def);

        this.w = this.r = w;
        this.h = this.H = h + d;
        this.d = this.D = this.l = 0;
        this.y = -d;
    }
}
