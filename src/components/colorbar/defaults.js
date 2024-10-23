'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var Template = require('../../plot_api/plot_template');

var handleTickValueDefaults = require('../../plots/cartesian/tick_value_defaults');
var handleTickMarkDefaults = require('../../plots/cartesian/tick_mark_defaults');
var handleTickLabelDefaults = require('../../plots/cartesian/tick_label_defaults');
var handlePrefixSuffixDefaults = require('../../plots/cartesian/prefix_suffix_defaults');

var attributes = require('./attributes');

// colorbarDefaults fonksiyonunu dışa aktar
module.exports = function colorbarVarsayılanlar(containerIn, containerOut, layout) {
    var colorbarOut = Template.newContainer(containerOut, 'colorbar');
    var colorbarIn = containerIn.colorbar || {};

    // Varsayılan değerleri zorla
    function zorla(attr, dflt) {
        return Lib.coerce(colorbarIn, colorbarOut, attributes, attr, dflt);
    }

    var margin = layout.margin || {t: 0, b: 0, l: 0, r: 0};
    var w = layout.width - margin.l - margin.r;
    var h = layout.height - margin.t - margin.b;

    var orientation = zorla('orientation');
    var isVertical = orientation === 'v';

    var thicknessmode = zorla('thicknessmode');
    zorla('thickness', (thicknessmode === 'fraction') ?
        30 / (isVertical ? w : h) :
        30
    );

    var lenmode = zorla('lenmode');
    zorla('len', (lenmode === 'fraction') ?
        1 :
        isVertical ? h : w
    );

    var yref = zorla('yref');
    var xref = zorla('xref');

    var isPaperY = yref === 'paper';
    var isPaperX = xref === 'paper';

    var defaultX, defaultY, defaultYAnchor;
    var defaultXAnchor = 'left';

    if(isVertical) {
        defaultYAnchor = 'middle';
        defaultXAnchor = isPaperX ? 'left' : 'right';
        defaultX = isPaperX ? 1.02 : 1;
        defaultY = 0.5;
    } else {
        defaultYAnchor = isPaperY ? 'bottom' : 'top';
        defaultXAnchor = 'center';
        defaultX = 0.5;
        defaultY = isPaperY ? 1.02 : 1;
    }

    Lib.coerce(colorbarIn, colorbarOut, {
        x: {
            valType: 'number',
            min: isPaperX ? -2 : 0,
            max: isPaperX ? 3 : 1,
            dflt: defaultX,
        }
    }, 'x');

    Lib.coerce(colorbarIn, colorbarOut, {
        y: {
            valType: 'number',
            min: isPaperY ? -2 : 0,
            max: isPaperY ? 3 : 1,
            dflt: defaultY,
        }
    }, 'y');

    zorla('xanchor', defaultXAnchor);
    zorla('xpad');
    zorla('yanchor', defaultYAnchor);
    zorla('ypad');
    Lib.noneOrAll(colorbarIn, colorbarOut, ['x', 'y']);

    zorla('outlinecolor');
    zorla('outlinewidth');
    zorla('bordercolor');
    zorla('borderwidth');
    zorla('bgcolor');

    var ticklabelposition = Lib.coerce(colorbarIn, colorbarOut, {
        ticklabelposition: {
            valType: 'enumerated',
            dflt: 'outside',
            values: isVertical ? [
                'outside', 'inside',
                'outside top', 'inside top',
                'outside bottom', 'inside bottom'
            ] : [
                'outside', 'inside',
                'outside left', 'inside left',
                'outside right', 'inside right'
            ]
        }
    }, 'ticklabelposition');

    zorla('ticklabeloverflow', ticklabelposition.indexOf('inside') !== -1 ? 'hide past domain' : 'hide past div');

    handleTickValueDefaults(colorbarIn, colorbarOut, zorla, 'linear');

    var font = layout.font;
    var opts = {
        noAutotickangles: true,
        noTicklabelshift: true,
        noTicklabelstandoff: true,
        outerTicks: false,
        font: font
    };
    if(ticklabelposition.indexOf('inside') !== -1) {
        opts.bgColor = 'black'; // Bunun yerine ölçek içindeki renklerin ortalamasını kullanabilir miyiz?
    }
    handlePrefixSuffixDefaults(colorbarIn, colorbarOut, zorla, 'linear', opts);
    handleTickLabelDefaults(colorbarIn, colorbarOut, zorla, 'linear', opts);
    handleTickMarkDefaults(colorbarIn, colorbarOut, zorla, 'linear', opts);

    zorla('title.text', layout._dfltTitle.colorbar);

    var tickFont = colorbarOut.showticklabels ? colorbarOut.tickfont : font;

    var dfltTitleFont = Lib.extendFlat({}, font, {
        family: tickFont.family,
        size: Lib.bigFont(tickFont.size)
    });
    Lib.coerceFont(zorla, 'title.font', dfltTitleFont);
    zorla('title.side', isVertical ? 'top' : 'right');
};
