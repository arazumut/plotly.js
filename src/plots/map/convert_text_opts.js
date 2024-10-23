'use strict';

var Lib = require('../../lib');

/**
 * plotly.js 'textposition' değerini map-gl 'anchor' ve 'offset' değerlerine dönüştür.
 * (ikon boyutu yardımıyla).
 *
 * @param {string} textposition : plotly.js textposition değeri
 * @param {number} iconSize : plotly.js ikon boyutu (örneğin, izler için marker.size)
 *
 * @return {object}
 *      - anchor
 *      - offset
 */
module.exports = function metinSeçenekleriniDönüştür(textposition, iconSize) {
    var parçalar = textposition.split(' ');
    var dikeyPozisyon = parçalar[0];
    var yatayPozisyon = parçalar[1];

    // yaklaşık değerler
    var faktör = Lib.isArrayOrTypedArray(iconSize) ? Lib.mean(iconSize) : iconSize;
    var xArtış = 0.5 + (faktör / 100);
    var yArtış = 1.5 + (faktör / 100);

    var anchorDeğerleri = ['', ''];
    var offset = [0, 0];

    switch(dikeyPozisyon) {
        case 'top':
            anchorDeğerleri[0] = 'top';
            offset[1] = -yArtış;
            break;
        case 'bottom':
            anchorDeğerleri[0] = 'bottom';
            offset[1] = yArtış;
            break;
    }

    switch(yatayPozisyon) {
        case 'left':
            anchorDeğerleri[1] = 'right';
            offset[0] = -xArtış;
            break;
        case 'right':
            anchorDeğerleri[1] = 'left';
            offset[0] = xArtış;
            break;
    }

    // Harita metin-çapası şu değerlerden biri olmalıdır:
    //  center, left, right, top, bottom,
    //  top-left, top-right, bottom-left, bottom-right

    var anchor;
    if(anchorDeğerleri[0] && anchorDeğerleri[1]) anchor = anchorDeğerleri.join('-');
    else if(anchorDeğerleri[0]) anchor = anchorDeğerleri[0];
    else if(anchorDeğerleri[1]) anchor = anchorDeğerleri[1];
    else anchor = 'center';

    return { anchor: anchor, offset: offset };
};
