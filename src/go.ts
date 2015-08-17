/// <reference path="math/interfaces.ts" />
/// <reference path="math/frac.ts" />

function go(canvas, context) {
	var f = new Frac(null, null);
	f.draw( new Context(context, canvas, 50, 10) );

	var basic = new Basic();
	basic.draw( new Context(context, canvas, 100, 100) );
}
