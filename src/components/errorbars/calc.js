'use strict';

var isNumeric = require('fast-isnumeric');

var Registry = require('../../registry');
var Axes = require('../../plots/cartesian/axes');
var Lib = require('../../lib');

var makeComputeError = require('./compute_error');

module.exports = function hesapla(gd) {
    var hesaplamaVerisi = gd.calcdata;

    for(var i = 0; i < hesaplamaVerisi.length; i++) {
        var hesaplamaIz = hesaplamaVerisi[i];
        var iz = hesaplamaIz[0].trace;

        if(iz.visible === true && Registry.traceIs(iz, 'errorBarsOK')) {
            var xa = Axes.getFromId(gd, iz.xaxis);
            var ya = Axes.getFromId(gd, iz.yaxis);
            birEksenHesapla(hesaplamaIz, iz, xa, 'x');
            birEksenHesapla(hesaplamaIz, iz, ya, 'y');
        }
    }
};

function birEksenHesapla(hesaplamaIz, iz, eksen, koordinat) {
    var secenekler = iz['error_' + koordinat] || {};
    var gorunur = (secenekler.visible && ['linear', 'log'].indexOf(eksen.type) !== -1);
    var degerler = [];

    if(!gorunur) return;

    var hataHesapla = makeComputeError(secenekler);

    for(var i = 0; i < hesaplamaIz.length; i++) {
        var hesaplamaNokta = hesaplamaIz[i];

        var iIn = hesaplamaNokta.i;

        if(iIn === undefined) iIn = i;

        else if(iIn === null) continue;

        var hesaplamaKoordinat = hesaplamaNokta[koordinat];

        if(!isNumeric(eksen.c2l(hesaplamaKoordinat))) continue;

        var hatalar = hataHesapla(hesaplamaKoordinat, iIn);
        if(isNumeric(hatalar[0]) && isNumeric(hatalar[1])) {
            var altSinir = hesaplamaNokta[koordinat + 's'] = hesaplamaKoordinat - hatalar[0];
            var ustSinir = hesaplamaNokta[koordinat + 'h'] = hesaplamaKoordinat + hatalar[1];
            degerler.push(altSinir, ustSinir);
        }
    }

    var eksenId = eksen._id;
    var temelEkstremler = iz._extremes[eksenId];
    var ekstremler = Axes.findExtremes(
        eksen,
        degerler,
        Lib.extendFlat({tozero: temelEkstremler.opts.tozero}, {padded: true})
    );
    temelEkstremler.min = temelEkstremler.min.concat(ekstremler.min);
    temelEkstremler.max = temelEkstremler.max.concat(ekstremler.max);
}
