'use strict';

var Lib = require('../../lib');
var layoutAttributes = require('./layout_attributes');
var handleHoverModeDefaults = require('./hovermode_defaults');
var handleHoverLabelDefaults = require('./hoverlabel_defaults');

module.exports = function düzenYerleşimVarsayılanları(layoutGirdi, layoutÇıktı) {
    function zorla(attr, varsayılan) {
        return Lib.zorla(layoutGirdi, layoutÇıktı, layoutAttributes, attr, varsayılan);
    }

    var hoverModu = handleHoverModeDefaults(layoutGirdi, layoutÇıktı);
    if(hoverModu) {
        zorla('hoverdistance');
        zorla('spikedistance');
    }

    var sürüklemeModu = zorla('dragmode');
    if(sürüklemeModu === 'select') zorla('selectdirection');

    // sadece mapbox, harita veya geo alt grafikler grafikte mevcutsa,
    // 'zoom' sürükleme modunu 'pan' olarak sıfırla, 'zoom' uygulanana kadar,
    // böylece doğru mod çubuğu düğmesi aktif olur
    var mapboxVarMı = layoutÇıktı._has('mapbox');
    var haritaVarMı = layoutÇıktı._has('map');
    var geoVarMı = layoutÇıktı._has('geo');
    var uzunluk = layoutÇıktı._basePlotModules.length;

    if(layoutÇıktı.dragmode === 'zoom' && (
        ((mapboxVarMı || haritaVarMı || geoVarMı) && uzunluk === 1) ||
        ((mapboxVarMı || haritaVarMı) && geoVarMı && uzunluk === 2)
    )) {
        layoutÇıktı.dragmode = 'pan';
    }

    handleHoverLabelDefaults(layoutGirdi, layoutÇıktı, zorla);

    Lib.zorlaFont(zorla, 'hoverlabel.grouptitlefont', layoutÇıktı.hoverlabel.font);
};
