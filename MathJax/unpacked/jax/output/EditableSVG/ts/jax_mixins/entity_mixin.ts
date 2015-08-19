/// <reference path="mbase_mixin.ts" />

class EntityMixin extends MBaseMixin {
    toSVG(variant, scale, remap, chars) {
        var text = this.toString().replace(/[\u2061-\u2064]/g, ""); // remove invisibles
        if (remap) {
            text = remap(text, chars)
        }
        console.log('handling entity: ', text);
        return this.SVGhandleVariant(variant, scale, text);
    }
}
