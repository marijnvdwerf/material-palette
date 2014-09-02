var assert = require('chai').assert;
var ColorUtils = require('../lib/ColorUtils');

function assertRGBEqualsHSL(rgb, hsl) {
    var actualHsl = ColorUtils.RGBtoHSL(rgb);
    assert.closeTo(actualHsl[0], hsl[0], 0.01);
    assert.closeTo(actualHsl[1], hsl[1], 0.01);
    assert.closeTo(actualHsl[2], hsl[2], 0.01);
}

describe('ColorUtils', function() {
    it('should convert rgb to hsl', function() {
        assertRGBEqualsHSL([224, 60, 70], [356, 0.7256638, 0.5568628]);
        assertRGBEqualsHSL([218, 219, 208], [65, 0.1325301, 0.8372549]);
    });
});
