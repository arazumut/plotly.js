'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var colorscaleDefaults = require('../../components/colorscale/defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlayan fonksiyon
module.exports = function supplyDefaults(traceIn, traceOut, defaultColor, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function coerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // 'locations' ve 'z' özelliklerini zorla
    var locations = coerce('locations');
    var z = coerce('z');

    // Eğer 'locations' ve 'z' geçerli değilse, görünürlüğü false yap ve çık
    if(!(locations && locations.length && Lib.isArrayOrTypedArray(z) && z.length)) {
        traceOut.visible = false;
        return;
    }

    // Uzunluğu belirle
    traceOut._length = Math.min(locations.length, z.length);

    // 'geojson' özelliğini zorla
    var geojson = coerce('geojson');

    // 'locationmode' için varsayılan değeri belirle
    var locationmodeDflt;
    if((typeof geojson === 'string' && geojson !== '') || Lib.isPlainObject(geojson)) {
        locationmodeDflt = 'geojson-id';
    }

    // 'locationmode' özelliğini zorla
    var locationMode = coerce('locationmode', locationmodeDflt);

    // Eğer 'locationmode' 'geojson-id' ise, 'featureidkey' özelliğini zorla
    if(locationMode === 'geojson-id') {
        coerce('featureidkey');
    }

    // Diğer özellikleri zorla
    coerce('text');
    coerce('hovertext');
    coerce('hovertemplate');

    // 'marker.line.width' ve 'marker.line.color' özelliklerini zorla
    var mlw = coerce('marker.line.width');
    if(mlw) coerce('marker.line.color');
    coerce('marker.opacity');

    // Renk ölçeği varsayılanlarını uygula
    colorscaleDefaults(traceIn, traceOut, layout, coerce, {prefix: '', cLetter: 'z'});

    // Seçim işaretleyici opaklığını zorla
    Lib.coerceSelectionMarkerOpacity(traceOut, coerce);
};
