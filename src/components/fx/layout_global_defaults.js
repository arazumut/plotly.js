'use strict'; // 'use strict' modu, daha sıkı bir JavaScript yazım kuralı sağlar

var Lib = require('../../lib'); // Gerekli kütüphaneleri dahil et
var handleHoverLabelDefaults = require('./hoverlabel_defaults'); // Hover label varsayılanlarını işleyen modülü dahil et
var layoutAttributes = require('./layout_attributes'); // Layout (düzen) özelliklerini içeren modülü dahil et

// Layout (düzen) için global varsayılanları sağlayan fonksiyonu dışa aktar
module.exports = function supplyLayoutGlobalDefaults(layoutIn, layoutOut) {
    // 'coerce' fonksiyonu, belirli bir özelliği zorunlu kılar ve varsayılan değer atar
    function coerce(attr, dflt) {
        return Lib.coerce(layoutIn, layoutOut, layoutAttributes, attr, dflt);
    }

    // Hover label varsayılanlarını işleyen fonksiyonu çağır
    handleHoverLabelDefaults(layoutIn, layoutOut, coerce);
};
