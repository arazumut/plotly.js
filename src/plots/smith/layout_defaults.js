'use strict';

var Lib = require('../../lib');
var Renk = require('../../components/color');
var Şablon = require('../../plot_api/plot_template');

var AltGrafikVarsayılanlarıEleAl = require('../subplot_defaults');
var AltGrafikVerileriniAl = require('../get_data').getSubplotData;

var ÖnekSonekVarsayılanlarınıEleAl = require('../cartesian/prefix_suffix_defaults');
var EtiketVarsayılanlarınıEleAl = require('../cartesian/tick_label_defaults');
var ÇizgiIzgaraVarsayılanlarınıEleAl = require('../cartesian/line_grid_defaults');
var KartesyenDönüşümAyarla = require('../cartesian/set_convert');

var yerleşimÖzellikleri = require('./layout_attributes');
var sabitler = require('./constants');
var eksenAdları = sabitler.axisNames;

var hayaliVarsayılanYap = memoize(function(gerçekTickvals) {
    // TODO: bu durumu varsayılanları sağlama adımının dışında ele al
    if(Lib.isTypedArray(gerçekTickvals)) gerçekTickvals = Array.from(gerçekTickvals);

    return gerçekTickvals.slice().reverse().map(function(x) { return -x; })
        .concat([0])
        .concat(gerçekTickvals);
}, String);

function varsayılanlarıEleAl(contIn, contOut, zorla, seçenekler) {
    var arkaPlanRengi = zorla('bgcolor');
    seçenekler.bgColor = Renk.combine(arkaPlanRengi, seçenekler.paper_bgcolor);

    var altGrafikVerileri = AltGrafikVerileriniAl(seçenekler.fullData, sabitler.name, seçenekler.id);
    var yerleşimDış = seçenekler.layoutOut;
    var eksenAdı;

    function eksenZorla(attr, varsayılan) {
        return zorla(eksenAdı + '.' + attr, varsayılan);
    }

    for(var i = 0; i < eksenAdları.length; i++) {
        eksenAdı = eksenAdları[i];

        if(!Lib.isPlainObject(contIn[eksenAdı])) {
            contIn[eksenAdı] = {};
        }

        var eksenİç = contIn[eksenAdı];
        var eksenDış = Şablon.newContainer(contOut, eksenAdı);
        eksenDış._id = eksenDış._name = eksenAdı;
        eksenDış._attr = seçenekler.id + '.' + eksenAdı;
        eksenDış._traceIndices = altGrafikVerileri.map(function(t) { return t._expandedIndex; });

        var görünür = eksenZorla('visible');

        eksenDış.type = 'linear';
        KartesyenDönüşümAyarla(eksenDış, yerleşimDış);

        ÖnekSonekVarsayılanlarınıEleAl(eksenİç, eksenDış, eksenZorla, eksenDış.type);

        if(görünür) {
            var gerçekEksenMi = eksenAdı === 'realaxis';
            if(gerçekEksenMi) eksenZorla('side');

            if(gerçekEksenMi) {
                eksenZorla('tickvals');
            } else {
                var hayaliTickvalsVarsayılan = hayaliVarsayılanYap(
                    contOut.realaxis.tickvals ||
                    yerleşimÖzellikleri.realaxis.tickvals.dflt
                );

                eksenZorla('tickvals', hayaliTickvalsVarsayılan);
            }

            // TODO: bu durumu varsayılanları sağlama adımının dışında ele al
            if(Lib.isTypedArray(eksenDış.tickvals)) eksenDış.tickvals = Array.from(eksenDış.tickvals);

            var varsayılanRenk;
            var varsayılanYazıRengi;
            var varsayılanYazıBoyutu;
            var varsayılanYazıAilesi;
            var yazı = seçenekler.font || {};

            if(görünür) {
                varsayılanRenk = eksenZorla('color');
                varsayılanYazıRengi = (varsayılanRenk === eksenİç.color) ? varsayılanRenk : yazı.color;
                varsayılanYazıBoyutu = yazı.size;
                varsayılanYazıAilesi = yazı.family;
            }

            EtiketVarsayılanlarınıEleAl(eksenİç, eksenDış, eksenZorla, eksenDış.type, {
                noAutotickangles: true,
                noTicklabelshift: true,
                noTicklabelstandoff: true,
                noTicklabelstep: true,
                noAng: !gerçekEksenMi,
                noExp: true,
                font: {
                    color: varsayılanYazıRengi,
                    size: varsayılanYazıBoyutu,
                    family: varsayılanYazıAilesi
                }
            });

            Lib.coerce2(contIn, contOut, yerleşimÖzellikleri, eksenAdı + '.ticklen');
            Lib.coerce2(contIn, contOut, yerleşimÖzellikleri, eksenAdı + '.tickwidth');
            Lib.coerce2(contIn, contOut, yerleşimÖzellikleri, eksenAdı + '.tickcolor', contOut.color);
            var gösterTickler = eksenZorla('ticks');
            if(!gösterTickler) {
                delete contOut[eksenAdı].ticklen;
                delete contOut[eksenAdı].tickwidth;
                delete contOut[eksenAdı].tickcolor;
            }

            ÇizgiIzgaraVarsayılanlarınıEleAl(eksenİç, eksenDış, eksenZorla, {
                varsayılanRenk: varsayılanRenk,
                bgColor: seçenekler.bgColor,
                // varsayılan ızgara rengi burada daha koyu (60%, kartesyen varsayılanı ~91% iken)
                // çünkü ızgara kare değil, bu yüzden gözün daha ağır ipuçlarına ihtiyacı var
                blend: 60,
                showLine: true,
                showGrid: true,
                noZeroLine: true,
                attributes: yerleşimÖzellikleri[eksenAdı]
            });

            eksenZorla('layer');
        }

        eksenZorla('hoverformat');

        delete eksenDış.type;

        eksenDış._input = eksenİç;
    }
}

module.exports = function yerleşimVarsayılanlarınıSağla(yerleşimİç, yerleşimDış, tamVeri) {
    AltGrafikVarsayılanlarıEleAl(yerleşimİç, yerleşimDış, tamVeri, {
        noUirevision: true,
        type: sabitler.name,
        attributes: yerleşimÖzellikleri,
        handleDefaults: varsayılanlarıEleAl,
        font: yerleşimDış.font,
        paper_bgcolor: yerleşimDış.paper_bgcolor,
        fullData: tamVeri,
        layoutOut: yerleşimDış
    });
};

function memoize(fn, keyFn) {
    var cache = {};
    return function(val) {
        var newKey = keyFn ? keyFn(val) : val;
        if(newKey in cache) { return cache[newKey]; }

        var out = fn(val);
        cache[newKey] = out;
        return out;
    };
}
