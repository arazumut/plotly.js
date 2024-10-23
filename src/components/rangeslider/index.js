'use strict';

// Gerekli modülleri içe aktar
var Lib = require('../../lib');
var attrs = require('./attributes');
var oppAxisAttrs = require('./oppaxis_attributes');
var helpers = require('./helpers');

// rangeslider bileşenini dışa aktar
module.exports = {
    moduleType: 'component', // Bileşen türü
    name: 'rangeslider', // Bileşen adı

    // Şema tanımı
    schema: {
        subplots: {
            xaxis: {
                rangeslider: Lib.extendFlat({}, attrs, {
                    yaxis: oppAxisAttrs // Karşıt eksen özellikleri
                })
            }
        }
    },

    // Düzen özellikleri
    layoutAttributes: require('./attributes'),
    // Varsayılan değerleri işleme
    handleDefaults: require('./defaults'),
    // Otomatik aralık hesaplama
    calcAutorange: require('./calc_autorange'),
    // Çizim fonksiyonu
    draw: require('./draw'),
    // Görünürlük kontrolü
    isVisible: helpers.isVisible,
    // Veri oluşturma
    makeData: helpers.makeData,
    // Otomatik kenar boşluğu seçenekleri
    autoMarginOpts: helpers.autoMarginOpts
};
