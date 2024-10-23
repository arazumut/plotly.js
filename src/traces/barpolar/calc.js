'use strict';

var renkSkalasıVarMı = require('../../components/colorscale/helpers').hasColorscale;
var renkSkalasıHesapla = require('../../components/colorscale/calc');
var diziVeyaTipliDiziMi = require('../../lib').isArrayOrTypedArray;
var dizileriHesapVerisineDönüştür = require('../bar/arrays_to_calcdata');
var grupPozisyonlarınıAyarla = require('../bar/cross_trace_calc').setGroupPositions;
var seçimHesapla = require('../scatter/calc_selection');
var izMi = require('../../registry').traceIs;
var düzVeGenişlet = require('../../lib').extendFlat;

function hesapla(gd, iz) {
    var tamYerleşim = gd._fullLayout;
    var altGrafikId = iz.subplot;
    var radyalEksen = tamYerleşim[altGrafikId].radialaxis;
    var açısalEksen = tamYerleşim[altGrafikId].angularaxis;
    var rDizisi = radyalEksen.makeCalcdata(iz, 'r');
    var thetaDizisi = açısalEksen.makeCalcdata(iz, 'theta');
    var uzunluk = iz._length;
    var hesapVerisi = new Array(uzunluk);

    // 'boyut' ekseni değişkenleri
    var sDizisi = rDizisi;
    // 'pozisyon' ekseni değişkenleri
    var pDizisi = thetaDizisi;

    for(var i = 0; i < uzunluk; i++) {
        hesapVerisi[i] = {p: pDizisi[i], s: sDizisi[i]};
    }

    // genişlik ve ofseti 'c' koordinatında dönüştür,
    // 'c' değer(ler)ini iz._width ve iz._offset içine ayarla,
    // Bar.crossTraceCalc'in "sadece çalışması" için
    function d2c(attr) {
        var değer = iz[attr];
        if(değer !== undefined) {
            iz['_' + attr] = diziVeyaTipliDiziMi(değer) ?
                açısalEksen.makeCalcdata(iz, attr) :
                açısalEksen.d2c(değer, iz.thetaunit);
        }
    }

    if(açısalEksen.type === 'linear') {
        d2c('width');
        d2c('offset');
    }

    if(renkSkalasıVarMı(iz, 'marker')) {
        renkSkalasıHesapla(gd, iz, {
            vals: iz.marker.color,
            containerStr: 'marker',
            cLetter: 'c'
        });
    }
    if(renkSkalasıVarMı(iz, 'marker.line')) {
        renkSkalasıHesapla(gd, iz, {
            vals: iz.marker.line.color,
            containerStr: 'marker.line',
            cLetter: 'c'
        });
    }

    dizileriHesapVerisineDönüştür(hesapVerisi, iz);
    seçimHesapla(hesapVerisi, iz);

    return hesapVerisi;
}

function çaprazİzHesapla(gd, polarYerleşim, altGrafikId) {
    var hesapVerisi = gd.calcdata;
    var barPolarHesapVerisi = [];

    for(var i = 0; i < hesapVerisi.length; i++) {
        var cdi = hesapVerisi[i];
        var iz = cdi[0].trace;

        if(iz.visible === true && izMi(iz, 'bar') &&
            iz.subplot === altGrafikId
        ) {
            barPolarHesapVerisi.push(cdi);
        }
    }

    // _extremes'in doğru şekilde doldurulması için
    // polar._subplot.radialAxis'in otomatik aralığa sahip olabilmesi için
    // TODO temizle!
    // Sanırım polar.radialaxis üzerinde getAutorange çağırmak istiyoruz
    // polar._subplot.radialAxis üzerinde değil
    var rEksen = düzVeGenişlet({}, polarYerleşim.radialaxis, {_id: 'x'});
    var aEksen = polarYerleşim.angularaxis;

    grupPozisyonlarınıAyarla(gd, aEksen, rEksen, barPolarHesapVerisi, {
        mode: polarYerleşim.barmode,
        norm: polarYerleşim.barnorm,
        gap: polarYerleşim.bargap,
        groupgap: polarYerleşim.bargroupgap
    });
}

module.exports = {
    hesapla: hesapla,
    çaprazİzHesapla: çaprazİzHesapla
};
