'use strict';

var Lib = require('../../lib');
var Template = require('../../plot_api/plot_template');
var axisIds = require('../../plots/cartesian/axis_ids');

var attributes = require('./attributes');
var oppAxisAttrs = require('./oppaxis_attributes');

module.exports = function varsayılanlarıEleAl(layoutIn, layoutOut, eksenAdi) {
    var eksenGiris = layoutIn[eksenAdi];
    var eksenCikis = layoutOut[eksenAdi];

    if(!(eksenGiris.rangeslider || layoutOut._requestRangeslider[eksenCikis._id])) return;

    // Bu kısımdan çok memnun değilim (belki eksen nesnesinde saklanabilir)
    if(!Lib.isPlainObject(eksenGiris.rangeslider)) {
        eksenGiris.rangeslider = {};
    }

    var konteynerGiris = eksenGiris.rangeslider;
    var konteynerCikis = Template.newContainer(eksenCikis, 'rangeslider');

    function zorla(attr, varsayilan) {
        return Lib.coerce(konteynerGiris, konteynerCikis, attributes, attr, varsayilan);
    }

    var aralikKonteynerGiris, aralikKonteynerCikis;
    function zorlaAralik(attr, varsayilan) {
        return Lib.coerce(aralikKonteynerGiris, aralikKonteynerCikis, oppAxisAttrs, attr, varsayilan);
    }

    var gorunur = zorla('visible');
    if(!gorunur) return;

    zorla('bgcolor', layoutOut.plot_bgcolor);
    zorla('bordercolor');
    zorla('borderwidth');
    zorla('thickness');

    zorla('autorange', !eksenCikis.isValidRange(konteynerGiris.range));
    zorla('range');

    var altGrafikler = layoutOut._subplots;
    if(altGrafikler) {
        var yKimlikler = altGrafikler.cartesian
            .filter(function(altGrafikId) {
                return altGrafikId.substr(0, altGrafikId.indexOf('y')) === axisIds.name2id(eksenAdi);
            })
            .map(function(altGrafikId) {
                return altGrafikId.substr(altGrafikId.indexOf('y'), altGrafikId.length);
            });
        var yIsimler = Lib.simpleMap(yKimlikler, axisIds.id2name);
        for(var i = 0; i < yIsimler.length; i++) {
            var yIsim = yIsimler[i];

            aralikKonteynerGiris = konteynerGiris[yIsim] || {};
            aralikKonteynerCikis = Template.newContainer(konteynerCikis, yIsim, 'yaxis');

            var yEksenCikis = layoutOut[yIsim];

            var aralikModuVarsayilan;
            if(aralikKonteynerGiris.range && yEksenCikis.isValidRange(aralikKonteynerGiris.range)) {
                aralikModuVarsayilan = 'fixed';
            }

            var aralikModu = zorlaAralik('rangemode', aralikModuVarsayilan);
            if(aralikModu !== 'match') {
                zorlaAralik('range', yEksenCikis.range.slice());
            }
        }
    }

    // aralık kaydırıcının (otomatik) aralığını geri eşlemek için
    konteynerCikis._input = konteynerGiris;
};
