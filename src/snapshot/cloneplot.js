'use strict';

// Gerekli modülleri dahil et
var Registry = require('../registry');
var Lib = require('../lib');

var extendFlat = Lib.extendFlat;
var extendDeep = Lib.extendDeep;

// Varsayılan plotTile düzenlerini buraya koy
function klonDüzenAşımı(tileClass) {
    var asim;

    switch(tileClass) {
        case 'themes__thumb':
            asim = {
                autosize: true,
                width: 150,
                height: 150,
                title: {text: ''},
                showlegend: false,
                margin: {l: 5, r: 5, t: 5, b: 5, pad: 0},
                annotations: []
            };
            break;

        case 'thumbnail':
            asim = {
                title: {text: ''},
                hidesources: true,
                showlegend: false,
                borderwidth: 0,
                bordercolor: '',
                margin: {l: 1, r: 1, t: 1, b: 1, pad: 0},
                annotations: []
            };
            break;

        default:
            asim = {};
    }

    return asim;
}

function anahtarEksenMi(anahtarAdi) {
    var türler = ['xaxis', 'yaxis', 'zaxis'];
    return (türler.indexOf(anahtarAdi.slice(0, 5)) > -1);
}

module.exports = function klonGrafik(grafikObjesi, seçenekler) {
    var i;
    var eskiVeri = grafikObjesi.data;
    var eskiDüzen = grafikObjesi.layout;
    var yeniVeri = extendDeep([], eskiVeri);
    var yeniDüzen = extendDeep({}, eskiDüzen, klonDüzenAşımı(seçenekler.tileClass));
    var bağlam = grafikObjesi._context || {};

    if(seçenekler.width) yeniDüzen.width = seçenekler.width;
    if(seçenekler.height) yeniDüzen.height = seçenekler.height;

    if(seçenekler.tileClass === 'thumbnail' || seçenekler.tileClass === 'themes__thumb') {
        // açıklamaları kaldır
        yeniDüzen.annotations = [];
        var anahtarlar = Object.keys(yeniDüzen);

        for(i = 0; i < anahtarlar.length; i++) {
            if(anahtarEksenMi(anahtarlar[i])) {
                yeniDüzen[anahtarlar[i]].title = {text: ''};
            }
        }

        // renk çubuğu ve pasta etiketlerini kaldır
        for(i = 0; i < yeniVeri.length; i++) {
            var iz = yeniVeri[i];
            iz.showscale = false;
            if(iz.marker) iz.marker.showscale = false;
            if(Registry.traceIs(iz, 'pie-like')) iz.textposition = 'none';
        }
    }

    if(Array.isArray(seçenekler.annotations)) {
        for(i = 0; i < seçenekler.annotations.length; i++) {
            yeniDüzen.annotations.push(seçenekler.annotations[i]);
        }
    }

    // TODO: Bu sahne değişikliği gerçekten burada mı olmalı?
    // Hala ihtiyacımız varsa, gl3d modülüne taşınabilir mi?
    var sahneIdleri = Object.keys(yeniDüzen).filter(function(anahtar) {
        return anahtar.match(/^scene\d*$/);
    });
    if(sahneIdleri.length) {
        var eksenlerGörüntüAşımı = {};
        if(seçenekler.tileClass === 'thumbnail') {
            eksenlerGörüntüAşımı = {
                title: {text: ''},
                showaxeslabels: false,
                showticklabels: false,
                linetickenable: false
            };
        }
        for(i = 0; i < sahneIdleri.length; i++) {
            var sahne = yeniDüzen[sahneIdleri[i]];

            if(!sahne.xaxis) {
                sahne.xaxis = {};
            }

            if(!sahne.yaxis) {
                sahne.yaxis = {};
            }

            if(!sahne.zaxis) {
                sahne.zaxis = {};
            }

            extendFlat(sahne.xaxis, eksenlerGörüntüAşımı);
            extendFlat(sahne.yaxis, eksenlerGörüntüAşımı);
            extendFlat(sahne.zaxis, eksenlerGörüntüAşımı);

            // TODO bu ne yapar?
            sahne._scene = null;
        }
    }

    var gd = document.createElement('div');
    if(seçenekler.tileClass) gd.className = seçenekler.tileClass;

    var plotTile = {
        gd: gd,
        td: gd, // dış (görüntü sunucusu) uyumluluğu için
        layout: yeniDüzen,
        data: yeniVeri,
        config: {
            staticPlot: (seçenekler.staticPlot === undefined) ?
                true :
                seçenekler.staticPlot,
            plotGlPixelRatio: (seçenekler.plotGlPixelRatio === undefined) ?
                2 :
                seçenekler.plotGlPixelRatio,
            displaylogo: seçenekler.displaylogo || false,
            showLink: seçenekler.showLink || false,
            showTips: seçenekler.showTips || false,
            mapboxAccessToken: bağlam.mapboxAccessToken
        }
    };

    if(seçenekler.setBackground !== 'transparent') {
        plotTile.config.setBackground = seçenekler.setBackground || 'opaque';
    }

    // varsayılan Düzeni gd'ye ekleyerek, daha sonra alabilirsiniz
    plotTile.gd.defaultLayout = klonDüzenAşımı(seçenekler.tileClass);

    return plotTile;
};
