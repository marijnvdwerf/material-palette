var Color = require('./Color');
var _ = require('underscore');

/**
 * @param {ImageData} imageData
 * @constructor
 */
function ColorHistogram(imageData) {
    var pixels = [];

    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        pixels.push(new Color([data[i], data[i + 1], data[i + 2], data[i + 3]]));
    }

    pixels = pixels.sort(Color.sort());

    this._colorPopulations = _.countBy(pixels, function(color) {
        return color.rgbValue();
    });

    this._colors = _.uniq(pixels, function(color) {
        return color.rgbValue();
    });
}

/**
 * @returns {Color[]}
 */
ColorHistogram.prototype.getColors = function() {
    return this._colors;
};

/**
 * @returns {Object.<Number, Number>}
 */
ColorHistogram.prototype.getColorPopulations = function() {
    return this._colorPopulations;
};

module.exports = ColorHistogram;
