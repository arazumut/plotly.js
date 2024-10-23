'use strict';

// Gerekli modülleri dahil et
var getSubplotCalcData = require('../../plots/get_data').getSubplotCalcData;
var counterRegex = require('../../lib').counterRegex;
var createGeo = require('./geo');

// Değişken tanımlamaları
var GEO = 'geo';
var counter = counterRegex(GEO);

// Özellikler tanımlaması
var ozellikler = {};
ozellikler[GEO] = {
    valType: 'subplotid',
    dflt: GEO,
    editType: 'calc',
    description: [
        'Bu iz\'in coğrafi koordinatları ile',
        'bir coğrafi harita arasında bir referans ayarlar.',
        'Eğer *geo* (varsayılan değer) ise, coğrafi koordinatlar',
        '`layout.geo`ya referans verir.',
        'Eğer *geo2* ise, coğrafi koordinatlar `layout.geo2`ya referans verir,',
        've bu şekilde devam eder.'
    ].join(' ')
};

// Coğrafi harita çizim fonksiyonu
function cizGeo(gd) {
    var tamLayout = gd._fullLayout;
    var hesapData = gd.calcdata;
    var geoIdler = tamLayout._subplots[GEO];

    for(var i = 0; i < geoIdler.length; i++) {
        var geoId = geoIdler[i];
        var geoHesapData = getSubplotCalcData(hesapData, GEO, geoId);
        var geoLayout = tamLayout[geoId];
        var geo = geoLayout._subplot;

        if(!geo) {
            geo = createGeo({
                id: geoId,
                graphDiv: gd,
                container: tamLayout._geolayer.node(),
                topojsonURL: gd._context.topojsonURL,
                staticPlot: gd._context.staticPlot
            });

            tamLayout[geoId]._subplot = geo;
        }

        geo.plot(geoHesapData, tamLayout, gd._promises);
    }
}

// Temizlik fonksiyonu
function temizle(yeniTamData, yeniTamLayout, eskiTamData, eskiTamLayout) {
    var eskiGeoAnahtarlar = eskiTamLayout._subplots[GEO] || [];

    for(var i = 0; i < eskiGeoAnahtarlar.length; i++) {
        var eskiGeoAnahtar = eskiGeoAnahtarlar[i];
        var eskiGeo = eskiTamLayout[eskiGeoAnahtar]._subplot;

        if(!yeniTamLayout[eskiGeoAnahtar] && !!eskiGeo) {
            eskiGeo.framework.remove();
            eskiGeo.clipDef.remove();
        }
    }
}

// Etkileşim güncelleme fonksiyonu
function fxGuncelle(gd) {
    var tamLayout = gd._fullLayout;
    var subplotIdler = tamLayout._subplots[GEO];

    for(var i = 0; i < subplotIdler.length; i++) {
        var subplotLayout = tamLayout[subplotIdler[i]];
        var subplotObj = subplotLayout._subplot;
        subplotObj.updateFx(tamLayout, subplotLayout);
    }
}

// Modülü dışa aktar
module.exports = {
    attr: GEO,
    name: GEO,
    idRoot: GEO,
    idRegex: counter,
    attrRegex: counter,
    ozellikler: ozellikler,
    layoutAttributes: require('./layout_attributes'),
    supplyLayoutDefaults: require('./layout_defaults'),
    plot: cizGeo,
    updateFx: fxGuncelle,
    clean: temizle
};
