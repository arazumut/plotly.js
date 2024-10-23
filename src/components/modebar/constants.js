'use strict';

// ModeBar butonlarını içe aktar
var modCubukButonlari = require('./buttons');
var butonListesi = Object.keys(modCubukButonlari);

// Çizim modları
var CIZIM_MODLARI = [
    'cizgiciz',
    'acikpatikaciz',
    'kapalipatikaciz',
    'daireciz',
    'dikdortgenciz',
    'sekilsil'
];

// Geri butonları
var geriButonlari = [
    'v1hovermodu',
    'enyakinhov',
    'karsilastirhov',
    'hoverdegistir',
    'cizgileridegistir'
].concat(CIZIM_MODLARI);

// Ön butonlar
var onButonlari = [];
var onButonlarinaEkle = function(b) {
    if(geriButonlari.indexOf(b._cat || b.name) !== -1) return;
    // Kolaylık için küçük harf kısa adı ekleyin, örneğin zoomin ve tam adı zoomInGeo
    var isim = b.name;
    var _cat = (b._cat || b.name).toLowerCase();
    if(onButonlari.indexOf(isim) === -1) onButonlari.push(isim);
    if(onButonlari.indexOf(_cat) === -1) onButonlari.push(_cat);
};
butonListesi.forEach(function(k) {
    onButonlarinaEkle(modCubukButonlari[k]);
});
onButonlari.sort();

// Modülleri dışa aktar
module.exports = {
    CIZIM_MODLARI: CIZIM_MODLARI,
    geriButonlari: geriButonlari,
    onButonlari: onButonlari
};
