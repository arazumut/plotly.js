'use strict';

// Gerekli kütüphaneleri ve modülleri dahil et
var Lib = require('../../lib');
var colorscaleDefaults = require('../../components/colorscale/defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlayan fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Gerekli özellikleri koerce et
    var konumlar = koerce('locations');
    var z = koerce('z');
    var geojson = koerce('geojson');

    // Eğer konumlar veya z dizileri geçerli değilse veya geojson geçerli bir string ya da nesne değilse, görünürlüğü false yap ve çık
    if(!Lib.isArrayOrTypedArray(konumlar) || !konumlar.length ||
        !Lib.isArrayOrTypedArray(z) || !z.length ||
        !((typeof geojson === 'string' && geojson !== '') || Lib.isPlainObject(geojson))
    ) {
        traceOut.visible = false;
        return;
    }

    // Diğer özellikleri koerce et
    koerce('featureidkey');

    // Trace uzunluğunu belirle
    traceOut._length = Math.min(konumlar.length, z.length);

    koerce('below');

    koerce('text');
    koerce('hovertext');
    koerce('hovertemplate');

    // Marker çizgi genişliğini koerce et ve varsa rengini de koerce et
    var mlw = koerce('marker.line.width');
    if(mlw) koerce('marker.line.color');
    koerce('marker.opacity');

    // Renk skalası varsayılanlarını uygula
    colorscaleDefaults(traceIn, traceOut, layout, koerce, {prefix: '', cLetter: 'z'});

    // Seçim marker opaklığını koerce et
    Lib.coerceSelectionMarkerOpacity(traceOut, koerce);
};
