/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/*************************************************************
 *
 *  MathJax/jax/output/EditableSVG/jax.js
 *
 *  Implements an editable SVG OutputJax that displays mathematics using
 *  SVG (or VML in IE) to position the characters from math fonts
 *  in their proper locations.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2011-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

interface OutputJax {
    Config(): any;
}

class EditableSVG implements OutputJax {
    MML: any;

    AJAX = MathJax.AJAX;
    HUB = MathJax.Hub;
    HTML = MathJax.HTML;
    SVG = MathJax.OutputJax.EditableSVG;

    SVGNS = "http://www.w3.org/2000/svg";
    XLINKNS = "http://www.w3.org/1999/xlink";

    config = EditableSVGConfig.config;

    hideProcessedMath = true; // use display:none until all math is processed

    fontNames = ["TeX", "STIX", "STIX-Web", "Asana-Math",
                 "Gyre-Termes", "Gyre-Pagella", "Latin-Modern", "Neo-Euler"];

    TextNode = HTML.TextNode;
    addText = HTML.addText;
    ucMatch = HTML.ucMatch;

    Config() {
        this.SUPER(arguments).Config.apply(this, arguments);
        var settings = HUB.config.menuSettings,
        config = this.config,
        font = settings.font;
        if (settings.scale) {
            config.scale = settings.scale;
        }
        if (font && font !== "Auto") {
            font = font.replace(/(Local|Web|Image)$/i, "");
            font = font.replace(/([a-z])([A-Z])/, "$1-$2");
            this.fontInUse = font;
        } else {
            this.fontInUse = config.font || "TeX";
        }
        if (this.fontNames.indexOf(this.fontInUse) < 0) {
            this.fontInUse = "TeX";
        }
        this.fontDir += "/" + this.fontInUse;
        if (!this.require) {
            this.require = [];
        }
        this.require.push(this.fontDir + "/fontdata.js");
        this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
    }

    /*
     * Append a visualization of the jax to a given div
     * Pass in the jax and a jQuery selector div
     */
    visualizeJax(jax, selector) {
        selector.empty();
        var f = function(j, spacer) {
            var s = spacer + (j ? j.type : "null") + "\n";
            var item = $('<li><pre>' + s + '</pre></li>');
            item.appendTo(selector);
            item.on('click', function() {
                console.log('clicked this: ', j);
                var bb = j.getBB();

                // The bounding box x and y is in the transformed coordinates; convert to viewport coords
                var svg = $(j.EditableSVGelem).closest('svg').get()[0];
                var pt = svg.createSVGPoint();
                pt.x = bb.x;
                pt.y = bb.y;
                var vpCoords = pt.matrixTransform(j.EditableSVGelem.getCTM());

                // Something wrong here...
                console.log('bb: ', vpCoords.x, vpCoords.y, bb.width, bb.height);
            });

            if (!j) return;

            if (_.isString(j)) {
                s = spacer + j + "\n";
                selector.append('<li><pre>' + s + '</pre></li>');
            } else {
                for (var i = 0; i < j.data.length; i++) {
                    f(j.data[i], spacer + " ");
                }
            }
        };
        f(jax.root, "");
    }

    getNodesAsFlatList(jax) {
        var rest = jax.data ? _.flatten(_.map(jax.data, this.getNodesAsFlatList)) : [];
        return [jax].concat(rest);
    }

    // Convert coordinates in some arbitrary element's coordinate system to the viewport coordinate system
    elemCoordsToViewportCoords(elem, x, y) {
        var svg = $(elem).closest('svg').get()[0];
        var pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;

        return pt.matrixTransform(elem.getCTM());
    }

    nodeContainsPoint(svg, node, point) {
        if (!node.getBB) {
            console.error("Node doesn't have getBB");
            return false;
        }

        var bb = node.getBB();
        if (!bb) {
            console.error("Didn't get a bb", node.EditableSVGelem);
            return false;
        }

        var converted = this.elemCoordsToViewportCoords(node.EditableSVGelem, bb.x, bb.y);

        console.log('considering bb: ', node.EditableSVGelem, converted.x, converted.y, bb.width, bb.height);
        if (point.x < bb.x || point.x > bb.x + bb.width) return false;
        if (point.y > bb.y || point.y < bb.y - bb.height) return false;
        console.log('MATCHED');
        return true;
    }

    Startup() {
        //  Set up event handling
        EVENT = MathJax.Extension.MathEvents.Event;
        TOUCH = MathJax.Extension.MathEvents.Touch;
        HOVER = MathJax.Extension.MathEvents.Hover;
        this.ContextMenu = EVENT.ContextMenu;
        this.Mousedown = function(event) {
            /* TODOTODOTODO
               Note: use test3.htm!!!

               What I'm trying to do here is detect which node has been clicked.

               I did this by augmenting several classes (mfrac, mrow, etc.) with a property EditableSVGelem,
               which is the SVG elem corresponding to that element.

               Given a mouse event with some click coordinates, the code below tries to find all the element(s)
               that the click overlaps. By finding the deepest such element in the tree, we can decide where to
               render the cursor.

               Something's wrong right now with how I transform coordinate systems: one or more of the
               click coordinates or bounding box X and Y values is wrong; too tired to figure it out atm.

               Note that this function also calls "visualizeJax" which renders a tree of what the jax looks like
               to a special div I made. You can *click* the list items and they will print information about the node
               in question; you can edit what information is printed inside the click handlers installed in
               visualizeJax.
            */
            console.log('got mousedown!');
            // TODO: if we're not rendered yet, ignore

            var svg = $(event.target).closest('svg').get()[0];
            if (!svg) return;

            // Convert the click coordinates to viewport coordinates
            var pt = svg.createSVGPoint();
            var offset = svg.getBoundingClientRect();
            pt.x = event.clientX;
            pt.y = event.clientY;
            console.log('click in client coords: ', event.clientX, event.clientY);
            var cp = pt.matrixTransform(svg.getScreenCTM().inverse());
            console.log('cp: ', cp.x, cp.y);

            jax = MathJax.Hub.getAllJax('#' + event.target.parentElement.id)[0];
            this.visualizeJax(jax, $('#mmlviz'));

            // Get a flat list of all nodes in the tree
            var nodes = this.getNodesAsFlatList(jax.root);

            // Filter the nodes to find the ones we want
            var ncp = this.nodeContainsPoint.bind(this);
            var matchingNodes = _.filter(nodes, function(node) {
                return ncp(svg, node, cp);
            });

            // TODO: this should be correct
            console.log('matching nodes: ', matchingNodes);
            _.each(matchingNodes, function(node) {
                console.log(node.type, node);
            });
        };

        this.Mouseover = HOVER.Mouseover;
        this.Mouseout = HOVER.Mouseout;
        this.Mousemove = HOVER.Mousemove;

        // Make hidden div for doing tests and storing global SVG <defs>
        this.hiddenDiv = HTML.Element("div", {
            style: {
                visibility: "hidden",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                height: "1px",
                width: "auto",
                padding: 0,
                border: 0,
                margin: 0,
                textAlign: "left",
                textIndent: 0,
                textTransform: "none",
                lineHeight: "normal",
                letterSpacing: "normal",
                wordSpacing: "normal"
            }
        });
        if (!document.body.firstChild) {
            document.body.appendChild(this.hiddenDiv);
        } else {
            document.body.insertBefore(this.hiddenDiv, document.body.firstChild);
        }
        this.hiddenDiv = HTML.addElement(this.hiddenDiv, "div", {
            id: "MathJax_SVG_Hidden"
        });

        // Determine pixels-per-inch and em-size
        var div = HTML.addElement(this.hiddenDiv, "div", {
            style: {
                width: "5in"
            }
        });
        this.pxPerInch = div.offsetWidth / 5;
        this.hiddenDiv.removeChild(div);

        // Used for measuring text sizes
        this.textSVG = this.Element("svg");

        // Global defs for font glyphs
        BBOX.GLYPH.defs = this.addElement(this.addElement(this.hiddenDiv.parentNode, "svg"),
                                          "defs", {
                                              id: "MathJax_SVG_glyphs"
                                          });

        // Used in preTranslate to get scaling factors
        this.ExSpan = HTML.Element("span", {
            style: {
                position: "absolute",
                "font-size-adjust": "none"
            }
        }, [
            ["span", {
                className: "MathJax_SVG_ExBox"
            }]
        ]);

        // Used in preTranslate to get linebreak width
        this.linebreakSpan = HTML.Element("span", null, [
            ["hr", {
                style: {
                    width: "auto",
                    size: 1,
                    padding: 0,
                    border: 0,
                    margin: 0
                }
            }]
        ]);

        // Set up styles
        return AJAX.Styles(this.config.styles, ["InitializeSVG", this]);
    }

    //  Handle initialization that requires styles to be set up
    InitializeSVG() {
        //
        //  Get the default sizes (need styles in place to do this)
        //
        document.body.appendChild(this.ExSpan);
        document.body.appendChild(this.linebreakSpan);
        this.defaultEx = this.ExSpan.firstChild.offsetHeight / 60;
        this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth;
        document.body.removeChild(this.linebreakSpan);
        document.body.removeChild(this.ExSpan);
    }

    preTranslate(state) {
        var scripts = state.jax[this.id],
        i, m = scripts.length,
        script, prev, span, div, test, jax, ex, em, maxwidth, relwidth = false,
        cwidth,
        linebreak = this.config.linebreaks.automatic,
        width = this.config.linebreaks.width;
        if (linebreak) {
            relwidth = (width.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/) != null);
            if (relwidth) {
                width = width.replace(/\s*container\s*/, "")
            } else {
                maxwidth = this.defaultWidth
            }
            if (width === "") {
                width = "100%"
            }
        } else {
            maxwidth = 100000
        } // a big width, so no implicit line breaks

        //  Loop through the scripts
        for (i = 0; i < m; i++) {
            script = scripts[i];
            if (!script.parentNode) continue;

            //  Remove any existing output
            prev = script.previousSibling;
            if (prev && String(prev.className).match(/^MathJax(_SVG)?(_Display)?( MathJax(_SVG)?_Processing)?$/)) {
                prev.parentNode.removeChild(prev)
            }

            //  Add the span, and a div if in display mode,
            //  then set the role and mark it as being processed
            jax = script.MathJax.elementJax;
            if (!jax) continue;
            jax.SVG = {
                display: (jax.root.Get("display") === "block")
            }
            span = div = HTML.Element("span", {
                style: {
                    "font-size": this.config.scale + "%",
                    display: "inline-block"
                },
                className: "MathJax_SVG",
                id: jax.inputID + "-Frame",
                isMathJax: true,
                jaxID: this.id,
                oncontextmenu: EVENT.Menu,
                onmousedown: EVENT.Mousedown,
                onmouseover: EVENT.Mouseover,
                onmouseout: EVENT.Mouseout,
                onmousemove: EVENT.Mousemove,
                onclick: EVENT.Click,
                ondblclick: EVENT.DblClick
            });
            if (HUB.Browser.noContextMenu) {
                span.ontouchstart = TOUCH.start;
                span.ontouchend = TOUCH.end;
            }
            if (jax.SVG.display) {
                div = HTML.Element("div", {
                    className: "MathJax_SVG_Display"
                });
                div.appendChild(span);
            }
            div.className += " MathJax_SVG_Processing";
            script.parentNode.insertBefore(div, script);

            //  Add the test span for determining scales and linebreak widths
            script.parentNode.insertBefore(this.ExSpan.cloneNode(true), script);
            div.parentNode.insertBefore(this.linebreakSpan.cloneNode(true), div);
        }

        //  Determine the scaling factors for each script
        //  (this only requires one reflow rather than a reflow for each equation)
        for (i = 0; i < m; i++) {
            script = scripts[i];
            if (!script.parentNode) continue;
            test = script.previousSibling;
            div = test.previousSibling;
            jax = script.MathJax.elementJax;
            if (!jax) continue;
            ex = test.firstChild.offsetHeight / 60;
            cwidth = div.previousSibling.firstChild.offsetWidth;
            if (relwidth) {
                maxwidth = cwidth
            }
            if (ex === 0 || ex === "NaN") {
                // can't read width, so move to hidden div for processing
                // (this will cause a reflow for each math element that is hidden)
                this.hiddenDiv.appendChild(div);
                jax.SVG.isHidden = true;
                ex = this.defaultEx;
                cwidth = this.defaultWidth;
                if (relwidth) {
                    maxwidth = cwidth
                }
            }
            jax.SVG.ex = ex;
            jax.SVG.em = em = ex / Util.TeX.x_height * 1000; // scale ex to x_height
            jax.SVG.cwidth = cwidth / em * 1000;
            jax.SVG.lineWidth = (linebreak ? this.length2em(width, 1, maxwidth / em * 1000) : Util.BIGDIMEN);
        }

        //  Remove the test spans used for determining scales and linebreak widths
        for (i = 0; i < m; i++) {
            script = scripts[i];
            if (!script.parentNode) continue;
            test = scripts[i].previousSibling;
            span = test.previousSibling;
            jax = scripts[i].MathJax.elementJax;
            if (!jax) continue;
            if (!jax.SVG.isHidden) {
                span = span.previousSibling
            }
            span.parentNode.removeChild(span);
            test.parentNode.removeChild(test);
        }

        //  Set state variables used for displaying equations in chunks
        state.SVGeqn = state.SVGlast = 0;
        state.SVGi = -1;
        state.SVGchunk = this.config.EqnChunk;
        state.SVGdelay = false;
    }

    Translate(script, state) {
        if (!script.parentNode) return;

        //  If we are supposed to do a chunk delay, do it
        if (state.SVGdelay) {
            state.SVGdelay = false;
            HUB.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay));
        }

        //  Get the data about the math
        var jax = script.MathJax.elementJax,
        math = jax.root,
        span = document.getElementById(jax.inputID + "-Frame"),
        div = (jax.SVG.display ? (span || {}).parentNode : span),
        localCache = (SVG.config.useFontCache && !SVG.config.useGlobalCache);
        if (!div) return;

        //  Set the font metrics
        this.em = MML.mbase.prototype.em = jax.SVG.em;

        this.ex = jax.SVG.ex;
        this.linebreakWidth = jax.SVG.lineWidth;
        this.cwidth = jax.SVG.cwidth;

        //  Typeset the math
        this.mathDiv = div;
        span.appendChild(this.textSVG);
        if (localCache) {
            SVG.resetGlyphs();
        }
        this.initSVG(math, span);
        math.setTeXclass();
        try {
            math.toSVG(span, div);
        } catch (err) {
            if (err.restart) {
                while (span.firstChild) {
                    span.removeChild(span.firstChild);
                }
            }
            if (localCache) {
                BBOX.GLYPH.n--;
            }
            throw err;
        }
        span.removeChild(this.textSVG);

        //  Put it in place, and remove the processing marker
        if (jax.SVG.isHidden) {
            script.parentNode.insertBefore(div, script);
        }
        div.className = div.className.split(/ /)[0];
        //
        //  Check if we are hiding the math until more is processed
        //
        if (this.hideProcessedMath) {
            //
            //  Hide the math and don't let its preview be removed
            //
            div.className += " MathJax_SVG_Processed";
            if (script.MathJax.preview) {
                jax.SVG.preview = script.MathJax.preview;
                delete script.MathJax.preview;
            }
            //
            //  Check if we should show this chunk of equations
            //
            state.SVGeqn += (state.i - state.SVGi);
            state.SVGi = state.i;
            if (state.SVGeqn >= state.SVGlast + state.SVGchunk) {
                this.postTranslate(state, true);
                state.SVGchunk = Math.floor(state.SVGchunk * this.config.EqnChunkFactor);
                state.SVGdelay = true; // delay if there are more scripts
            }
        }
    }

    postTranslate(state, partial) {
        var scripts = state.jax[this.id];
        if (!this.hideProcessedMath) return;
        //
        //  Reveal this chunk of math
        //
        for (var i = state.SVGlast, m = state.SVGeqn; i < m; i++) {
            var script = scripts[i];
            if (script && script.MathJax.elementJax) {
                //
                //  Remove the processed marker
                //
                script.previousSibling.className = script.previousSibling.className.split(/ /)[0];
                var data = script.MathJax.elementJax.SVG;
                //
                //  Remove the preview, if any
                //
                if (data.preview) {
                    data.preview.innerHTML = "";
                    script.MathJax.preview = data.preview;
                    delete data.preview;
                }
            }
        }
        //
        //  Save our place so we know what is revealed
        //
        state.SVGlast = state.SVGeqn;
    }

    resetGlyphs(reset) {
        if (this.config.useFontCache) {
            var GLYPH = BBOX.GLYPH;
            if (this.config.useGlobalCache) {
                GLYPH.defs = document.getElementById("MathJax_SVG_glyphs");
                GLYPH.defs.innerHTML = "";
            } else {
                GLYPH.defs = this.Element("defs");
                GLYPH.n++;
            }
            GLYPH.glyphs = {};
            if (reset) {
                GLYPH.n = 0;
            }
        }
    }

    //
    //  Return the containing HTML element rather than the SVG element, since
    //  most browsers can't position to an SVG element properly.
    //
    hashCheck(target) {
        if (target && target.nodeName.toLowerCase() === "g") {
            do {
                target = target.parentNode;
            } while (target && target.firstChild.nodeName !== "svg");
        }
        return target;
    }

    getJaxFromMath(math) {
        if (math.parentNode.className === "MathJax_SVG_Display") {
            math = math.parentNode;
        }
        do {
            math = math.nextSibling;
        } while (math && math.nodeName.toLowerCase() !== "script");
        return HUB.getJaxFor(math);
    }

    getHoverSpan(jax, math) {
        math.style.position = "relative"; // make sure inline containers have position set
        return math.firstChild;
    }

    getHoverBBox(jax, span, math) {
        var bbox = EVENT.getBBox(span.parentNode);
        bbox.h += 2;
        bbox.d -= 2; // bbox seems to be a bit off, so compensate (FIXME)
        return bbox;
    }

    Zoom(jax, span, math, Mw, Mh) {
        //
        //  Re-render at larger size
        //
        span.className = "MathJax_SVG";

        //
        //  get em size (taken from this.preTranslate)
        //
        var emex = span.appendChild(this.ExSpan.cloneNode(true));
        var ex = emex.firstChild.offsetHeight / 60;
        this.em = MML.mbase.prototype.em = ex / Util.TeX.x_height * 1000;
        this.ex = ex;
        this.linebreakWidth = jax.SVG.lineWidth;
        this.cwidth = jax.SVG.cwidth;
        emex.parentNode.removeChild(emex);

        span.appendChild(this.textSVG);
        this.mathDIV = span;
        this.zoomScale = parseInt(HUB.config.menuSettings.zscale) / 100;
        var tw = jax.root.data[0].EditableSVGdata.tw;
        if (tw && tw < this.cwidth) this.cwidth = tw;
        this.idPostfix = "-zoom";
        jax.root.toSVG(span, span);
        this.idPostfix = "";
        this.zoomScale = 1;
        span.removeChild(this.textSVG);

        //
        //  Don't allow overlaps on any edge
        //
        var svg = span.getElementsByTagName("svg")[0].style;
        svg.marginTop = svg.marginRight = svg.marginLeft = 0;
        if (svg.marginBottom.charAt(0) === "-")
            span.style.marginBottom = svg.marginBottom.substr(1);

        if (this.operaZoomRefresh) {
            setTimeout(function() {
                span.firstChild.style.border = "1px solid transparent";
            }, 1);
        }

        //
        // WebKit bug (issue #749)
        //
        if (span.offsetWidth < span.firstChild.offsetWidth) {
            span.style.minWidth = span.firstChild.offsetWidth + "px";
            math.style.minWidth = math.firstChild.offsetWidth + "px";
        }
        //
        //  Get height and width of zoomed math and original math
        //
        span.style.position = math.style.position = "absolute";
        var zW = span.offsetWidth,
        zH = span.offsetHeight,
        mH = math.offsetHeight,
        mW = math.offsetWidth;
        span.style.position = math.style.position = "";
        //
        return {
            Y: -EVENT.getBBox(span).h,
            mW: mW,
            mH: mH,
            zW: zW,
            zH: zH
        };
    }

    initSVG(math, span) {}

    Remove(jax) {
        var span = document.getElementById(jax.inputID + "-Frame");
        if (span) {
            if (jax.SVG.display) {
                span = span.parentNode;
            }
            span.parentNode.removeChild(span);
        }
        delete jax.SVG;
    }


    getPadding(styles) {
        var padding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        var has = false;

        for (var id in padding) {
            if (padding.hasOwnProperty(id)) {
                var pad = styles["padding" + id.charAt(0).toUpperCase() + id.substr(1)];
                if (pad) {
                    padding[id] = this.length2em(pad);
                    has = true;
                }
            }
        }
        return (has ? padding : false);
    }

    getBorders(styles) {
        var border = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        has = false;
        for (var id in border) {
            if (border.hasOwnProperty(id)) {
                var ID = "border" + id.charAt(0).toUpperCase() + id.substr(1);
                var style = styles[ID + "Style"];
                if (style && style !== "none") {
                    has = true;
                    border[id] = this.length2em(styles[ID + "Width"]);
                    border[id + "Style"] = styles[ID + "Style"];
                    border[id + "Color"] = styles[ID + "Color"];
                    if (border[id + "Color"] === "initial") {
                        border[id + "Color"] = "";
                    }
                } else {
                    delete border[id];
                }
            }
        }
        return (has ? border : false);
    }

    Element(type, def) {
        var obj = (typeof(type) === "string" ? document.createElementNS(SVGNS, type) : type);
        obj.isMathJax = true;
        if (def) {
            for (var id in def) {
                if (def.hasOwnProperty(id)) {
                    obj.setAttribute(id, def[id].toString());
                }
            }
        }
        return obj;
    }

    addElement(parent, type, def) {
        return parent.appendChild(this.Element(type, def))
    }

    HandleVariant(variant, scale, text) {
        var svg = BBOX.G();
        var n, N, c, font, VARIANT, i, m, id, M, RANGES;
        if (!variant) {
            variant = this.FONTDATA.VARIANT[MML.VARIANT.NORMAL];
        }
        if (variant.forceFamily) {
            text = BBOX.TEXT(scale, text, variant.font);
            if (variant.h !== null) {
                text.h = variant.h;
            }
            if (variant.d !== null) {
                text.d = variant.d;
            }
            svg.Add(text);
            text = "";
        }
        VARIANT = variant;
        for (i = 0, m = text.length; i < m; i++) {
            variant = VARIANT;
            n = text.charCodeAt(i);
            c = text.charAt(i);
            if (n >= 0xD800 && n < 0xDBFF) {
                i++;
                n = (((n - 0xD800) << 10) + (text.charCodeAt(i) - 0xDC00)) + 0x10000;
                if (this.FONTDATA.RemapPlane1) {
                    var nv = this.FONTDATA.RemapPlane1(n, variant);
                    n = nv.n;
                    variant = nv.variant;
                }
            } else {
                RANGES = this.FONTDATA.RANGES;
                for (id = 0, M = RANGES.length; id < M; id++) {
                    if (RANGES[id].name === "alpha" && variant.noLowerCase) continue;
                    N = variant["offset" + RANGES[id].offset];
                    if (N && n >= RANGES[id].low && n <= RANGES[id].high) {
                        if (RANGES[id].remap && RANGES[id].remap[n]) {
                            n = N + RANGES[id].remap[n];
                        } else {
                            n = n - RANGES[id].low + N;
                            if (RANGES[id].add) {
                                n += RANGES[id].add;
                            }
                        }
                        if (variant["variant" + RANGES[id].offset]) {
                            variant = this.FONTDATA.VARIANT[variant["variant" + RANGES[id].offset]];
                        }
                        break;
                    }
                }
            }
            if (variant.remap && variant.remap[n]) {
                n = variant.remap[n];
                if (variant.remap.variant) {
                    variant = this.FONTDATA.VARIANT[variant.remap.variant];
                }
            } else if (this.FONTDATA.REMAP[n] && !variant.noRemap) {
                n = this.FONTDATA.REMAP[n];
            }
            if (n instanceof Array) {
                variant = this.FONTDATA.VARIANT[n[1]];
                n = n[0];
            }
            if (typeof(n) === "string") {
                text = n + text.substr(i + 1);
                m = text.length;
                i = -1;
                continue;
            }
            font = this.lookupChar(variant, n);
            c = font[n];
            if (c) {
                if ((c[5] && c[5].space) || (c[5] === "" && c[0] + c[1] === 0)) {
                    svg.w += c[2];
                } else {
                    c = [scale, font.id + "-" + n.toString(16).toUpperCase()].concat(c);
                    svg.Add(BBOX.GLYPH.apply(BBOX, c), svg.w, 0);
                }
            } else if (this.FONTDATA.DELIMITERS[n]) {
                c = this.createDelimiter(n, 0, 1, font);
                svg.Add(c, svg.w, (this.FONTDATA.DELIMITERS[n].dir === "V" ? c.d : 0));
            } else {
                if (n <= 0xFFFF) {
                    c = String.fromCharCode(n);
                } else {
                    N = n - 0x10000;
                    c = String.fromCharCode((N >> 10) + 0xD800) + String.fromCharCode((N & 0x3FF) + 0xDC00);
                }
                var box = BBOX.TEXT(scale * 100 / SVG.config.scale, c, {
                    "font-family": variant.defaultFamily || SVG.config.undefinedFamily,
                    "font-style": (variant.italic ? "italic" : ""),
                    "font-weight": (variant.bold ? "bold" : "")
                });
                if (variant.h !== null) {
                    box.h = variant.h;
                }
                if (variant.d !== null) {
                    box.d = variant.d;
                }
                c = BBOX.G();
                c.Add(box);
                svg.Add(c, svg.w, 0);
                HUB.signal.Post(["SVG Jax - unknown char", n, variant]);
            }

            return svg;
        }

        if (text.length == 1 && font.skew && font.skew[n]) {
            svg.skew = font.skew[n] * 1000;
        }
        if (svg.element.childNodes.length === 1) {
            svg.element = svg.element.firstChild;
            svg.removeable = false;
            svg.scale = scale;
        }
        return svg;
    }

    lookupChar(variant, n) {
        var i, m;
        if (!variant.FONTS) {
            var FONTS = this.FONTDATA.FONTS;
            var fonts = (variant.fonts || this.FONTDATA.VARIANT.normal.fonts);
            if (!(fonts instanceof Array)) {
                fonts = [fonts]
            }
            if (variant.fonts != fonts) {
                variant.fonts = fonts
            }
            variant.FONTS = [];
            for (i = 0, m = fonts.length; i < m; i++) {
                if (FONTS[fonts[i]]) {
                    variant.FONTS.push(FONTS[fonts[i]])
                }
            }
        }
        for (i = 0, m = variant.FONTS.length; i < m; i++) {
            var font = variant.FONTS[i];
            if (typeof(font) === "string") {
                delete variant.FONTS;
                this.loadFont(font)
            }
            if (font[n]) {
                return font
            } else {
                this.findBlock(font, n)
            }
        }
        return {
            id: "unknown"
        };
    }

    findBlock(font, c) {
        if (font.Ranges) {
            // FIXME:  do binary search?
            for (var i = 0, m = font.Ranges.length; i < m; i++) {
                if (c < font.Ranges[i][0]) return;
                if (c <= font.Ranges[i][1]) {
                    var file = font.Ranges[i][2];
                    for (var j = font.Ranges.length - 1; j >= 0; j--) {
                        if (font.Ranges[j][2] == file) {
                            font.Ranges.splice(j, 1)
                        }
                    }
                    this.loadFont(font.directory + "/" + file + ".js");
                }
            }
        }
    }

    loadFont(file) {
        HUB.RestartAfter(AJAX.Require(this.fontDir + "/" + file));
    }

    createDelimiter(code, HW, scale, font) {
        if (!scale) {
            scale = 1
        };
        var svg = BBOX.G();
        if (!code) {
            svg.Clean();
            delete svg.element;
            svg.w = svg.r = Util.TeX.nulldelimiterspace * scale;
            return svg;
        }
        if (!(HW instanceof Array)) {
            HW = [HW, HW]
        }
        var hw = HW[1];
        HW = HW[0];
        var delim = {
            alias: code
        };
        while (delim.alias) {
            code = delim.alias;
            delim = this.FONTDATA.DELIMITERS[code];
            if (!delim) {
                delim = {
                    HW: [0, this.FONTDATA.VARIANT[MML.VARIANT.NORMAL]]
                }
            }
        }
        if (delim.load) {
            HUB.RestartAfter(AJAX.Require(this.fontDir + "/fontdata-" + delim.load + ".js"))
        }
        for (var i = 0, m = delim.HW.length; i < m; i++) {
            if (delim.HW[i][0] * scale >= HW - 10 - SVG.config.blacker || (i == m - 1 && !delim.stretch)) {
                if (delim.HW[i][2]) {
                    scale *= delim.HW[i][2]
                }
                if (delim.HW[i][3]) {
                    code = delim.HW[i][3]
                }
                return this.createChar(scale, [code, delim.HW[i][1]], font).With({
                    stretched: true
                });
            }
        }
        if (delim.stretch) {
            this["extendDelimiter" + delim.dir](svg, hw, delim.stretch, scale, font)
        }
        return svg;
    }

    createChar(scale, data, font) {
        var text = "",
        variant = {
            fonts: [data[1]],
            noRemap: true
        };
        if (font && font === MML.VARIANT.BOLD) {
            variant.fonts = [data[1] + "-bold", data[1]]
        }
        if (typeof(data[1]) !== "string") {
            variant = data[1]
        }
        if (data[0] instanceof Array) {
            for (var i = 0, m = data[0].length; i < m; i++) {
                text += String.fromCharCode(data[0][i])
            }
        } else {
            text = String.fromCharCode(data[0])
        }
        if (data[4]) {
            scale = scale * data[4]
        }
        var svg = this.HandleVariant(variant, scale, text);
        if (data[2]) {
            svg.x = data[2] * 1000
        }
        if (data[3]) {
            svg.y = data[3] * 1000
        }
        if (data[5]) {
            svg.h += data[5] * 1000
        }
        if (data[6]) {
            svg.d += data[6] * 1000
        }
        return svg;
    }

    extendDelimiterV(svg, H, delim, scale, font) {
        var top = this.createChar(scale, (delim.top || delim.ext), font);
        var bot = this.createChar(scale, (delim.bot || delim.ext), font);
        var h = top.h + top.d + bot.h + bot.d;
        var y = -top.h;
        svg.Add(top, 0, y);
        y -= top.d;
        if (delim.mid) {
            var mid = this.createChar(scale, delim.mid, font);
            h += mid.h + mid.d
        }
        if (delim.min && H < h * delim.min) {
            H = h * delim.min
        }
        if (H > h) {
            var ext = this.createChar(scale, delim.ext, font);
            var k = (delim.mid ? 2 : 1),
            eH = (H - h) / k,
            s = (eH + 100) / (ext.h + ext.d);
            while (k-- > 0) {
                var g = SVG.Element("g", {
                    transform: "translate(" + ext.y + "," + (y - s * ext.h + 50 + ext.y) + ") scale(1," + s + ")"
                });
                g.appendChild(ext.element.cloneNode(false));
                svg.element.appendChild(g);
                y -= eH;
                if (delim.mid && k) {
                    svg.Add(mid, 0, y - mid.h);
                    y -= (mid.h + mid.d)
                }
            }
        } else if (delim.mid) {
            y += (h - H) / 2;
            svg.Add(mid, 0, y - mid.h);
            y += -(mid.h + mid.d) + (h - H) / 2;
        } else {
            y += (h - H);
        }
        svg.Add(bot, 0, y - bot.h);
        svg.Clean();
        svg.scale = scale;
        svg.isMultiChar = true;
    }

    extendDelimiterH(svg, W, delim, scale, font) {
        var left = this.createChar(scale, (delim.left || delim.rep), font);
        var right = this.createChar(scale, (delim.right || delim.rep), font);
        svg.Add(left, -left.l, 0);
        var w = (left.r - left.l) + (right.r - right.l),
        x = left.r - left.l;
        if (delim.mid) {
            var mid = this.createChar(scale, delim.mid, font);
            w += mid.w
        }
        if (delim.min && W < w * delim.min) {
            W = w * delim.min
        }
        if (W > w) {
            var rep = this.createChar(scale, delim.rep, font),
            fuzz = delim.fuzz || 0;
            var k = (delim.mid ? 2 : 1),
            rW = (W - w) / k,
            s = (rW + fuzz) / (rep.r - rep.l);
            while (k-- > 0) {
                var g = SVG.Element("g", {
                    transform: "translate(" + (x - fuzz / 2 - s * rep.l + rep.x) + "," + rep.y + ") scale(" + s + ",1)"
                });
                g.appendChild(rep.element.cloneNode(false));
                svg.element.appendChild(g);
                x += rW;
                if (delim.mid && k) {
                    svg.Add(mid, x, 0);
                    x += mid.w
                }
            }
        } else if (delim.mid) {
            x -= (w - W) / 2;
            svg.Add(mid, x, 0);
            x += mid.w - (w - W) / 2;
        } else {
            x -= (w - W);
        }
        svg.Add(right, x - right.l, 0);
        svg.Clean();
        svg.scale = scale;
        svg.isMultiChar = true;
    }

    constructor() {

        HUB.Register.StartupHook("mml Jax Ready", function() {

            MML = MathJax.ElementJax.mml;

            MML.mbase.Augment(MBaseMixin.getMethods());
            MML.chars.Augment(CharsMixin.getMethods());
            MML.entity.Augment(EntityMixin.getMethods());
            MML.mo.Augment(MoMixin.getMethods());
            MML.mtext.Augment(MTextMixin.getMethods());
            MML.merror.Augment(MErrorMixin.getMethods());
            MML.ms.Augment(MsMixin.getMethods());
            MML.mglyph.Augment(MGlyphMixin.getMethods());
            MML.mspace.Augment(MSpaceMixin.getMethods());
            MML.mphantom.Augment(MPhantomMixin.getMethods());
            MML.mpadded.Augment(MPaddedMixin.getMethods());
            MML.mrow.Augment(MRowMixin.getMethods());
            MML.mstyle.Augment(MStyleMixin.getMethods());
            MML.mfrac.Augment(MFracMixin.getMethods());
            MML.msqrt.Augment(MSqrtMixin.getMethods());
            MML.mroot.Augment(MRootMixin.getMethods());
            MML.mfenced.Augment(MFencedMixin.getMethods());
            MML.menclose.Augment(MEncloseMixin.getMethods());
            MML.maction.Augment(MActionMixin.getMethods());
            MML.semantics.Augment(SemanticsMixin.getMethods());
            MML.munderover.Augment(MUnderOverMixin.getMethods());
            MML.msubsup.Augment(MSubSupMixin.getMethods());
            MML.mmultiscripts.Augment(MMultiScriptsMixin.getMethods());
            MML.mtable.Augment(MTableMixin.getMethods());
            MML.math.Augment(MathMixin.getMethods());
            MML.TeXAtom.Augment(TeXAtomMixin.getMethods());

            MML["annotation-xml"].Augment({
                toSVG: MML.mbase.SVGautoload
            });


            //  Loading isn't complete until the element jax is modified,
            //  but can't call loadComplete within the callback for "mml Jax Ready"
            //  (it would call SVG's Require routine, asking for the mml jax again)
            //  so wait until after the mml jax has finished processing.
            //
            //  We also need to wait for the onload handler to run, since the loadComplete
            //  will call Config and Startup, which need to modify the body.
            HUB.Register.StartupHook("onLoad", function() {
                setTimeout(MathJax.Callback(["loadComplete", SVG, "jax.js"]), 0);
            });
        });

        HUB.Browser.Select({
            Opera: function(browser) {
                SVG.Augment({
                    operaZoomRefresh: true // Opera needs a kick to redraw zoomed equations
                });
            }
        });

        HUB.Register.StartupHook("End Cookie", function() {
            if (HUB.config.menuSettings.zoom !== "None") {
                AJAX.Require("[MathJax]/extensions/MathZoom.js")
            }
        });

        if (!document.createElementNS) {
            //
            //  Try to handle SVG in IE8 and below, but fail
            //  (but don't crash on loading the file, so no delay for loadComplete)
            //
            if (!document.namespaces.svg) {
                document.namespaces.add("svg", SVGNS)
            }
            SVG.Augment({
                Element: function(type, def) {
                    var obj = (typeof(type) === "string" ? document.createElement("svg:" + type) : type);
                    obj.isMathJax = true;
                    if (def) {
                        for (var id in def) {
                            if (def.hasOwnProperty(id)) {
                                obj.setAttribute(id, def[id].toString())
                            }
                        }
                    }
                    return obj;
                }
            });
        }
    }
}
