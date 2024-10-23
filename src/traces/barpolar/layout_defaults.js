'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var attrs = require('./layout_attributes');

// Modülü dışa aktar
module.exports = function(layoutIn, layoutOut, fullData) {
    var işlenmişAltGrafikler = {};
    var altGrafik;

    // Koerce fonksiyonu, varsayılan değerleri ayarlamak için kullanılır
    function koerce(etk, varsayılan) {
        return Lib.coerce(layoutIn[altGrafik] || {}, layoutOut[altGrafik], attrs, etk, varsayılan);
    }

    // Tüm veriler üzerinde döngü
    for(var i = 0; i < fullData.length; i++) {
        var iz = fullData[i];
        if(iz.type === 'barpolar' && iz.visible === true) {
            altGrafik = iz.subplot;
            if(!işlenmişAltGrafikler[altGrafik]) {
                koerce('barmode');
                koerce('bargap');
                işlenmişAltGrafikler[altGrafik] = 1;
            }
        }
    }
};
