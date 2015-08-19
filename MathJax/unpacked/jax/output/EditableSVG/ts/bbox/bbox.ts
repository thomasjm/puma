/// <reference path="../util.ts" />


class BBOX {
    type = "g";
    removeable = true;

    // Stuff needed for the GLYPH element
    glyphs = {}; // which glpyhs have been used
    defs = null; // the SVG <defs> element where glyphs are stored
    n = 0; // the ID for local <defs> for self-contained SVG elements

    h: number;
    w: number;
    d: number;
    l: number;
    D: number;
    H: number;
    r: number;
    x: number;
    y: number;
    scale: number;
    element: any;

    tw: number;

    childX: number;
    childY: number;
    childScale: number;

    hasIndent: boolean;

    constructor(def) {
        this.h = this.d = -Util.BIGDIMEN;
        this.H = this.D = 0;
        this.w = this.r = 0;
        this.l = Util.BIGDIMEN;
        this.x = this.y = 0;
        this.scale = 1;
        this.n = 0;
        if (this.type) {
            this.element = EditableSVG.Element(this.type, def);
        }
    }

    With(def) {
        return HUB.Insert(this, def);
    }

    Add(svg, dx, dy, forcew?, infront?) {
        if (dx) {
            svg.x += dx
        };
        if (dy) {
            svg.y += dy
        };
        if (svg.element) {
            if (svg.removeable && svg.element.childNodes.length === 1 && svg.n === 1) {
                var child = svg.element.firstChild,
                nodeName = child.nodeName.toLowerCase();
                if (nodeName === "use" || nodeName === "rect") {
                    svg.element = child;
                    svg.scale = svg.childScale;
                    var x = svg.childX,
                    y = svg.childY;
                    svg.x += x;
                    svg.y += y;
                    svg.h -= y;
                    svg.d += y;
                    svg.H -= y;
                    svg.D += y;
                    svg.w -= x;
                    svg.r -= x;
                    svg.l += x;
                    svg.removeable = false;
                    child.setAttribute("x", Math.floor(svg.x / svg.scale));
                    child.setAttribute("y", Math.floor(svg.y / svg.scale));
                }
            }
            if (Math.abs(svg.x) < 1 && Math.abs(svg.y) < 1) {
                svg.remove = svg.removeable;
            } else {
                nodeName = svg.element.nodeName.toLowerCase();
                if (nodeName === "g") {
                    if (!svg.element.firstChild) {
                        svg.remove = svg.removeable
                    } else {
                        svg.element.setAttribute("transform", "translate(" + Math.floor(svg.x) + "," + Math.floor(svg.y) + ")")
                    }
                } else if (nodeName === "line" || nodeName === "polygon" ||
                           nodeName === "path" || nodeName === "a") {
                    svg.element.setAttribute("transform", "translate(" + Math.floor(svg.x) + "," + Math.floor(svg.y) + ")");
                } else {
                    svg.element.setAttribute("x", Math.floor(svg.x / svg.scale));
                    svg.element.setAttribute("y", Math.floor(svg.y / svg.scale));
                }
            }
            if (svg.remove) {
                this.n += svg.n;
                while (svg.element.firstChild) {
                    if (infront && this.element.firstChild) {
                        this.element.insertBefore(svg.element.firstChild, this.element.firstChild);
                    } else {
                        this.element.appendChild(svg.element.firstChild);
                    }
                }
            } else {
                if (infront) {
                    this.element.insertBefore(svg.element, this.element.firstChild)
                } else {
                    this.element.appendChild(svg.element)
                }
            }
            delete svg.element;
        }
        if (svg.hasIndent) {
            this.hasIndent = svg.hasIndent;
        }
        if (svg.tw != null) {
            this.tw = svg.tw;
        }
        if (svg.d - svg.y > this.d) {
            this.d = svg.d - svg.y;
            if (this.d > this.D) {
                this.D = this.d
            }
        }
        if (svg.y + svg.h > this.h) {
            this.h = svg.y + svg.h;
            if (this.h > this.H) {
                this.H = this.h
            }
        }
        if (svg.D - svg.y > this.D) {
            this.D = svg.D - svg.y
        }
        if (svg.y + svg.H > this.H) {
            this.H = svg.y + svg.H
        }
        if (svg.x + svg.l < this.l) {
            this.l = svg.x + svg.l
        }
        if (svg.x + svg.r > this.r) {
            this.r = svg.x + svg.r
        }
        if (forcew || svg.x + svg.w + (svg.X || 0) > this.w) {
            this.w = svg.x + svg.w + (svg.X || 0)
        }
        this.childScale = svg.scale;
        this.childX = svg.x;
        this.childY = svg.y;
        this.n++;
        return svg;
    }

    Align(svg, align, dx, dy, shift) {
        dx = ({
            left: dx,
            center: (this.w - svg.w) / 2,
            right: this.w - svg.w - dx
        })[align] || 0;
        var w = this.w;
        this.Add(svg, dx + (shift || 0), dy);
        this.w = w;
    }

    Clean() {
        if (this.h === -Util.BIGDIMEN) {
            this.h = this.d = this.l = 0
        }
        return this;
    }
}
