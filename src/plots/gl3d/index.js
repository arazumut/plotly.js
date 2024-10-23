'use strict';

var overrideAll = require('../../plot_api/edit_types').overrideAll;
var fxAttrs = require('../../components/fx/layout_attributes');

var Sahne = require('./scene');
var getSubplotData = require('../get_data').getSubplotData;
var Lib = require('../../lib');
var xmlnsNamespaces = require('../../constants/xmlns_namespaces');

var GL3D = 'gl3d';
var SAHNE = 'sahne';

exports.isim = GL3D;

exports.attr = SAHNE;

exports.idKök = SAHNE;

exports.idRegex = exports.attrRegex = Lib.counterRegex('sahne');

exports.özellikler = require('./layout/attributes');

exports.düzenÖzellikleri = require('./layout/layout_attributes');

exports.temelDüzenÖzellikAşırıYazımları = overrideAll({
    hoverlabel: fxAttrs.hoverlabel
}, 'plot', 'nested');

exports.düzenVarsayılanlarınıSağla = require('./layout/defaults');

exports.plot = function plot(gd) {
    var tamDüzen = gd._fullLayout;
    var tamVeri = gd._fullData;
    var sahneIdleri = tamDüzen._subplots[GL3D];

    for(var i = 0; i < sahneIdleri.length; i++) {
        var sahneId = sahneIdleri[i];
        var tamSahneVerisi = getSubplotData(tamVeri, GL3D, sahneId);
        var sahneDüzeni = tamDüzen[sahneId];
        var kamera = sahneDüzeni.kamera;
        var sahne = sahneDüzeni._sahne;

        if(!sahne) {
            sahne = new Sahne({
                id: sahneId,
                grafikDiv: gd,
                konteyner: gd.querySelector('.gl-container'),
                statikPlot: gd._context.staticPlot,
                plotGlPixelOranı: gd._context.plotGlPixelRatio,
                kamera: kamera
            },
                tamDüzen
            );

            // Sahne örneğine referans ayarla
            sahneDüzeni._sahne = sahne;
        }

        // Modebar düğmesi için 'ilk' kamera görünüm ayarlarını kaydet
        if(!sahne.ilkGörünüm) {
            sahne.ilkGörünüm = {
                yukarı: {
                    x: kamera.up.x,
                    y: kamera.up.y,
                    z: kamera.up.z
                },
                göz: {
                    x: kamera.eye.x,
                    y: kamera.eye.y,
                    z: kamera.eye.z
                },
                merkez: {
                    x: kamera.center.x,
                    y: kamera.center.y,
                    z: kamera.center.z
                }
            };
        }

        sahne.plot(tamSahneVerisi, tamDüzen, gd.layout);
    }
};

exports.temizle = function(yeniTamVeri, yeniTamDüzen, eskiTamVeri, eskiTamDüzen) {
    var eskiSahneAnahtarları = eskiTamDüzen._subplots[GL3D] || [];

    for(var i = 0; i < eskiSahneAnahtarları.length; i++) {
        var eskiSahneAnahtarı = eskiSahneAnahtarları[i];

        if(!yeniTamDüzen[eskiSahneAnahtarı] && !!eskiTamDüzen[eskiSahneAnahtarı]._sahne) {
            eskiTamDüzen[eskiSahneAnahtarı]._sahne.destroy();

            if(eskiTamDüzen._bilgiKatmanı) {
                eskiTamDüzen._bilgiKatmanı
                    .selectAll('.annotation-' + eskiSahneAnahtarı)
                    .remove();
            }
        }
    }
};

exports.toSVG = function(gd) {
    var tamDüzen = gd._fullLayout;
    var sahneIdleri = tamDüzen._subplots[GL3D];
    var boyut = tamDüzen._size;

    for(var i = 0; i < sahneIdleri.length; i++) {
        var sahneDüzeni = tamDüzen[sahneIdleri[i]];
        var alan = sahneDüzeni.domain;
        var sahne = sahneDüzeni._sahne;

        var resimVerisi = sahne.toImage('png');
        var resim = tamDüzen._glimages.append('svg:image');

        resim.attr({
            xmlns: xmlnsNamespaces.svg,
            'xlink:href': resimVerisi,
            x: boyut.l + boyut.w * alan.x[0],
            y: boyut.t + boyut.h * (1 - alan.y[1]),
            width: boyut.w * (alan.x[1] - alan.x[0]),
            height: boyut.h * (alan.y[1] - alan.y[0]),
            preserveAspectRatio: 'none'
        });

        sahne.destroy();
    }
};

// sahne id'lerini temizle, 'sahne1' -> 'sahne'
exports.idTemizle = function idTemizle(id) {
    if(!id.match(/^sahne[0-9]*$/)) return;

    var sahneNumarası = id.substr(5);
    if(sahneNumarası === '1') sahneNumarası = '';

    return SAHNE + sahneNumarası;
};

exports.fxGüncelle = function(gd) {
    var tamDüzen = gd._fullLayout;
    var altGrafikIdleri = tamDüzen._subplots[GL3D];

    for(var i = 0; i < altGrafikIdleri.length; i++) {
        var altGrafikObjesi = tamDüzen[altGrafikIdleri[i]]._sahne;
        altGrafikObjesi.fxGüncelle(tamDüzen.dragmode, tamDüzen.hovermode);
    }
};
