'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var colorscaleDefaults = require('../../components/colorscale/defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlamak için fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, defaultColor, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // U, V ve W vektör bileşenlerini zorla
    var u = koerce('u');
    var v = koerce('v');
    var w = koerce('w');

    // X, Y ve Z koordinatlarını zorla
    var x = koerce('x');
    var y = koerce('y');
    var z = koerce('z');

    // Eğer gerekli veriler yoksa, görünürlüğü false yap ve çık
    if(
        !u || !u.length || !v || !v.length || !w || !w.length ||
        !x || !x.length || !y || !y.length || !z || !z.length
    ) {
        traceOut.visible = false;
        return;
    }

    // Boyut modunu zorla ve boyut referansını ayarla
    var boyutModu = koerce('sizemode');
    koerce('sizeref', boyutModu === 'raw' ? 1 : 0.5);

    // Diğer özellikleri zorla
    koerce('anchor');
    koerce('lighting.ambient');
    koerce('lighting.diffuse');
    koerce('lighting.specular');
    koerce('lighting.roughness');
    koerce('lighting.fresnel');
    koerce('lightposition.x');
    koerce('lightposition.y');
    koerce('lightposition.z');

    // Renk ölçeği varsayılanlarını zorla
    colorscaleDefaults(traceIn, traceOut, layout, koerce, {prefix: '', cLetter: 'c'});

    // Metin ve hover özelliklerini zorla
    koerce('text');
    koerce('hovertext');
    koerce('hovertemplate');
    koerce('uhoverformat');
    koerce('vhoverformat');
    koerce('whoverformat');
    koerce('xhoverformat');
    koerce('yhoverformat');
    koerce('zhoverformat');

    // 1D dönüşümleri devre dışı bırak (şimdilik)
    traceOut._length = null;
};
