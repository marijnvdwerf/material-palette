var ColorCutQuantizer = require('./ColorCutQuantizer');
var Color = require('./Color');
var ColorUtils = require('./ColorUtils');
var PaletteItem = require('./PaletteItem');
var Promise = require('promise');
var _ = require('underscore');

/**
 * @param {PaletteItem[]} palette
 * @constructor
 */
function Palette(palette) {
    this._palette = palette;
    this._colors = {};
    this._colors.vibrant = this._findColor(0.5, 0.3, 0.7, 1.0, 0.35, 1.0);
    this._colors.lightVibrant = this._findColor(0.74, 0.55, 1.0, 1.0, 0.35, 1.0);
    this._colors.darkVibrant = this._findColor(0.26, 0.0, 0.45, 1.0, 0.35, 1.0);
    this._colors.muted = this._findColor(0.5, 0.3, 0.7, 0.3, 0.0, 0.4);
    this._colors.lightMuted = this._findColor(0.74, 0.55, 1.0, 0.3, 0.0, 0.4);
    this._colors.darkMuted = this._findColor(0.26, 0.0, 0.45, 0.3, 0.0, 0.4);
    this._generateEmptyColors();
}

Palette.prototype.getVibrantColor = function() {
    return this._colors.vibrant;
};

Palette.prototype.getAccentColors = function() {
    return this._colors;
};

Palette.prototype.getColors = function() {
    return this._palette;
};

/**
 * @param targetLuma
 * @param minLuma
 * @param maxLuma
 * @param targetSaturation
 * @param minSaturation
 * @param maxSaturation
 * @return {PaletteItem}
 */
Palette.prototype._findColor = function(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
    var max = null;
    var maxValue = 0.0;

    for (var i = 0; i < this._palette.length; i++) {
        var paletteItem = this._palette[i];
        var sat = paletteItem.getHsl()[1];
        var luma = paletteItem.getHsl()[2];

        if (sat >= minSaturation && sat <= maxSaturation && luma >= minLuma && luma <= maxLuma && !this._isAlreadySelected(paletteItem)) {
            var thisValue = this._createComparisonValue(sat, targetSaturation, luma, targetLuma, paletteItem._getPopulation(), this._getMaxPopulation());
            if (max === null || thisValue > maxValue) {
                max = paletteItem;
                maxValue = thisValue;
            }
        }
    }

    return max;
};

Palette.prototype._generateEmptyColors = function() {
    var hsl;

    if (this._colors.vibrant === null && this._colors.darkVibrant !== null) {
        hsl = this._colors.darkVibrant.getHsl();
        hsl[2] = 0.5;
        this._colors.vibrant = new PaletteItem(new Color(ColorUtils.HSLtoRGB(hsl)), 0);
    }

    if (this._colors.darkVibrant === null && this._colors.vibrant !== null) {
        hsl = this._colors.vibrant.getHsl();
        hsl[2] = 0.26;
        this._colors.darkVibrant = new PaletteItem(new Color(ColorUtils.HSLtoRGB(hsl)), 0);
    }
};

Palette.prototype._isAlreadySelected = function(item) {
    return _.contains(this._colors, item);
};

Palette.prototype._createComparisonValue = function(saturation, targetSatuation, luma, targetLuma, population, highestPopulation) {
    return this._weightedMean([
        [3, this._invertDiff(saturation, targetSatuation)],
        [6.5, this._invertDiff(luma, targetLuma)],
        [0.5, population / highestPopulation]
    ]);
};

Palette.prototype._invertDiff = function(value, targetValue) {
    return 1.0 - Math.abs(value - targetValue);
};

Palette.prototype._weightedMean = function(values) {
    var sum = _.reduce(values, function(memo, value) {
        return memo + value[0] * value[1]
    }, 0);
    var sumWeight = _.reduce(values, function(memo, value) {
        return memo + value[0]
    }, 0);

    return sum / sumWeight;
};

Palette.prototype._getMaxPopulation = function() {
    if (this._maxPopulation === undefined) {
        var population = 0;
        for (var i = 0; i < this._palette.length; i++) {
            var item = this._palette[i];
            population = Math.max(population, item._getPopulation());
        }
        this._maxPopulation = population;
    }

    return this._maxPopulation;
};


Palette.generate = function(image) {
    var self = this;

    return new Promise(function(fullfill, reject) {
        self._getScaledImageData(image)
            .done(function(imageData) {
                var quantizer = new ColorCutQuantizer(imageData, 16);
                fullfill(new Palette(quantizer.getQuantizedColors()))
            },
            function(error) {
                reject(error)
            });
    });
};

Palette._getScaledImageData = function(image) {
    var self = this;

    return new Promise(function(fullfill, reject) {
        if (image[0].naturalWidth !== 0) {
            fullfill(self._scaleImage(image[0]));
        }
        image
            .on('load', function(a, b, c) {
                fullfill(self._scaleImage(image[0]));
            })
            .on('error', function(a, b, c) {
                console.error(this, a, b, c);
            });
    });
};

/**
 * @param {HTMLImageElement} image
 * @returns {ImageData}
 * @private
 */
Palette._scaleImage = function(image) {
    var minDimension = Math.min(image.naturalWidth, image.naturalHeight);
    if (minDimension <= 100) {
        return this._getImageData(image, image.naturalWidth, image.naturalHeight);
    } else {
        var scaleRatio = 100 / minDimension;
        return this._getImageData(image, Math.round(image.naturalWidth * scaleRatio), Math.round(image.naturalHeight * scaleRatio));
    }
};

/**
 * @param {HTMLImageElement} image
 * @param {Number} width
 * @param {Number} height
 * @returns {ImageData}
 * @private
 */
Palette._getImageData = function(image, width, height) {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, width, height);

    return ctx.getImageData(0, 0, width, height);
};

module.exports = Palette;
