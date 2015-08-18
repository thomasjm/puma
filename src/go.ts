/// <reference path="math/interfaces.ts" />
/// <reference path="math/frac.ts" />

function go(canvas, context) {
    var ctx = new Context(context, 0, 0);

    (new Basic(null)).draw(ctx.getTransformedContext(200, 200));

    (new Frac(null, null)).draw(ctx.getTransformedContext(100, 100));

    // (new Frac(null, null)).draw(Context.getTranslatedContext(canvas, 200, 200));

    // (new Basic()).draw( Context.getTranslatedContext(canvas, 300, 300) );
}
