var Color = require('./Color');
var PaletteItem = require('./PaletteItem');

/**
 * @param {ColorCutQuantizer} parent
 * @param lowerIndex
 * @param upperIndex
 * @constructor
 */
ColorCutQuantizerVbox = function(parent, lowerIndex, upperIndex) {
    this._parent = parent;
    this._lowerIndex = lowerIndex;
    this._upperIndex = upperIndex;
    this.fitBox();
};

ColorCutQuantizerVbox.prototype.getVolume = function() {
    return ((this._maxRed - this._minRed) + 1) * ((this._maxGreen - this._minGreen) + 1) * ((this._maxBlue - this._minBlue) + 1);
};

ColorCutQuantizerVbox.prototype.canSplit = function() {
    return this.getColorCount() > 1;
};

ColorCutQuantizerVbox.prototype.getColorCount = function() {
    return this._upperIndex - this._lowerIndex;
};

ColorCutQuantizerVbox.prototype.fitBox = function() {
    this._minRed = this._minGreen = this._minBlue = 255;
    this._maxRed = this._maxGreen = this._maxBlue = 0;

    for (var i = this._lowerIndex; i <= this._upperIndex; i++) {
        var color = this._parent._colors[i];
        var r = color.red;
        var g = color.green;
        var b = color.blue;
        if (r > this._maxRed) {
            this._maxRed = r;
        }
        if (r < this._minRed) {
            this._minRed = r;
        }
        if (g > this._maxGreen) {
            this._maxGreen = g;
        }
        if (g < this._minGreen) {
            this._minGreen = g;
        }
        if (b > this._maxBlue) {
            this._maxBlue = b;
        }
        if (b < this._minBlue) {
            this._minBlue = b;
        }
    }
};

ColorCutQuantizerVbox.prototype.splitBox = function() {
    if (!this.canSplit()) {
        throw new Error("Can not split a box with only 1 color");
    }

    var splitPoint = this.findSplitPoint();
    var newBox = new ColorCutQuantizerVbox(this._parent, splitPoint + 1, this._upperIndex);
    this._upperIndex = splitPoint;
    this.fitBox();
    return newBox;
};

ColorCutQuantizerVbox.prototype.getLongestColorDimension = function() {
    var redLength = this._maxRed - this._minRed;
    var greenLength = this._maxGreen - this._minGreen;
    var blueLength = this._maxBlue - this._minBlue;

    if (redLength >= greenLength && redLength >= blueLength) {
        return -3;
    }

    return greenLength < redLength || greenLength < blueLength ? -1 : -2;
};

ColorCutQuantizerVbox.prototype.findSplitPoint = function() {
    var longestDimension = this.getLongestColorDimension();
    var sortOrder = ['red', 'green', 'blue'];
    if (longestDimension === -2) {
        sortOrder = ['green', 'red', 'blue'];
    } else if (longestDimension === -1) {
        sortOrder = ['blue', 'green', 'red'];
    }
    var beforeRange = this._parent._colors.slice(0, this._lowerIndex);
    var rangeColors = this._parent._colors.slice(this._lowerIndex, this._upperIndex + 1);
    rangeColors = rangeColors.sort(Color.sort(sortOrder));
    var afterRange = this._parent._colors.slice(this._upperIndex + 1);
    this._parent._colors = beforeRange.concat(rangeColors, afterRange);

    var dimensionMidpoint = this.midPoint(longestDimension);
    for (var i = this._lowerIndex; i < this._upperIndex; i++) {
        var color = this._parent._colors[i];
        switch (longestDimension) {
            default:
                break;

            case -3:
                if (color.red >= dimensionMidpoint) {
                    return i;
                }
                break;

            case -2:
                if (color.green >= dimensionMidpoint) {
                    return i;
                }
                break;

            case -1:
                if (color.blue >= dimensionMidpoint) {
                    return i;
                }
                break;
        }
    }

    return this._lowerIndex;
};

ColorCutQuantizerVbox.prototype.getAverageColor = function() {
    var redSum = 0;
    var greenSum = 0;
    var blueSum = 0;
    var totalPopulation = 0;
    for (var i = this._lowerIndex; i <= this._upperIndex; i++) {
        var color = this._parent._colors[i];
        var colorPopulation = this._parent._colorPopulations[color.rgbValue()];
        totalPopulation += colorPopulation;
        redSum += colorPopulation * color.red;
        greenSum += colorPopulation * color.green;
        blueSum += colorPopulation * color.blue;
    }

    var redAverage = Math.round(redSum / totalPopulation);
    var greenAverage = Math.round(greenSum / totalPopulation);
    var blueAverage = Math.round(blueSum / totalPopulation);

    return new PaletteItem(new Color([redAverage, greenAverage, blueAverage]), totalPopulation);
};

ColorCutQuantizerVbox.prototype.midPoint = function(dimension) {
    switch (dimension) {
        case -3:
        default:
            return (this._minRed + this._maxRed) / 2;

        case -2:
            return (this._minGreen + this._maxGreen) / 2;

        case -1:
            return (this._minBlue + this._maxBlue) / 2;
    }
};

module.exports = ColorCutQuantizerVbox;
