/*!
 *  CanvasInput v1.2.0
 *  http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
 *
 *  (c) 2013-2015, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

class CanvasInput {
    that = this;

    // create a buffer that stores all inputs so that tabbing
    // between them is made possible.
    inputs: any;
    _inputsIndex: number;

    _canvas: HTMLCanvasElement;
    _renderCanvas: HTMLCanvasElement;
    _ctx: any; // TODO: find RenderingContext interface definition
    _renderCtx: any;
    _x: number;
    _y: number;
    _extraX: number;
    _extraY: number;
    _fontSize: number;
    _fontFamily: string;
    _fontColor: string;
    _placeHolderColor: string;
    _fontWeight: string;
    _fontStyle: string;
    _readonly: boolean;
    _maxlength: number;
    _width: number;
    _height: number;
    _padding: number;
    _borderWidth: number;
    _borderColor: string;
    _borderRadius: number;
    _backgroundColor: any;
    _backgroundImage: string;
    _boxShadow: any;
    _innerShadow: string;
    _selectionColor: string;
    _placeHolder: string;
    _value: string;
    _onsubmit: any;
    _onkeydown: any;
    _onkeyup: any;
    _onfocus: any;
    _onblur: any;
    _cursor = false;
    _cursorPos: number;
    _hasFocus: boolean;
    _selection = [0, 0];
    _wasOver: boolean;
    _mouseDown: boolean;

    _hiddenInput: HTMLInputElement;

    // outer stuff
    outerW: number;
    outerH: number;

    // shadow stuff
    shadowW: number;
    shadowH: number;
    shadowL: number;
    shadowR: number;
    shadowT: number;
    shadowB: number;

    // selection stuff
    _selectionStart: number;
    _selectionUpdated: boolean;
    _cursorInterval: number;
    _endSelection: boolean;

    constructor(o: any) {

        o = o ? o : {};

        this.inputs = [];

        // setup the defaults
        this._canvas = o.canvas || null;
        this._ctx = o.context || null;
        this._x = o.x || 0;
        this._y = o.y || 0;
        this._extraX = o.extraX || 0;
        this._extraY = o.extraY || 0;
        this._fontSize = o.fontSize || 14;
        this._fontFamily = o.fontFamily || 'Arial';
        this._fontColor = o.fontColor || '#000';
        this._placeHolderColor = o.placeHolderColor || '#bfbebd';
        this._fontWeight = o.fontWeight || 'normal';
        this._fontStyle = o.fontStyle || 'normal';
        this._readonly = o.readonly || false;
        this._maxlength = o.maxlength || null;
        this._width = o.width || 150;
        this._height = o.height || this._fontSize;
        this._padding = o.padding >= 0 ? o.padding : 5;
        this._borderWidth = o.borderWidth >= 0 ? o.borderWidth : 1;
        this._borderColor = o.borderColor || '#959595';
        this._borderRadius = o.borderRadius >= 0 ? o.borderRadius : 3;
        this._backgroundImage = o.backgroundImage || '';
        this._boxShadow = o.boxShadow || '1px 1px 0px rgba(255, 255, 255, 1)';
        this._innerShadow = o.innerShadow || '0px 0px 4px rgba(0, 0, 0, 0.4)';
        this._selectionColor = o.selectionColor || 'rgba(179, 212, 253, 0.8)';
        this._placeHolder = o.placeHolder || '';
        this._value = (o.value || this._placeHolder) + '';
        this._onsubmit = o.onsubmit || function() {};
        this._onkeydown = o.onkeydown || function() {};
        this._onkeyup = o.onkeyup || function() {};
        this._onfocus = o.onfocus || function() {};
        this._onblur = o.onblur || function() {};
        this._cursor = false;
        this._cursorPos = 0;
        this._hasFocus = false;
        this._selection = [0, 0];
        this._wasOver = false;

        // parse box shadow
        this.boxShadow(this._boxShadow, true);

        // calculate the full width and height with padding, borders and shadows
        this._calcWH();

        // setup the off-DOM canvas
        this._renderCanvas = document.createElement('canvas');
        this._renderCanvas.setAttribute('width', this.outerW.toString());
        this._renderCanvas.setAttribute('height', this.outerH.toString());
        this._renderCtx = this._renderCanvas.getContext('2d');

        // // setup another off-DOM canvas for inner-shadows
        // this._shadowCanvas = document.createElement('canvas');
        // this._shadowCanvas.setAttribute('width', this._width + this._padding * 2);
        // this._shadowCanvas.setAttribute('height', this._height + this._padding * 2);
        // this._shadowCtx = this._shadowCanvas.getContext('2d');

        // setup the background color
        if (typeof o.backgroundGradient !== 'undefined') {
            this._backgroundColor = this._renderCtx.createLinearGradient(
                0,
                0,
                0,
                this.outerH
            );
            this._backgroundColor.addColorStop(0, o.backgroundGradient[0]);
            this._backgroundColor.addColorStop(1, o.backgroundGradient[1]);
        } else {
            this._backgroundColor = o.backgroundColor || '#fff';
        }

        // setup main canvas events
        if (this._canvas) {
            this._canvas.addEventListener('mousemove', (e) => {
                var e2 = e || window.event;
                this.mousemove(e2, self);
            }, false);

            this._canvas.addEventListener('mousedown', (e) => {
                var e2 = e || window.event;
                this.mousedown(e2, self);
            }, false);

            this._canvas.addEventListener('mouseup', (e) => {
                var e2 = e || window.event;
                this.mouseup(e2, self);
            }, false);
        }

        // setup a global mouseup to blur the input outside of the canvas
        window.addEventListener('mouseup', (e) => {
            if (this._hasFocus && !this._mouseDown) {
                this.blur(undefined);
            }
        }, true);

        // create the hidden input element
        this._hiddenInput = document.createElement('input');
        this._hiddenInput.type = 'text';
        this._hiddenInput.style.position = 'absolute';
        this._hiddenInput.style.opacity = '0';
        this._hiddenInput.style.pointerEvents = 'none';
        this._hiddenInput.style.left = (this._x + this._extraX + (this._canvas ? this._canvas.offsetLeft : 0)) + 'px';
        this._hiddenInput.style.top = (this._y + this._extraY + (this._canvas ? this._canvas.offsetTop : 0)) + 'px';
        this._hiddenInput.style.width = this._width + 'px';
        this._hiddenInput.style.height = this._height + 'px';
        this._hiddenInput.style.zIndex = '0';
        if (this._maxlength) {
            this._hiddenInput.maxLength = this._maxlength;
        }

        document.body.appendChild(this._hiddenInput);
        this._hiddenInput.value = this._value;

        // setup the keydown listener
        this._hiddenInput.addEventListener('keydown', (e) => {
            var e2 = e || window.event;

            if (this._hasFocus) {
                this.keydown(e2, self);
            }
        });

        // setup the keyup listener
        this._hiddenInput.addEventListener('keyup', (e) => {
            var e2 = e || window.event;

            // update the canvas input state information from the hidden input
            this._value = this._hiddenInput.value;
            this._cursorPos = this._hiddenInput.selectionStart;
            this.render();

            if (this._hasFocus) {
                this._onkeyup(e2, self);
            }
        });

        // add this to the buffer
        this.inputs.push(self);
        this._inputsIndex = this.inputs.length - 1;

        // draw the text box
        this.render();
    }

    /**
     * Get/set the main canvas.
     * @param  {Object} data Canvas reference.
     * @return {Mixed}      CanvasInput or current canvas.
     */
    canvas(data: any) {
        if (typeof data !== 'undefined') {
            this._canvas = data;
            this._ctx = this._canvas.getContext('2d');

            return this.render();
        } else {
            return this._canvas;
        }
    }

    /**
     * Get/set the x-position.
     * @param  {Number} data The pixel position along the x-coordinate.
     * @return {Mixed}      CanvasInput or current x-value.
     */
    x(data) {
        if (typeof data !== 'undefined') {
            this._x = data;

            return this.render();
        } else {
            return this._x;
        }
    }

    /**
     * Get/set the y-position.
     * @param  {Number} data The pixel position along the y-coordinate.
     * @return {Mixed}      CanvasInput or current y-value.
     */
    y(data) {
        if (typeof data !== 'undefined') {
            this._y = data;

            return this.render();
        } else {
            return this._y;
        }
    }

    /**
     * Get/set the extra x-position (generally used when no canvas is specified).
     * @param  {Number} data The pixel position along the x-coordinate.
     * @return {Mixed}      CanvasInput or current x-value.
     */
    extraX(data) {
        if (typeof data !== 'undefined') {
            this._extraX = data;

            return this.render();
        } else {
            return this._extraX;
        }
    }

    /**
     * Get/set the extra y-position (generally used when no canvas is specified).
     * @param  {Number} data The pixel position along the y-coordinate.
     * @return {Mixed}      CanvasInput or current y-value.
     */
    extraY(data) {
        if (typeof data !== 'undefined') {
            this._extraY = data;

            return this.render();
        } else {
            return this._extraY;
        }
    }

    /**
     * Get/set the font size.
     * @param  {Number} data Font size.
     * @return {Mixed}      CanvasInput or current font size.
     */
    fontSize(data) {
        if (typeof data !== 'undefined') {
            this._fontSize = data;

            return this.render();
        } else {
            return this._fontSize;
        }
    }

    /**
     * Get/set the font family.
     * @param  {String} data Font family.
     * @return {Mixed}      CanvasInput or current font family.
     */
    fontFamily(data) {
        if (typeof data !== 'undefined') {
            this._fontFamily = data;

            return this.render();
        } else {
            return this._fontFamily;
        }
    }

    /**
     * Get/set the font color.
     * @param  {String} data Font color.
     * @return {Mixed}      CanvasInput or current font color.
     */
    fontColor(data) {
        if (typeof data !== 'undefined') {
            this._fontColor = data;

            return this.render();
        } else {
            return this._fontColor;
        }
    }

    /**
     * Get/set the place holder font color.
     * @param  {String} data Font color.
     * @return {Mixed}      CanvasInput or current place holder font color.
     */
    placeHolderColor(data) {
        if (typeof data !== 'undefined') {
            this._placeHolderColor = data;

            return this.render();
        } else {
            return this._placeHolderColor;
        }
    }

    /**
     * Get/set the font weight.
     * @param  {String} data Font weight.
     * @return {Mixed}      CanvasInput or current font weight.
     */
    fontWeight(data) {
        if (typeof data !== 'undefined') {
            this._fontWeight = data;

            return this.render();
        } else {
            return this._fontWeight;
        }
    }

    /**
     * Get/set the font style.
     * @param  {String} data Font style.
     * @return {Mixed}      CanvasInput or current font style.
     */
    fontStyle(data) {
        if (typeof data !== 'undefined') {
            this._fontStyle = data;

            return this.render();
        } else {
            return this._fontStyle;
        }
    }

    /**
     * Get/set the width of the text box.
     * @param  {Number} data Width in pixels.
     * @return {Mixed}      CanvasInput or current width.
     */
    width(data) {
        if (typeof data !== 'undefined') {
            this._width = data;
            this._calcWH();
            this._updateCanvasWH();

            return this.render();
        } else {
            return this._width;
        }
    }

    /**
     * Get/set the height of the text box.
     * @param  {Number} data Height in pixels.
     * @return {Mixed}      CanvasInput or current height.
     */
    height(data) {
        if (typeof data !== 'undefined') {
            this._height = data;
            this._calcWH();
            this._updateCanvasWH();

            return this.render();
        } else {
            return this._height;
        }
    }

    /**
     * Get/set the padding of the text box.
     * @param  {Number} data Padding in pixels.
     * @return {Mixed}      CanvasInput or current padding.
     */
    padding(data) {
        if (typeof data !== 'undefined') {
            this._padding = data;
            this._calcWH();
            this._updateCanvasWH();

            return this.render();
        } else {
            return this._padding;
        }
    }

    /**
     * Get/set the border width.
     * @param  {Number} data Border width.
     * @return {Mixed}      CanvasInput or current border width.
     */
    borderWidth(data) {
        if (typeof data !== 'undefined') {
            this._borderWidth = data;
            this._calcWH();
            this._updateCanvasWH();

            return this.render();
        } else {
            return this._borderWidth;
        }
    }

    /**
     * Get/set the border color.
     * @param  {String} data Border color.
     * @return {Mixed}      CanvasInput or current border color.
     */
    borderColor(data) {
        if (typeof data !== 'undefined') {
            this._borderColor = data;

            return this.render();
        } else {
            return this._borderColor;
        }
    }

    /**
     * Get/set the border radius.
     * @param  {Number} data Border radius.
     * @return {Mixed}      CanvasInput or current border radius.
     */
    borderRadius(data) {
        if (typeof data !== 'undefined') {
            this._borderRadius = data;

            return this.render();
        } else {
            return this._borderRadius;
        }
    }

    /**
     * Get/set the background color.
     * @param  {Number} data Background color.
     * @return {Mixed}      CanvasInput or current background color.
     */
    backgroundColor(data) {
        if (typeof data !== 'undefined') {
            this._backgroundColor = data;

            return this.render();
        } else {
            return this._backgroundColor;
        }
    }

    /**
     * Get/set the background gradient.
     * @param  {Number} data Background gradient.
     * @return {Mixed}      CanvasInput or current background gradient.
     */
    backgroundGradient(data) {
        if (typeof data !== 'undefined') {
            this._backgroundColor = this._renderCtx.createLinearGradient(
                0,
                0,
                0,
                this.outerH
            );
            this._backgroundColor.addColorStop(0, data[0]);
            this._backgroundColor.addColorStop(1, data[1]);

            return this.render();
        } else {
            return this._backgroundColor;
        }
    }

    /**
     * Get/set the box shadow.
     * @param  {String} data     Box shadow in CSS format (1px 1px 1px rgba(0, 0, 0.5)).
     * @param  {Boolean} doReturn (optional) True to prevent a premature render.
     * @return {Mixed}          CanvasInput or current box shadow.
     */
    boxShadow(data, doReturn) {
        if (typeof data !== 'undefined') {
            // parse box shadow
            var boxShadow = data.split('px ');
            this._boxShadow = {
                x: this._boxShadow === 'none' ? 0 : parseInt(boxShadow[0], 10),
                y: this._boxShadow === 'none' ? 0 : parseInt(boxShadow[1], 10),
                blur: this._boxShadow === 'none' ? 0 : parseInt(boxShadow[2], 10),
                color: this._boxShadow === 'none' ? '' : boxShadow[3]
            };

            // take into account the shadow and its direction
            if (this._boxShadow.x < 0) {
                this.shadowL = Math.abs(this._boxShadow.x) + this._boxShadow.blur;
                this.shadowR = this._boxShadow.blur + this._boxShadow.x;
            } else {
                this.shadowL = Math.abs(this._boxShadow.blur - this._boxShadow.x);
                this.shadowR = this._boxShadow.blur + this._boxShadow.x;
            }
            if (this._boxShadow.y < 0) {
                this.shadowT = Math.abs(this._boxShadow.y) + this._boxShadow.blur;
                this.shadowB = this._boxShadow.blur + this._boxShadow.y;
            } else {
                this.shadowT = Math.abs(this._boxShadow.blur - this._boxShadow.y);
                this.shadowB = this._boxShadow.blur + this._boxShadow.y;
            }

            this.shadowW = this.shadowL + this.shadowR;
            this.shadowH = this.shadowT + this.shadowB;

            this._calcWH();

            if (!doReturn) {
                this._updateCanvasWH();

                return this.render();
            }
        } else {
            return this._boxShadow;
        }
    }

    /**
     * Get/set the inner shadow.
     * @param  {String} data In the format of a CSS box shadow (1px 1px 1px rgba(0, 0, 0.5)).
     * @return {Mixed}          CanvasInput or current inner shadow.
     */
    innerShadow(data) {
        if (typeof data !== 'undefined') {
            this._innerShadow = data;

            return this.render();
        } else {
            return this._innerShadow;
        }
    }

    /**
     * Get/set the text selection color.
     * @param  {String} data Color.
     * @return {Mixed}      CanvasInput or current selection color.
     */
    selectionColor(data) {
        if (typeof data !== 'undefined') {
            this._selectionColor = data;

            return this.render();
        } else {
            return this._selectionColor;
        }
    }

    /**
     * Get/set the place holder text.
     * @param  {String} data Place holder text.
     * @return {Mixed}      CanvasInput or current place holder text.
     */
    placeHolder(data) {
        if (typeof data !== 'undefined') {
            this._placeHolder = data;

            return this.render();
        } else {
            return this._placeHolder;
        }
    }

    /**
     * Get/set the current text box value.
     * @param  {String} data Text value.
     * @return {Mixed}      CanvasInput or current text value.
     */
    value(data) {
        if (typeof data !== 'undefined') {
            this._value = data + '';
            this._hiddenInput.value = data + '';

            // update the cursor position
            this._cursorPos = this._clipText(undefined).length;

            return this.render();
        } else {
            return (this._value === this._placeHolder) ? '' : this._value;
        }
    }

    /**
     * Set or fire the onsubmit event.
     * @param  {Function} fn Custom callback.
     */
    onsubmit(fn) {
        if (typeof fn !== 'undefined') {
            this._onsubmit = fn;

            return self;
        } else {
            this._onsubmit();
        }
    }

    /**
     * Set or fire the onkeydown event.
     * @param  {Function} fn Custom callback.
     */
    onkeydown(fn) {
        if (typeof fn !== 'undefined') {
            this._onkeydown = fn;

            return self;
        } else {
            this._onkeydown();
        }
    }

    /**
     * Set or fire the onkeyup event.
     * @param  {Function} fn Custom callback.
     */
    onkeyup(fn) {
        if (typeof fn !== 'undefined') {
            this._onkeyup = fn;

            return self;
        } else {
            this._onkeyup();
        }
    }

    /**
     * Place focus on the CanvasInput box, placing the cursor
     * either at the end of the text or where the user clicked.
     * @param  {Number} pos (optional) The position to place the cursor.
     * @return {CanvasInput}
     */
    focus(pos) {
        // only fire the focus event when going from unfocussed
        if (!this._hasFocus) {
            this._onfocus(self);

            // remove focus from all other inputs
            for (var i = 0; i < this.inputs.length; i++) {
                if (this.inputs[i]._hasFocus) {
                    this.inputs[i].blur();
                }
            }
        }

        // remove selection
        if (!this._selectionUpdated) {
            this._selection = [0, 0];
        } else {
            delete this._selectionUpdated;
        }

        // if this is readonly, don't allow it to get focus
        this._hasFocus = true;
        if (this._readonly) {
            this._hiddenInput.readOnly = true;
            return;
        } else {
            this._hiddenInput.readOnly = false;
        }

        // update the cursor position
        this._cursorPos = (typeof pos === 'number') ? pos : this._clipText(undefined).length;

        // clear the place holder
        if (this._placeHolder === this._value) {
            this._value = '';
            this._hiddenInput.value = '';
        }

        this._cursor = true;

        // setup cursor interval
        if (this._cursorInterval) {
            clearInterval(this._cursorInterval);
        }
        this._cursorInterval = setInterval(() => {
            this._cursor = !this._cursor;
            this.render();
        }, 500);

        // move the real focus to the hidden input
        var hasSelection = (this._selection[0] > 0 || this._selection[1] > 0);
        this._hiddenInput.focus();
        this._hiddenInput.selectionStart = hasSelection ? this._selection[0] : this._cursorPos;
        this._hiddenInput.selectionEnd = hasSelection ? this._selection[1] : this._cursorPos;

        return this.render();
    }

    /**
     * Removes focus from the CanvasInput box.
     * @param  {Object} _this Reference to this.
     * @return {CanvasInput}
     */
    blur(_this2) {
        var self = _this2 || this;

        this._onblur(self);

        if (this._cursorInterval) {
            clearInterval(this._cursorInterval);
        }
        this._hasFocus = false;
        this._cursor = false;
        this._selection = [0, 0];
        this._hiddenInput.blur();

        // fill the place holder
        if (this._value === '') {
            this._value = this._placeHolder;
        }

        return this.render();
    }

    /**
     * Fired with the keydown event to draw the typed characters.
     * @param  {Event}       e    The keydown event.
     * @param  {CanvasInput} self
     * @return {CanvasInput}
     */
    keydown(e, self) {
        var keyCode = e.which,
        isShift = e.shiftKey,
        key = null,
        startText, endText;

        // make sure the correct text field is being updated
        if (this._readonly || !this._hasFocus) {
            return;
        }

        // fire custom user event
        this._onkeydown(e, self);

        // add support for Ctrl/Cmd+A selection
        if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
            this.selectText(undefined);
            e.preventDefault();
            return this.render();
        }

        // block keys that shouldn't be processed
        if (keyCode === 17 || e.metaKey || e.ctrlKey) {
            return self;
        }

        if (keyCode === 13) { // enter key
            e.preventDefault();
            this._onsubmit(e, self);
        } else if (keyCode === 9) { // tab key
            e.preventDefault();
            if (this.inputs.length > 1) {
                var next = (this.inputs[this._inputsIndex + 1]) ? this._inputsIndex + 1 : 0;
                this.blur(undefined);
                setTimeout(function() {
                    this.inputs[next].focus();
                }, 10);
            }
        }

        // update the canvas input state information from the hidden input
        this._value = this._hiddenInput.value;
        this._cursorPos = this._hiddenInput.selectionStart;
        this._selection = [0, 0];

        return this.render();
    }

    /**
     * Fired with the click event on the canvas, and puts focus on/off
     * based on where the user clicks.
     * @param  {Event}       e    The click event.
     * @param  {CanvasInput} self
     * @return {CanvasInput}
     */
    click(e, self) {
        var mouse = this._mousePos(e),
        x = mouse.x,
        y = mouse.y;

        if (this._endSelection) {
            delete this._endSelection;
            delete this._selectionUpdated;
            return;
        }

        if (this._canvas && this._overInput(x, y) || !this._canvas) {
            if (this._mouseDown) {
                this._mouseDown = false;
                this.click(e, self);
                return this.focus(this._clickPos(x, y));
            }
        } else {
            return this.blur(undefined);
        }
    }

    /**
     * Fired with the mousemove event to update the default cursor.
     * @param  {Event}       e    The mousemove event.
     * @param  {CanvasInput} self
     * @return {CanvasInput}
     */
    mousemove(e, self) {
        var mouse = this._mousePos(e),
        x = mouse.x,
        y = mouse.y,
        isOver = this._overInput(x, y);

        if (isOver && this._canvas) {
            this._canvas.style.cursor = 'text';
            this._wasOver = true;
        } else if (this._wasOver && this._canvas) {
            this._canvas.style.cursor = 'default';
            this._wasOver = false;
        }

        if (this._hasFocus && this._selectionStart >= 0) {
            var curPos = this._clickPos(x, y),
            start = Math.min(this._selectionStart, curPos),
            end = Math.max(this._selectionStart, curPos);

            if (!isOver) {
                this._selectionUpdated = true;
                this._endSelection = true;
                delete this._selectionStart;
                this.render();
                return;
            }

            if (this._selection[0] !== start || this._selection[1] !== end) {
                this._selection = [start, end];
                this.render();
            }
        }
    }

    /**
     * Fired with the mousedown event to start a selection drag.
     * @param  {Event} e    The mousedown event.
     * @param  {CanvasInput} self
     */
    mousedown(e, self) {
        var mouse = this._mousePos(e),
        x = mouse.x,
        y = mouse.y,
        isOver = this._overInput(x, y);

        // setup the 'click' event
        this._mouseDown = isOver;

        // start the selection drag if inside the input
        if (this._hasFocus && isOver) {
            this._selectionStart = this._clickPos(x, y);
        }
    }

    /**
     * Fired with the mouseup event to end a selection drag.
     * @param  {Event} e    The mouseup event.
     * @param  {CanvasInput} self
     */
    mouseup(e, self) {
        var mouse = this._mousePos(e),
        x = mouse.x,
        y = mouse.y;

        // update selection if a drag has happened
        var isSelection = this._clickPos(x, y) !== this._selectionStart;
        if (this._hasFocus && this._selectionStart >= 0 && this._overInput(x, y) && isSelection) {
            this._selectionUpdated = true;
            delete this._selectionStart;
            this.render();
        } else {
            delete this._selectionStart;
        }

        this.click(e, self);
    }

    /**
     * Select a range of text in the input.
     * @param  {Array} range (optional) Leave blank to select all. Format: [start, end]
     * @return {CanvasInput}
     */
    selectText(range) {
        var range = range || [0, this._value.length];

        // select the range of text specified (or all if none specified)
        setTimeout(function() {
            this._selection = [range[0], range[1]];
            this._hiddenInput.selectionStart = range[0];
            this._hiddenInput.selectionEnd = range[1];
            this.render();
        }, 1);

        return self;
    }

    /**
     * Helper method to get the off-DOM canvas.
     * @return {Object} Reference to the canvas.
     */
    renderCanvas() {
        return this._renderCanvas;
    }

    /**
     * Clears and redraws the CanvasInput on an off-DOM canvas,
     * and if a main canvas is provided, draws it all onto that.
     * @return {CanvasInput}
     */
    render(): any {
        var ctx = this._renderCtx,
        w = this.outerW,
        h = this.outerH,
        br = this._borderRadius,
        bw = this._borderWidth,
        sw = this.shadowW,
        sh = this.shadowH;

        if (!ctx) {
            return;
        }

        // clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // setup the box shadow
        ctx.shadowOffsetX = this._boxShadow.x;
        ctx.shadowOffsetY = this._boxShadow.y;
        ctx.shadowBlur = this._boxShadow.blur;
        ctx.shadowColor = this._boxShadow.color;

        // draw the border
        if (this._borderWidth > 0) {
            ctx.fillStyle = this._borderColor;
            this._roundedRect(ctx, this.shadowL, this.shadowT, w - sw, h - sh, br);
            ctx.fill();

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
        }

        // draw the text box background
        this._drawTextBox(() => {
            // make sure all shadows are reset
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

            // clip the text so that it fits within the box
            var text = this._clipText(undefined);

            // draw the selection
            var paddingBorder = this._padding + this._borderWidth + this.shadowT;
            if (this._selection[1] > 0) {
                var selectOffset = this._textWidth(text.substring(0, this._selection[0])),
                selectWidth = this._textWidth(text.substring(this._selection[0], this._selection[1]));

                ctx.fillStyle = this._selectionColor;
                ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, this._height);
            }

            // draw the cursor
            if (this._cursor) {
                var cursorOffset = this._textWidth(text.substring(0, this._cursorPos));
                ctx.fillStyle = this._fontColor;
                ctx.fillRect(paddingBorder + cursorOffset, paddingBorder, 1, this._height);
            }

            // draw the text
            var textX = this._padding + this._borderWidth + this.shadowL,
            textY = Math.round(paddingBorder + this._height / 2);

            // only remove the placeholder text if they have typed something
            text = (text === '' && this._placeHolder) ? this._placeHolder : text;

            ctx.fillStyle = (this._value !== '' && this._value !== this._placeHolder) ? this._fontColor : this._placeHolderColor;
            ctx.font = this._fontStyle + ' ' + this._fontWeight + ' ' + this._fontSize + 'px ' + this._fontFamily;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);

            // parse inner shadow
            var innerShadow = this._innerShadow.split('px '),
            isOffsetX = this._innerShadow === 'none' ? 0 : parseInt(innerShadow[0], 10),
            isOffsetY = this._innerShadow === 'none' ? 0 : parseInt(innerShadow[1], 10),
            isBlur = this._innerShadow === 'none' ? 0 : parseInt(innerShadow[2], 10),
            isColor = this._innerShadow === 'none' ? '' : innerShadow[3];

            // draw to the visible canvas
            if (this._ctx) {
                this._ctx.clearRect(this._x, this._y, ctx.canvas.width, ctx.canvas.height);
                this._ctx.drawImage(this._renderCanvas, this._x, this._y);
            }

            return self;

        });
    }

    /**
     * Destroy this input and stop rendering it.
     */
    destroy() {
        // pull from the inputs array
        var index = this.inputs.indexOf(self);
        if (index) {
            this.inputs.splice(index, 1);
        }

        // remove focus
        if (this._hasFocus) {
            this.blur(undefined);
        }

        // remove the hidden input box
        document.body.removeChild(this._hiddenInput);

        // remove off-DOM canvas
        this._renderCanvas = null;
        // this._shadowCanvas = null;
        this._renderCtx = null;
    }

    /**
     * Draw the text box area with either an image or background color.
     * @param  {Function} fn Callback.
     */
    _drawTextBox(fn) {
        var ctx = this._renderCtx,
        w = this.outerW,
        h = this.outerH,
        br = this._borderRadius,
        bw = this._borderWidth,
        sw = this.shadowW,
        sh = this.shadowH;

        // only draw the background shape if no image is being used
        if (this._backgroundImage === '') {
            ctx.fillStyle = this._backgroundColor;
            this._roundedRect(ctx, bw + this.shadowL, bw + this.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
            ctx.fill();

            fn();
        } else {
            var img = new Image();
            img.src = this._backgroundImage;
            img.onload = function() {
                ctx.drawImage(img, 0, 0, img.width, img.height, bw + this.shadowL, bw + this.shadowT, w, h);

                fn();
            };
        }
    }

    /**
     * Deletes selected text in selection range and repositions cursor.
     * @return {Boolean} true if text removed.
     */
    _clearSelection() {
        if (this._selection[1] > 0) {
            // clear the selected contents
            var start = this._selection[0],
            end = this._selection[1];

            this._value = this._value.substr(0, start) + this._value.substr(end);
            this._cursorPos = start;
            this._cursorPos = (this._cursorPos < 0) ? 0 : this._cursorPos;
            this._selection = [0, 0];

            return true;
        }

        return false;
    }

    /**
     * Clip the text string to only return what fits in the visible text box.
     * @param  {String} value The text to clip.
     * @return {String} The clipped text.
     */
    _clipText(value) {
        var value = (typeof value === 'undefined') ? this._value : value;

        var textWidth = this._textWidth(value),
        fillPer = textWidth / (this._width - this._padding),
        text = fillPer > 1 ? value.substr(-1 * Math.floor(value.length / fillPer)) : value;

        return text + '';
    }

    /**
     * Gets the pixel with of passed text.
     * @param  {String} text The text to measure.
     * @return {Number}      The measured width.
     */
    _textWidth(text) {
        var ctx = this._renderCtx;

        ctx.font = this._fontStyle + ' ' + this._fontWeight + ' ' + this._fontSize + 'px ' + this._fontFamily;
        ctx.textAlign = 'left';

        return ctx.measureText(text).width;
    }

    /**
     * Recalculate the outer with and height of the text box.
     */
    _calcWH() {
        // calculate the full width and height with padding, borders and shadows
        this.outerW = this._width + this._padding * 2 + this._borderWidth * 2 + this.shadowW;
        this.outerH = this._height + this._padding * 2 + this._borderWidth * 2 + this.shadowH;
    }

    /**
     * Update the width and height of the off-DOM canvas when attributes are changed.
     */
    _updateCanvasWH() {
        var oldW = this._renderCanvas.width;
        var oldH = this._renderCanvas.height;

        // // update off-DOM canvas
        // this._renderCanvas.setAttribute('width', this.outerW);
        // this._renderCanvas.setAttribute('height', this.outerH);
        // this._shadowCanvas.setAttribute('width', this._width + this._padding * 2);
        // this._shadowCanvas.setAttribute('height', this._height + this._padding * 2);

        // clear the main canvas
        if (this._ctx) {
            this._ctx.clearRect(this._x, this._y, oldW, oldH);
        }
    }

    /**
     * Creates the path for a rectangle with rounded corners.
     * Must call ctx.fill() after calling this to draw the rectangle.
     * @param  {Object} ctx Canvas context.
     * @param  {Number} x   x-coordinate to draw from.
     * @param  {Number} y   y-coordinate to draw from.
     * @param  {Number} w   Width of rectangle.
     * @param  {Number} h   Height of rectangle.
     * @param  {Number} r   Border radius.
     */
    _roundedRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;

        ctx.beginPath();

        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);

        ctx.closePath();
    }

    /**
     * Checks if a coordinate point is over the input box.
     * @param  {Number} x x-coordinate position.
     * @param  {Number} y y-coordinate position.
     * @return {Boolean}   True if it is over the input box.
     */
    _overInput(x, y) {
        var xLeft = x >= this._x + this._extraX,
        xRight = x <= this._x + this._extraX + this._width + this._padding * 2,
        yTop = y >= this._y + this._extraY,
        yBottom = y <= this._y + this._extraY + this._height + this._padding * 2;

        return xLeft && xRight && yTop && yBottom;
    }

    /**
     * Use the mouse's x & y coordinates to determine
     * the position clicked in the text.
     * @param  {Number} x X-coordinate.
     * @param  {Number} y Y-coordinate.
     * @return {Number}   Cursor position.
     */
    _clickPos(x, y) {
        var value = this._value;

        // don't count placeholder text in this
        if (this._value === this._placeHolder) {
            value = '';
        }

        // determine where the click was made along the string
        var text = this._clipText(value),
        totalW = 0,
        pos = text.length;

        if (x - (this._x + this._extraX) < this._textWidth(text)) {
            // loop through each character to identify the position
            for (var i=0; i<text.length; i++) {
                totalW += this._textWidth(text[i]);
                if (totalW >= x - (this._x + this._extraX)) {
                    pos = i;
                    break;
                }
            }
        }

        return pos;
    }

    /**
     * Calculate the mouse position based on the event callback and the elements on the page.
     * @param  {Event} e
     * @return {Object}   x & y values
     */
    _mousePos(e) {
        var elm = e.target;
        var style = document.defaultView.getComputedStyle(elm, undefined);
        var paddingLeft = parseInt(style['paddingLeft'], 10) || 0;
        var paddingTop = parseInt(style['paddingLeft'], 10) || 0;
        var borderLeft = parseInt(style['borderLeftWidth'], 10) || 0;
        var borderTop = parseInt(style['borderLeftWidth'], 10) || 0;
        var parentNode = <HTMLElement>document.body.parentNode;
        var htmlTop = parentNode.offsetTop || 0;
        var htmlLeft = parentNode.offsetLeft || 0;
        var offsetX = 0;
        var offsetY = 0;
        var x, y;

        // calculate the total offset
        if (typeof elm.offsetParent !== 'undefined') {
            do {
                offsetX += elm.offsetLeft;
                offsetY += elm.offsetTop;
            } while ((elm = elm.offsetParent));
        }

        // take into account borders and padding
        offsetX += paddingLeft + borderLeft + htmlLeft;
        offsetY += paddingTop + borderTop + htmlTop;

        return {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY
        };
    }};
