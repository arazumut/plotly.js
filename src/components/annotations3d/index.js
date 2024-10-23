'use strict';

// Gerekli modülleri dahil et
var Kayıt = require('../../registry');
var Kütüphane = require('../../lib');

module.exports = {
    moduleType: 'component', // Modül tipi: bileşen
    name: 'annotations3d', // Modül adı: annotations3d

    schema: {
        subplots: {
            scene: {annotations: require('./attributes')} // Alt grafikler: sahne, annotations (açıklamalar)
        }
    },

    layoutAttributes: require('./attributes'), // Düzen öznitelikleri
    handleDefaults: require('./defaults'), // Varsayılanları işleme
    includeBasePlot: includeGL3D, // Temel grafiği dahil et

    convert: require('./convert'), // Dönüştürme
    draw: require('./draw') // Çizim
};

// GL3D'yi dahil etme fonksiyonu
function includeGL3D(layoutIn, layoutOut) {
    var GL3D = Kayıt.subplotsRegistry.gl3d;
    if(!GL3D) return;

    var attrRegex = GL3D.attrRegex;

    var anahtarlar = Object.keys(layoutIn);
    for(var i = 0; i < anahtarlar.length; i++) {
        var k = anahtarlar[i];
        if(attrRegex.test(k) && (layoutIn[k].annotations || []).length) {
            Kütüphane.pushUnique(layoutOut._basePlotModules, GL3D);
            Kütüphane.pushUnique(layoutOut._subplots.gl3d, k);
        }
    }
}
