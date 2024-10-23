'use strict';

var Lib = require('../../lib');
var layoutAttributes = require('./layout_attributes');

// Hover Mode Varsayılanlarını İşleme Fonksiyonu
module.exports = function hoverModuVarsayilanlariniIsle(layoutIn, layoutOut) {
    function zorla(attr, varsayilan) {
        // Eğer başka bir yerde zaten zorlanmışsa zorlamayı yapma, örneğin kartesyen varsayılanlarda
        if(layoutOut[attr] !== undefined) return layoutOut[attr];

        return Lib.zorla(layoutIn, layoutOut, layoutAttributes, attr, varsayilan);
    }

    zorla('clickmode');
    zorla('hoversubplots');
    return zorla('hovermode');
};
