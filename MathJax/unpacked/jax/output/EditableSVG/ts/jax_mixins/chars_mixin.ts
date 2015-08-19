/// <reference path="mbase_mixin.ts" />

class CharsMixin extends MBaseMixin {
    toSVG(variant, scale, remap, chars) {
        var text = this.data.join("").replace(/[\u2061-\u2064]/g, ""); // remove invisibles
        if (remap) {
            text = remap(text, chars)
        }
        var charsThing = this.SVGhandleVariant(variant, scale, text);
        this.EditableSVGelem = charsThing.element;
        return charsThing;
    }
}
