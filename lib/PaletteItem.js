function PaletteItem(color, population) {
    this._color = color;
    this._population = population;
}

PaletteItem.prototype.getPopulation = function() {
    return this._population;
};

PaletteItem.prototype.getHsl = function() {
    return this._color.getHsl();
};

PaletteItem.prototype.isBlack = function() {
    return this._color.isBlack();
};

PaletteItem.prototype.isWhite = function() {
    return this._color.isWhite();
};

PaletteItem.prototype.isTransparent = function() {
    return this._color.isTransparent();
};

PaletteItem.prototype.toHex = function() {
    return this._color.toHex();
};

PaletteItem.prototype.isNearRedILine = function() {
    return this._color.isNearRedILine();
};


PaletteItem.prototype._getPopulation = function() {
    return this._population;
};

PaletteItem.prototype.toString = function() {
    return this._color.toString();
};

module.exports = PaletteItem;
