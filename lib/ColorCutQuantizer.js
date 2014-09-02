var ColorHistogram = require('./ColorHistogram');
var PaletteItem = require('./PaletteItem');
var ColorCutQuantizerVbox = require('./ColorCutQuantizer.Vbox');
var PriorityQueue = require('./PriorityQueue');

function ColorCutQuantizer(imageData, maxColors) {
    var colorHist = new ColorHistogram(imageData);

    var rawColors = colorHist.getColors();
    this._colorPopulations = colorHist.getColorPopulations();

    /** @type {Color[]} */
    this._colors = [];
    for (var i = 0; i < rawColors.length; i++) {
        var color = rawColors[i];
        if (this._shouldIgnoreColor(color)) {
            continue;
        }

        this._colors.push(color);
    }

    if (this._colors.length <= maxColors) {
        this._quantizedColors = [];
        for (var i = 0; i < this._colors.length; i++) {
            var color = this._colors[i];
            this._quantizedColors.push(new PaletteItem(color, this._colorPopulations[color.rgbValue()]));
        }
    } else {
        this._quantizedColors = this._quantizePixels(this._colors.length - 1, maxColors);
    }
}

/**
 * @returns {PaletteItem[]}
 */
ColorCutQuantizer.prototype.getQuantizedColors = function() {
    return this._quantizedColors;
};

ColorCutQuantizer.prototype._quantizePixels = function(maxColorIndex, maxColors) {
    var pq = new PriorityQueue({
        comparator: function(lhs, rhs) {
            return rhs.getVolume() - lhs.getVolume();
        }
    });

    pq.offer(new ColorCutQuantizerVbox(this, 0, maxColorIndex));
    this._splitBoxes(pq, maxColors);
    return this._generateAverageColors(pq);
};

/**
 * @param {PriorityQueue} queue
 * @param {Number} maxSize
 * @private
 */
ColorCutQuantizer.prototype._splitBoxes = function(queue, maxSize) {
    while (queue.size() < maxSize) {
        var vbox = queue.poll();
        if (vbox !== null && vbox.canSplit()) {
            queue.offer(vbox.splitBox());
            queue.offer(vbox);
        } else {
            return;
        }
    }
};

/**
 * @param {PriorityQueue} vboxQueue
 * @private
 */
ColorCutQuantizer.prototype._generateAverageColors = function(vboxQueue) {
    var colors = [];
    while (vboxQueue.size() > 0) {
        var vbox = vboxQueue.poll();
        var color = vbox.getAverageColor();
        if (!this._shouldIgnoreColor(color)) {
            colors.push(color);
        }
    }
    return colors;
};

/**
 * @param {Color} color
 * @return {Boolean}
 * @private
 */
ColorCutQuantizer.prototype._shouldIgnoreColor = function(color) {
    return color.isWhite() || color.isBlack() || color.isTransparent() || color.isNearRedILine();
};

module.exports = ColorCutQuantizer;
