var ColorUtils = require('./ColorUtils');
var _ = require('underscore');

function Color(rgba) {
    this.red = rgba[0];
    this.green = rgba[1];
    this.blue = rgba[2];
    this.alpha = rgba[3];
    if (this.alpha === undefined || this.alpha === null) {
        this.alpha = 255;
    }
}

Color.prototype.rgbValue = function() {
    return ((this.alpha << 24) | (this.red << 16) | (this.green << 8) | this.blue) >>> 0;
};

Color.prototype.isBlack = function() {
    return (this.red + this.green + this.blue) / 3 <= 22;
};

Color.prototype.isWhite = function() {
    return (this.red + this.green + this.blue) / 3 >= 237;
};

Color.prototype.isTransparent = function() {
    return this.alpha <= 128;
};

Color.prototype.toString = function() {
    return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + (this.alpha / 255) + ')';
};

Color.prototype.toHex = function() {
    var red = this.red.toString(16);
    var green = this.green.toString(16);
    var blue = this.blue.toString(16);

    if (red.length === 1) {
        red = '0' + red;
    }
    if (green.length === 1) {
        green = '0' + green;
    }
    if (blue.length === 1) {
        blue = '0' + blue;
    }

    return '#' + red + green + blue;
};

Color.prototype.getHsl = function() {
    if (this._hsl === undefined) {
        this._hsl = ColorUtils.RGBtoHSL([this.red, this.green, this.blue]);
    }

    return this._hsl;
};

Color.prototype.isNearRedILine = function() {
    var hsl = this.getHsl();
    return hsl[0] >= 10 && hsl[0] <= 37 && hsl[1] <= 0.82;
};

Color.sort = function(order) {
    if (order === undefined) {
        order = ['red', 'green', 'blue'];
    }

    return function(lft, rgt) {
        var sortProperty = _.find(order, function(property) {
            return (lft[property] !== rgt[property]);
        });

        if (sortProperty === undefined) {
            return 0;
        }

        return lft[sortProperty] - rgt[sortProperty];
    }
};

Color.parseHex = function(hex) {
    var red = hex.substr(1, 2);
    var green = hex.substr(3, 2);
    var blue = hex.substr(5, 2);

    return new Color([parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)]);
};

module.exports = Color;
