/// <reference path="math/interfaces.ts" />
/// <reference path="math/frac.ts" />

function go(canvas, context) {
    var ctx = new Context(context, 0, 0);

    var glyph1 = (new Glyph(null, 'a'));
    var glyph2 = (new Glyph(null, '+'));
    var glyph3 = (new Glyph(null, 'X'));

    glyph1.draw(ctx.getTransformedContext(50, 10));
    glyph2.draw(ctx.getTransformedContext(50, 30));
    glyph3.draw(ctx.getTransformedContext(50, 50));

    var h = new HorizontalComposite(null, [glyph1, glyph2, glyph3]);

    h.draw(ctx.getTransformedContext(50, 80));

    (new Frac(glyph1, glyph3)).draw(ctx.getTransformedContext(200, 200));

    // (new CanvasText(null)).draw(ctx.getTransformedContext(canvas, 300, 300));

    return [glyph1, glyph2, glyph3, h];
}
