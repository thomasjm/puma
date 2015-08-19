/// <reference path="mbase_mixin.ts" />
/// <reference path="msqrt_mixin.ts" />

class MRootMixin extends MBaseMixin {

    toSVG = MSqrtMixin.toSVG;

    SVGaddRoot(svg, surd, x, d, scale) {
        var dx = (surd.isMultiChar ? .55 : .65) * surd.w;
        if (this.data[1]) {
            var root = this.data[1].toSVG();
            root.x = 0;
            var h = this.SVGrootHeight(surd.h + surd.d, scale, root) - d;
            var w = Math.min(root.w, root.r); // remove extra right-hand padding, if any
            x = Math.max(w, dx);
            svg.Add(root, x - w, h);
        } else {
            dx = x
        }
        return x - dx;
    }

    SVGrootHeight(d, scale, root) {
        return .45 * (d - 900 * scale) + 600 * scale + Math.max(0, root.d - 75);
    }
}
