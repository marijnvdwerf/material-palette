var assert = require('chai').assert;
var Palette = require('../lib/Palette');
var PaletteItem = require('../lib/PaletteItem');
var Color = require('../lib/Color');

function assertAccentColors(actual, expected) {
    assert.equalColor(actual.vibrant, expected.vibrant);
    assert.equalColor(actual.lightVibrant, expected.lightVibrant);
    assert.equalColor(actual.darkVibrant, expected.darkVibrant);
    assert.equalColor(actual.muted, expected.muted);
    assert.equalColor(actual.lightMuted, expected.lightMuted);
    assert.equalColor(actual.darkMuted, expected.darkMuted);
}

assert.equalColor = function(actual, expected) {
    if (expected === null || expected === undefined) {
        assert.isNull(actual);
        return;
    }

    assert.isNotNull(actual.vibrant);
    assert.equal(actual.toHex().toUpperCase(), expected.toUpperCase());
};

describe('Palette', function() {
    it('should pick the right accent colors from a list', function() {
        var colors = [
            new PaletteItem(Color.parseHex('#6c9b80'), 227),
            new PaletteItem(Color.parseHex('#98986b'), 153),
            new PaletteItem(Color.parseHex('#18391f'), 6830),
            new PaletteItem(Color.parseHex('#dbe0b0'), 108),
            new PaletteItem(Color.parseHex('#a4b07d'), 100),
            new PaletteItem(Color.parseHex('#607e3e'), 197),
            new PaletteItem(Color.parseHex('#485e29'), 183),
            new PaletteItem(Color.parseHex('#c0b777'), 69),
            new PaletteItem(Color.parseHex('#1e5638'), 811),
            new PaletteItem(Color.parseHex('#a5bcad'), 78),
            new PaletteItem(Color.parseHex('#d8eddb'), 155),
            new PaletteItem(Color.parseHex('#1b7547'), 18),
            new PaletteItem(Color.parseHex('#4a6544'), 270),
            new PaletteItem(Color.parseHex('#add9be'), 36),
            new PaletteItem(Color.parseHex('#dbd88a'), 80),
            new PaletteItem(Color.parseHex('#368365'), 10)
        ];

        var palette = new Palette(colors);
        var accentColors = palette.getAccentColors();
        assertAccentColors(
            accentColors,
            {
                vibrant: '#c0b777',
                lightVibrant: '#dbd88a',
                darkVibrant: '#1b7547',
                muted: '#98986b',
                lightMuted: '#add9be',
                darkMuted: '#485e29'
            }
        );
    });

    it('should pick the right accent colors from a list', function() {
        var colors = [
            new PaletteItem(Color.parseHex('#F63978'), 1764),
            new PaletteItem(Color.parseHex('#FFF500'), 4636),
        ];

        var palette = new Palette(colors);
        var accentColors = palette.getAccentColors();
        assertAccentColors(
            accentColors,
            {
                vibrant: '#FFF500',
                lightVibrant: '#F63978'
            }
        );
    });
});
