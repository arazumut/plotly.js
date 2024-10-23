'use strict';

var extendFlat = require('../../lib/extend').extendFlat;

var colorScaleAttrs = require('./attributes');
var scales = require('./scales').scales;

var msg = 'Note that `autocolorscale` must be true for this attribute to work.';

module.exports = {
    editType: 'calc',

    colorscale: {
        editType: 'calc',

        sequential: {
            valType: 'colorscale',
            dflt: scales.Reds,
            editType: 'calc',
            description: [
                'Sets the default sequential colorscale for positive values.',
                msg
            ].join(' ')
        },
        sequentialminus: {
            valType: 'colorscale',
            dflt: scales.Blues,
            editType: 'calc',
            description: [
                'Sets the default sequential colorscale for negative values.',
                msg
            ].join(' ')
        },
        diverging: {
            valType: 'colorscale',
            dflt: scales.RdBu,
            editType: 'calc',
            description: [
                'Sets the default diverging colorscale.',
                msg
            ].join(' ')
        }
    },

    coloraxis: extendFlat({
        _isSubplotObj: true,
        editType: 'calc',
        description: ''
    }, colorScaleAttrs('', {
        colorAttr: 'corresponding trace color array(s)',
        noColorAxis: true,
        showScaleDflt: true
    }))
};
