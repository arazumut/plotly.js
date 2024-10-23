'use strict';

// Gerekli modülleri içe aktarıyoruz
var scales = require('./scales');
var helpers = require('./helpers');

// colorscale bileşenini tanımlıyoruz
module.exports = {
    moduleType: 'component', // Modül tipi: bileşen
    name: 'colorscale', // Bileşen adı: colorscale

    attributes: require('./attributes'), // Özellikler
    layoutAttributes: require('./layout_attributes'), // Düzen özellikleri

    supplyLayoutDefaults: require('./layout_defaults'), // Düzen varsayılanlarını sağla
    handleDefaults: require('./defaults'), // Varsayılanları işle
    crossTraceDefaults: require('./cross_trace_defaults'), // Çapraz iz varsayılanları

    calc: require('./calc'), // Hesaplama fonksiyonu

    // ./scales.js lib/coerce.js içinde gereklidir;
    // Dairesel bağımlılığı önlemek için ayrı bir modül olması gerekir
    scales: scales.scales, // Ölçekler
    defaultScale: scales.defaultScale, // Varsayılan ölçek
    getScale: scales.get, // Ölçeği al
    isValidScale: scales.isValid, // Geçerli ölçek mi?

    hasColorscale: helpers.hasColorscale, // Colorscale var mı?
    extractOpts: helpers.extractOpts, // Seçenekleri çıkar
    extractScale: helpers.extractScale, // Ölçeği çıkar
    flipScale: helpers.flipScale, // Ölçeği ters çevir
    makeColorScaleFunc: helpers.makeColorScaleFunc, // Colorscale fonksiyonu oluştur
    makeColorScaleFuncFromTrace: helpers.makeColorScaleFuncFromTrace // İzden colorscale fonksiyonu oluştur
};
