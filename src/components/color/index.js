'use strict';

var tinycolor = require('tinycolor2');
var isNumeric = require('fast-isnumeric');
var isTypedArray = require('../../lib/array').isTypedArray;

var renk = module.exports = {};

var renkOzellikleri = require('./attributes');
renk.varsayılanlar = renkOzellikleri.varsayılanlar;
var varsayılanÇizgi = renk.varsayılanÇizgi = renkOzellikleri.varsayılanÇizgi;
renk.açıkÇizgi = renkOzellikleri.açıkÇizgi;
var arkaPlan = renk.arkaPlan = renkOzellikleri.arkaPlan;

/*
 * tinyRGB: bir tinycolor'ı rgb stringine çevirir, ancak
 * tinycolor.toRgbString'in aksine bu asla alpha içermez
 */
renk.tinyRGB = function(tc) {
    var c = tc.toRgb();
    return 'rgb(' + Math.round(c.r) + ', ' +
        Math.round(c.g) + ', ' + Math.round(c.b) + ')';
};

renk.rgb = function(cstr) { return renk.tinyRGB(tinycolor(cstr)); };

renk.opacity = function(cstr) { return cstr ? tinycolor(cstr).getAlpha() : 0; };

renk.opacityEkle = function(cstr, op) {
    var c = tinycolor(cstr).toRgb();
    return 'rgba(' + Math.round(c.r) + ', ' +
        Math.round(c.g) + ', ' + Math.round(c.b) + ', ' + op + ')';
};

// İki rengi birleştirir
// Eğer arka plan şeffafsa veya eksikse,
// renk.arkaPlan arka planda varsayılır
renk.birleştir = function(ön, arka) {
    var fc = tinycolor(ön).toRgb();
    if(fc.a === 1) return tinycolor(ön).toRgbString();

    var bc = tinycolor(arka || arkaPlan).toRgb();
    var bcDüz = bc.a === 1 ? bc : {
        r: 255 * (1 - bc.a) + bc.r * bc.a,
        g: 255 * (1 - bc.a) + bc.g * bc.a,
        b: 255 * (1 - bc.a) + bc.b * bc.a
    };
    var fcDüz = {
        r: bcDüz.r * (1 - fc.a) + fc.r * fc.a,
        g: bcDüz.g * (1 - fc.a) + fc.g * fc.a,
        b: bcDüz.b * (1 - fc.a) + fc.b * fc.a
    };
    return tinycolor(fcDüz).toRgbString();
};

/*
 * İki renk arasında doğrusal interpolasyon yapar.
 *
 * Alpha kanal değerlerini göz ardı eder.
 * Sonuç renk şu şekilde hesaplanır: faktör * ilk + (1 - faktör) * ikinci.
 */
renk.interpolasyon = function(ilk, ikinci, faktör) {
    var fc = tinycolor(ilk).toRgb();
    var sc = tinycolor(ikinci).toRgb();

    var ic = {
        r: faktör * fc.r + (1 - faktör) * sc.r,
        g: faktör * fc.g + (1 - faktör) * sc.g,
        b: faktör * fc.b + (1 - faktör) * sc.b,
    };

    return tinycolor(ic).toRgbString();
};

/*
 * cstr ile kontrast oluşturan bir renk oluşturur.
 *
 * Eğer cstr koyu bir renkse, onu aydınlatırız; eğer açık bir renkse, karartırız.
 *
 * Eğer lightAmount / darkAmount kullanılırsa, bu yüzdelerle ayarlarız,
 * aksi takdirde tamamen beyaz veya siyaha gideriz.
 */
renk.kontrast = function(cstr, lightAmount, darkAmount) {
    var tc = tinycolor(cstr);

    if(tc.getAlpha() !== 1) tc = tinycolor(renk.birleştir(cstr, arkaPlan));

    var yeniRenk = tc.isDark() ?
        (lightAmount ? tc.lighten(lightAmount) : arkaPlan) :
        (darkAmount ? tc.darken(darkAmount) : varsayılanÇizgi);

    return yeniRenk.toString();
};

renk.stroke = function(s, c) {
    var tc = tinycolor(c);
    s.style({stroke: renk.tinyRGB(tc), 'stroke-opacity': tc.getAlpha()});
};

renk.fill = function(s, c) {
    var tc = tinycolor(c);
    s.style({
        fill: renk.tinyRGB(tc),
        'fill-opacity': tc.getAlpha()
    });
};

// Konteynerdeki eski rgb(fractions) formatındaki renkleri arar
// ve bunları rgb(0-255 değerleri) formatına dönüştürür
renk.temizle = function(konteyner) {
    if(!konteyner || typeof konteyner !== 'object') return;

    var anahtarlar = Object.keys(konteyner);
    var i, j, anahtar, değer;

    for(i = 0; i < anahtarlar.length; i++) {
        anahtar = anahtarlar[i];
        değer = konteyner[anahtar];

        if(anahtar.substr(anahtar.length - 5) === 'renk') {
            // sadece "renk" veya "renk ölçeği" ile biten anahtarları temizle

            if(Array.isArray(değer)) {
                for(j = 0; j < değer.length; j++) değer[j] = biriniTemizle(değer[j]);
            } else konteyner[anahtar] = biriniTemizle(değer);
        } else if(anahtar.substr(anahtar.length - 10) === 'renk ölçeği' && Array.isArray(değer)) {
            // renk ölçekleri şu formattadır: [[0, renk1], [frac, renk2], ... [1, renkN]]

            for(j = 0; j < değer.length; j++) {
                if(Array.isArray(değer[j])) değer[j][1] = biriniTemizle(değer[j][1]);
            }
        } else if(Array.isArray(değer)) {
            // nesne dizilerine ve düz nesnelere yineleme yap

            var el0 = değer[0];
            if(!Array.isArray(el0) && el0 && typeof el0 === 'object') {
                for(j = 0; j < değer.length; j++) renk.temizle(değer[j]);
            }
        } else if(değer && typeof değer === 'object' && !isTypedArray(değer)) renk.temizle(değer);
    }
};

function biriniTemizle(değer) {
    if(isNumeric(değer) || typeof değer !== 'string') return değer;

    var değerTrim = değer.trim();
    if(değerTrim.substr(0, 3) !== 'rgb') return değer;

    var eşleşme = değerTrim.match(/^rgba?\s*\(([^()]*)\)$/);
    if(!eşleşme) return değer;

    var parçalar = eşleşme[1].trim().split(/\s*[\s,]\s*/);
    var rgba = değerTrim.charAt(3) === 'a' && parçalar.length === 4;
    if(!rgba && parçalar.length !== 3) return değer;

    for(var i = 0; i < parçalar.length; i++) {
        if(!parçalar[i].length) return değer;
        parçalar[i] = Number(parçalar[i]);

        if(!(parçalar[i] >= 0)) {
            // tüm parçalar pozitif sayılar olmalı

            return değer;
        }

        if(i === 3) {
            // alpha>1 1'e kırpılır

            if(parçalar[i] > 1) parçalar[i] = 1;
        } else if(parçalar[i] >= 1) {
            // r, g, b < 1 olmalı (yani 1'in kendisi izin verilmez)

            return değer;
        }
    }

    var rgbStr = Math.round(parçalar[0] * 255) + ', ' +
        Math.round(parçalar[1] * 255) + ', ' +
        Math.round(parçalar[2] * 255);

    if(rgba) return 'rgba(' + rgbStr + ', ' + parçalar[3] + ')';
    return 'rgb(' + rgbStr + ')';
}
