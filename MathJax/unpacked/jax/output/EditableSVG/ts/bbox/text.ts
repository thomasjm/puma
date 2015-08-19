/// <reference path="bbox.ts" />

class BBOX_TEXT extends BBOX {
    type = "text";
    removeable = false;

    constructor(scale, text, def) {
        if (!def) {
            def = {}
        };
        def.stroke = "none";
        if (def["font-style"] === "") delete def["font-style"];
        if (def["font-weight"] === "") delete def["font-weight"];
        super(def);
        SVG.addText(this.element, text);
        SVG.textSVG.appendChild(this.element);
        var bbox = this.element.getBBox();
        SVG.textSVG.removeChild(this.element);
        scale *= 1000 / SVG.em;
        this.element.setAttribute("transform", "scale(" + SVG.Fixed(scale) + ") matrix(1 0 0 -1 0 0)");
        this.w = this.r = bbox.width * scale;
        this.l = 0;
        this.h = this.H = -bbox.y * scale;
        this.d = this.D = (bbox.height + bbox.y) * scale;
    }
}
