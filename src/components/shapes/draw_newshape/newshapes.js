'use strict';

var sürüklemeYardımcıları = require('../../dragelement/helpers');
var çizimModu = sürüklemeYardımcıları.çizimModu;
var açıkMod = sürüklemeYardımcıları.açıkMod;

var sabitler = require('./constants');
var i000 = sabitler.i000;
var i090 = sabitler.i090;
var i180 = sabitler.i180;
var i270 = sabitler.i270;
var cos45 = sabitler.cos45;
var sin45 = sabitler.sin45;

var kartezyenYardımcıları = require('../../selections/helpers');
var p2r = kartezyenYardımcıları.p2r;
var r2p = kartezyenYardımcıları.r2p;

var konturÇiz = require('.././handle_outline');
var konturTemizle = konturÇiz.konturTemizle;

var yardımcılar = require('./helpers');
var yollarıOku = yardımcılar.yollarıOku;
var yollarıYaz = yardımcılar.yollarıYaz;
var elipsÜzerinde = yardımcılar.elipsÜzerinde;
var yollarİçinTarihleriDüzelt = yardımcılar.yollarİçinTarihleriDüzelt;

function yeniŞekiller(konturlar, sürüklemeSeçenekleri) {
    if(!konturlar.length) return;
    var e = konturlar[0][0]; // ilkini seç
    if(!e) return;

    var gd = sürüklemeSeçenekleri.gd;

    var aktifŞekil = sürüklemeSeçenekleri.aktifŞekil;
    var sürüklemeModu = sürüklemeSeçenekleri.sürüklemeModu;

    var şekiller = (gd.layout || {}).shapes || [];

    if(!çizimModu(sürüklemeModu) && aktifŞekil !== undefined) {
        var id = gd._fullLayout._aktifŞekilIndex;
        if(id < şekiller.length) {
            switch(gd._fullLayout.shapes[id].type) {
                case 'rect':
                    sürüklemeModu = 'dikdörtgenÇiz';
                    break;
                case 'circle':
                    sürüklemeModu = 'daireÇiz';
                    break;
                case 'line':
                    sürüklemeModu = 'çizgiÇiz';
                    break;
                case 'path':
                    var yol = şekiller[id].path || '';
                    if(yol[yol.length - 1] === 'Z') {
                        sürüklemeModu = 'kapalıYolÇiz';
                    } else {
                        sürüklemeModu = 'açıkYolÇiz';
                    }
                    break;
            }
        }
    }

    var yeniŞekil = şekilObjesiOluştur(konturlar, sürüklemeSeçenekleri, sürüklemeModu);

    konturTemizle(gd);

    var düzenlemeYardımcıları = sürüklemeSeçenekleri.düzenlemeYardımcıları;
    var öğeyiDeğiştir = (düzenlemeYardımcıları || {}).öğeyiDeğiştir;

    var tümŞekiller = [];
    for(var q = 0; q < şekiller.length; q++) {
        var düzenlemeÖncesi = gd._fullLayout.shapes[q];
        tümŞekiller[q] = düzenlemeÖncesi._input;

        if(
            aktifŞekil !== undefined &&
            q === gd._fullLayout._aktifŞekilIndex
        ) {
            var düzenlemeSonrası = yeniŞekil;

            switch(düzenlemeÖncesi.type) {
                case 'line':
                case 'rect':
                case 'circle':
                    öğeyiDeğiştir('x0', düzenlemeSonrası.x0 - (düzenlemeÖncesi.x0shift || 0));
                    öğeyiDeğiştir('x1', düzenlemeSonrası.x1 - (düzenlemeÖncesi.x1shift || 0));
                    öğeyiDeğiştir('y0', düzenlemeSonrası.y0 - (düzenlemeÖncesi.y0shift || 0));
                    öğeyiDeğiştir('y1', düzenlemeSonrası.y1 - (düzenlemeÖncesi.y1shift || 0));
                    break;

                case 'path':
                    öğeyiDeğiştir('path', düzenlemeSonrası.path);
                    break;
            }
        }
    }

    if(aktifŞekil === undefined) {
        tümŞekiller.push(yeniŞekil); // yeni şekil ekle
        return tümŞekiller;
    }

    return düzenlemeYardımcıları ? düzenlemeYardımcıları.güncellemeObjesiAl() : {};
}

function şekilObjesiOluştur(konturlar, sürüklemeSeçenekleri, sürüklemeModu) {
    var e = konturlar[0][0]; // ilk konturu seç
    var gd = sürüklemeSeçenekleri.gd;

    var d = e.getAttribute('d');
    var yeniStil = gd._fullLayout.yeniŞekil;
    var plotinfo = sürüklemeSeçenekleri.plotinfo;
    var aktifŞekil = sürüklemeSeçenekleri.aktifŞekil;

    var xaxis = plotinfo.xaxis;
    var yaxis = plotinfo.yaxis;
    var xKağıt = !!plotinfo.domain || !plotinfo.xaxis;
    var yKağıt = !!plotinfo.domain || !plotinfo.yaxis;

    var açıkModda = açıkMod(sürüklemeModu);
    var çokgenler = yollarıOku(d, gd, plotinfo, aktifŞekil);

    var yeniŞekil = {
        düzenlenebilir: true,

        görünür: yeniStil.görünür,
        isim: yeniStil.isim,
        efsaneGöster: yeniStil.efsaneGöster,
        efsane: yeniStil.efsane,
        efsaneGenişlik: yeniStil.efsaneGenişlik,
        efsaneGrubu: yeniStil.efsaneGrubu,
        efsaneGrupBaşlığı: {
            metin: yeniStil.efsaneGrupBaşlığı.metin,
            yazıtipi: yeniStil.efsaneGrupBaşlığı.yazıtipi
        },
        efsaneSırası: yeniStil.efsaneSırası,

        etiket: yeniStil.etiket,

        xref: xKağıt ? 'kağıt' : xaxis._id,
        yref: yKağıt ? 'kağıt' : yaxis._id,

        katman: yeniStil.katman,
        opaklık: yeniStil.opaklık,
        çizgi: {
            renk: yeniStil.çizgi.renk,
            genişlik: yeniStil.çizgi.genişlik,
            çizgiStili: yeniStil.çizgi.çizgiStili
        }
    };

    if(!açıkModda) {
        yeniŞekil.dolguRengi = yeniStil.dolguRengi;
        yeniŞekil.dolguKuralı = yeniStil.dolguKuralı;
    }

    var hücre;
    // çizgi, dikdörtgen ve daire bir hücrede olabilir
    // sadece tek hücre varsa hücreyi tanımla
    if(çokgenler.length === 1) hücre = çokgenler[0];

    if(
        hücre &&
        hücre.length === 5 && // dikdörtgen için sadece 4 köşe olduğundan emin ol
        sürüklemeModu === 'dikdörtgenÇiz'
    ) {
        yeniŞekil.tip = 'dikdörtgen';
        yeniŞekil.x0 = hücre[0][1];
        yeniŞekil.y0 = hücre[0][2];
        yeniŞekil.x1 = hücre[2][1];
        yeniŞekil.y1 = hücre[2][2];
    } else if(
        hücre &&
        sürüklemeModu === 'çizgiÇiz'
    ) {
        yeniŞekil.tip = 'çizgi';
        yeniŞekil.x0 = hücre[0][1];
        yeniŞekil.y0 = hücre[0][2];
        yeniŞekil.x1 = hücre[1][1];
        yeniŞekil.y1 = hücre[1][2];
    } else if(
        hücre &&
        sürüklemeModu === 'daireÇiz'
    ) {
        yeniŞekil.tip = 'daire'; // bir elips!

        var xA = hücre[i000][1];
        var xB = hücre[i090][1];
        var xC = hücre[i180][1];
        var xD = hücre[i270][1];

        var yA = hücre[i000][2];
        var yB = hücre[i090][2];
        var yC = hücre[i180][2];
        var yD = hücre[i270][2];

        var xTarihVeyaLog = plotinfo.xaxis && (
            plotinfo.xaxis.tip === 'date' ||
            plotinfo.xaxis.tip === 'log'
        );

        var yTarihVeyaLog = plotinfo.yaxis && (
            plotinfo.yaxis.tip === 'date' ||
            plotinfo.yaxis.tip === 'log'
        );

        if(xTarihVeyaLog) {
            xA = r2p(plotinfo.xaxis, xA);
            xB = r2p(plotinfo.xaxis, xB);
            xC = r2p(plotinfo.xaxis, xC);
            xD = r2p(plotinfo.xaxis, xD);
        }

        if(yTarihVeyaLog) {
            yA = r2p(plotinfo.yaxis, yA);
            yB = r2p(plotinfo.yaxis, yB);
            yC = r2p(plotinfo.yaxis, yC);
            yD = r2p(plotinfo.yaxis, yD);
        }

        var x0 = (xB + xD) / 2;
        var y0 = (yA + yC) / 2;
        var rx = (xD - xB + xC - xA) / 2;
        var ry = (yD - yB + yC - yA) / 2;
        var pos = elipsÜzerinde({
            x0: x0,
            y0: y0,
            x1: x0 + rx * cos45,
            y1: y0 + ry * sin45
        });

        if(xTarihVeyaLog) {
            pos.x0 = p2r(plotinfo.xaxis, pos.x0);
            pos.x1 = p2r(plotinfo.xaxis, pos.x1);
        }

        if(yTarihVeyaLog) {
            pos.y0 = p2r(plotinfo.yaxis, pos.y0);
            pos.y1 = p2r(plotinfo.yaxis, pos.y1);
        }

        yeniŞekil.x0 = pos.x0;
        yeniŞekil.y0 = pos.y0;
        yeniŞekil.x1 = pos.x1;
        yeniŞekil.y1 = pos.y1;
    } else {
        yeniŞekil.tip = 'yol';
        if(xaxis && yaxis) yollarİçinTarihleriDüzelt(çokgenler, xaxis, yaxis);
        yeniŞekil.yol = yollarıYaz(çokgenler);
        hücre = null;
    }
    return yeniŞekil;
}

module.exports = {
    yeniŞekiller: yeniŞekiller,
    şekilObjesiOluştur: şekilObjesiOluştur,
};
