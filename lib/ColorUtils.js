module.exports = {
    RGBtoHSL: function(rgb) {
        var rf = rgb[0] / 255;
        var gf = rgb[1] / 255;
        var bf = rgb[2] / 255;
        var max = Math.max(rf, Math.max(gf, bf));
        var min = Math.min(rf, Math.min(gf, bf));
        var deltaMaxMin = max - min;
        var l = (max + min) / 2.0;
        var h;
        var s;
        if (max == min) {
            h = s = 0.0;
        } else {
            if (max == rf)
                h = ((gf - bf) / deltaMaxMin) % 6;
            else if (max == gf)
                h = (bf - rf) / deltaMaxMin + 2.0;
            else
                h = (rf - gf) / deltaMaxMin + 4;
            s = deltaMaxMin / (1.0 - Math.abs(2.0 * l - 1.0));
        }

        return [
            (h * 60) % 360,
            s,
            l
        ];
    },

    HSLtoRGB: function(hsl) {
        return [102, 51, 102]
    }
};
