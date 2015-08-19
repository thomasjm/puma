
interface Config {
    config: any;
}

class EditableSVGConfig {
    config = {
        styles: {
            ".MathJax_SVG": {
                "display": "inline",
                "font-style": "normal",
                "font-weight": "normal",
                "line-height": "normal",
                "font-size": "100%",
                "font-size-adjust": "none",
                "text-indent": 0,
                "text-align": "left",
                "text-transform": "none",
                "letter-spacing": "normal",
                "word-spacing": "normal",
                "word-wrap": "normal",
                "white-space": "nowrap",
                "float": "none",
                "direction": "ltr",
                "max-width": "none",
                "max-height": "none",
                "min-width": 0,
                "min-height": 0,
                border: 0,
                padding: 0,
                margin: 0
            },

            ".MathJax_SVG_Display": {
                position: "relative",
                display: "block!important",
                "text-indent": 0,
                "max-width": "none",
                "max-height": "none",
                "min-width": 0,
                "min-height": 0,
                width: "100%"
            },

            ".MathJax_SVG *": {
                transition: "none",
                "-webkit-transition": "none",
                "-moz-transition": "none",
                "-ms-transition": "none",
                "-o-transition": "none"
            },

            ".mjx-svg-href": {
                fill: "blue",
                stroke: "blue"
            },

            ".MathJax_SVG_Processing": {
                visibility: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                overflow: "hidden",
                display: "block!important"
            },

            ".MathJax_SVG_Processed": {
                display: "none!important"
            },

            ".MathJax_SVG_ExBox": {
                display: "block!important",
                overflow: "hidden",
                width: "1px",
                height: "60ex",
                "min-height": 0,
                "max-height": "none",
                padding: 0,
                border: 0,
                margin: 0
            },

            "#MathJax_SVG_Tooltip": {
                position: "absolute",
                left: 0,
                top: 0,
                width: "auto",
                height: "auto",
                display: "none"
            }
        }
    }
}
