'use strict';

var isNumeric = require('fast-isnumeric');
var tinycolor = require('tinycolor2');
var rgba = require('color-normalize');

var RenkSkalası = require('../components/colorscale');
var varsayılanRenk = require('../components/color/attributes').defaultLine;
var diziVeyaTipliDiziMi = require('./array').isArrayOrTypedArray;

var varsayılanRenkRgba = rgba(varsayılanRenk);
var varsayılanOpaklık = 1;

function renkHesapla(girdiRenk, girdiOpaklık) {
    var çıktıRenk = girdiRenk;
    çıktıRenk[3] *= girdiOpaklık;
    return çıktıRenk;
}

function renkDoğrula(girdiRenk) {
    if(isNumeric(girdiRenk)) return varsayılanRenkRgba;

    var çıktıRenk = rgba(girdiRenk);

    return çıktıRenk.length ? çıktıRenk : varsayılanRenkRgba;
}

function opaklıkDoğrula(girdiOpaklık) {
    return isNumeric(girdiOpaklık) ? girdiOpaklık : varsayılanOpaklık;
}

function renkFormatla(girdiKonteyner, girdiOpaklık, uzunluk) {
    var girdiRenk = girdiKonteyner.color;
    if(girdiRenk && girdiRenk._inputArray) girdiRenk = girdiRenk._inputArray;

    var renkDiziMi = diziVeyaTipliDiziMi(girdiRenk);
    var opaklıkDiziMi = diziVeyaTipliDiziMi(girdiOpaklık);
    var renkSeçenekleri = RenkSkalası.extractOpts(girdiKonteyner);
    var çıktıRenk = [];

    var skalaFonksiyonu, renkAl, opaklıkAl, renk, opaklık;

    if(renkSeçenekleri.colorscale !== undefined) {
        skalaFonksiyonu = RenkSkalası.makeColorScaleFuncFromTrace(girdiKonteyner);
    } else {
        skalaFonksiyonu = renkDoğrula;
    }

    if(renkDiziMi) {
        renkAl = function(c, i) {
            // FIXME: skalaFonksiyonu tersini yaptığı için burada çift iş var
            return c[i] === undefined ? varsayılanRenkRgba : rgba(skalaFonksiyonu(c[i]));
        };
    } else renkAl = renkDoğrula;

    if(opaklıkDiziMi) {
        opaklıkAl = function(o, i) {
            return o[i] === undefined ? varsayılanOpaklık : opaklıkDoğrula(o[i]);
        };
    } else opaklıkAl = opaklıkDoğrula;

    if(renkDiziMi || opaklıkDiziMi) {
        for(var i = 0; i < uzunluk; i++) {
            renk = renkAl(girdiRenk, i);
            opaklık = opaklıkAl(girdiOpaklık, i);
            çıktıRenk[i] = renkHesapla(renk, opaklık);
        }
    } else çıktıRenk = renkHesapla(rgba(girdiRenk), girdiOpaklık);

    return çıktıRenk;
}

function renkSkalasınıÇöz(container) {
    var renkSeçenekleri = RenkSkalası.extractOpts(container);

    var renkSkalası = renkSeçenekleri.colorscale;
    if(renkSeçenekleri.reversescale) renkSkalası = RenkSkalası.flipScale(renkSeçenekleri.colorscale);

    return renkSkalası.map(function(elem) {
        var indeks = elem[0];
        var renk = tinycolor(elem[1]);
        var rgb = renk.toRgb();
        return {
            indeks: indeks,
            rgb: [rgb.r, rgb.g, rgb.b, rgb.a]
        };
    });
}

module.exports = {
    renkFormatla: renkFormatla,
    renkSkalasınıÇöz: renkSkalasınıÇöz
};
