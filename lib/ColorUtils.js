var ColorConvert = require('color-convert')();

module.exports = {
    RGBtoHSL: function(rgb) {
        var hsl = ColorConvert.rgb(rgb).hsl();
        hsl[1] /= 100;
        hsl[2] /= 100;
        return hsl;
    },

    HSLtoRGB: function(hsl) {
        hsl[1] *= 100;
        hsl[2] *= 100;
        return ColorConvert.hsl(hsl).rgb();
    }
};
