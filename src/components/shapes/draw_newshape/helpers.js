'use strict';

var parseSvgPath = require('parse-svg-path');

var sabitler = require('./constants');
var CIRCLE_SIDES = sabitler.CIRCLE_SIDES;
var SQRT2 = sabitler.SQRT2;

var kartesyenYardimcilar = require('../../selections/helpers');
var p2r = kartesyenYardimcilar.p2r;
var r2p = kartesyenYardimcilar.r2p;

var iC = [0, 3, 4, 5, 6, 1, 2];
var iQS = [0, 3, 4, 1, 2];

exports.yazYollar = function(polygonlar) {
    var nI = polygonlar.length;
    if(!nI) return 'M0,0Z';

    var str = '';
    for(var i = 0; i < nI; i++) {
        var nJ = polygonlar[i].length;
        for(var j = 0; j < nJ; j++) {
            var w = polygonlar[i][j][0];
            if(w === 'Z') {
                str += 'Z';
            } else {
                var nK = polygonlar[i][j].length;
                for(var k = 0; k < nK; k++) {
                    var gercekK = k;
                    if(w === 'Q' || w === 'S') {
                        gercekK = iQS[k];
                    } else if(w === 'C') {
                        gercekK = iC[k];
                    }

                    str += polygonlar[i][j][gercekK];
                    if(k > 0 && k < nK - 1) {
                        str += ',';
                    }
                }
            }
        }
    }

    return str;
};

exports.okuYollar = function(str, gd, plotinfo, aktifSekilMi) {
    var cmd = parseSvgPath(str);

    var poligonlar = [];
    var n = -1;
    var yeniPoligon = function() {
        n++;
        poligonlar[n] = [];
    };

    var k;
    var x = 0;
    var y = 0;
    var baslangicX;
    var baslangicY;
    var baslangiciKaydet = function() {
        baslangicX = x;
        baslangicY = y;
    };

    baslangiciKaydet();
    for(var i = 0; i < cmd.length; i++) {
        var yeniPozisyon = [];

        var x1, x2, y1, y2; // eğriler için ekstra parametreler

        var c = cmd[i][0];
        var w = c;
        switch(c) {
            case 'M':
                yeniPoligon();
                x = +cmd[i][1];
                y = +cmd[i][2];
                yeniPozisyon.push([w, x, y]);

                baslangiciKaydet();
                break;

            case 'Q':
            case 'S':
                x1 = +cmd[i][1];
                y1 = +cmd[i][2];
                x = +cmd[i][3];
                y = +cmd[i][4];
                yeniPozisyon.push([w, x, y, x1, y1]); // -> iQS sırası
                break;

            case 'C':
                x1 = +cmd[i][1];
                y1 = +cmd[i][2];
                x2 = +cmd[i][3];
                y2 = +cmd[i][4];
                x = +cmd[i][5];
                y = +cmd[i][6];
                yeniPozisyon.push([w, x, y, x1, y1, x2, y2]); // -> iC sırası
                break;

            case 'T':
            case 'L':
                x = +cmd[i][1];
                y = +cmd[i][2];
                yeniPozisyon.push([w, x, y]);
                break;

            case 'H':
                w = 'L'; // çizgiye dönüştür (şimdilik)
                x = +cmd[i][1];
                yeniPozisyon.push([w, x, y]);
                break;

            case 'V':
                w = 'L'; // çizgiye dönüştür (şimdilik)
                y = +cmd[i][1];
                yeniPozisyon.push([w, x, y]);
                break;

            case 'A':
                w = 'L'; // çemberi işlemek için çizgiye dönüştür
                var rx = +cmd[i][1];
                var ry = +cmd[i][2];
                if(!+cmd[i][4]) {
                    rx = -rx;
                    ry = -ry;
                }

                var merkezX = x - rx;
                var merkezY = y;
                for(k = 1; k <= CIRCLE_SIDES / 2; k++) {
                    var t = 2 * Math.PI * k / CIRCLE_SIDES;
                    yeniPozisyon.push([
                        w,
                        merkezX + rx * Math.cos(t),
                        merkezY + ry * Math.sin(t)
                    ]);
                }
                break;

            case 'Z':
                if(x !== baslangicX || y !== baslangicY) {
                    x = baslangicX;
                    y = baslangicY;
                    yeniPozisyon.push([w, x, y]);
                }
                break;
        }

        var domain = (plotinfo || {}).domain;
        var size = gd._fullLayout._size;
        var xPixelBoyutlu = plotinfo && plotinfo.xsizemode === 'pixel';
        var yPixelBoyutlu = plotinfo && plotinfo.ysizemode === 'pixel';
        var ofsetYok = aktifSekilMi === false;

        for(var j = 0; j < yeniPozisyon.length; j++) {
            for(k = 0; k + 2 < 7; k += 2) {
                var _x = yeniPozisyon[j][k + 1];
                var _y = yeniPozisyon[j][k + 2];

                if(_x === undefined || _y === undefined) continue;
                // Z için bitiş noktasını takip et
                x = _x;
                y = _y;

                if(plotinfo) {
                    if(plotinfo.xaxis && plotinfo.xaxis.p2r) {
                        if(ofsetYok) _x -= plotinfo.xaxis._offset;
                        if(xPixelBoyutlu) {
                            _x = r2p(plotinfo.xaxis, plotinfo.xanchor) + _x;
                        } else {
                            _x = p2r(plotinfo.xaxis, _x);
                        }
                    } else {
                        if(ofsetYok) _x -= size.l;
                        if(domain) _x = domain.x[0] + _x / size.w;
                        else _x = _x / size.w;
                    }

                    if(plotinfo.yaxis && plotinfo.yaxis.p2r) {
                        if(ofsetYok) _y -= plotinfo.yaxis._offset;
                        if(yPixelBoyutlu) {
                            _y = r2p(plotinfo.yaxis, plotinfo.yanchor) - _y;
                        } else {
                            _y = p2r(plotinfo.yaxis, _y);
                        }
                    } else {
                        if(ofsetYok) _y -= size.t;
                        if(domain) _y = domain.y[1] - _y / size.h;
                        else _y = 1 - _y / size.h;
                    }
                }

                yeniPozisyon[j][k + 1] = _x;
                yeniPozisyon[j][k + 2] = _y;
            }
            poligonlar[n].push(
                yeniPozisyon[j].slice()
            );
        }
    }

    return poligonlar;
};

function neredeyseEsit(a, b) {
    return Math.abs(a - b) <= 1e-6;
}

function mesafe(a, b) {
    var dx = b[1] - a[1];
    var dy = b[2] - a[2];
    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}

exports.dikdortgenUzerindeNoktalar = function(hücre) {
    var uzunluk = hücre.length;
    if(uzunluk !== 5) return false;

    for(var j = 1; j < 3; j++) {
        var e01 = hücre[0][j] - hücre[1][j];
        var e32 = hücre[3][j] - hücre[2][j];

        if(!neredeyseEsit(e01, e32)) return false;

        var e03 = hücre[0][j] - hücre[3][j];
        var e12 = hücre[1][j] - hücre[2][j];
        if(!neredeyseEsit(e03, e12)) return false;
    }

    // Not: Döndürülmüş dikdörtgenler geçerli dikdörtgenler değildir çünkü şekillerde döndürme şu anda desteklenmemektedir.
    if(
        !neredeyseEsit(hücre[0][1], hücre[1][1]) &&
        !neredeyseEsit(hücre[0][1], hücre[3][1])
    ) return false;

    // sıfır alanlı durumları reddet
    return !!(
        mesafe(hücre[0], hücre[1]) *
        mesafe(hücre[0], hücre[3])
    );
};

exports.elipsUzerindeNoktalar = function(hücre) {
    var uzunluk = hücre.length;
    if(uzunluk !== CIRCLE_SIDES + 1) return false;

    // karşıt köşegenler aynı olmalı
    uzunluk = CIRCLE_SIDES;
    for(var i = 0; i < uzunluk; i++) {
        var k = (uzunluk * 2 - i) % uzunluk;

        var k2 = (uzunluk / 2 + k) % uzunluk;
        var i2 = (uzunluk / 2 + i) % uzunluk;

        if(!neredeyseEsit(
            mesafe(hücre[i], hücre[i2]),
            mesafe(hücre[k], hücre[k2])
        )) return false;
    }
    return true;
};

exports.elipsIsle = function(elipsMi, baslangic, bitis) {
    if(!elipsMi) return [baslangic, bitis]; // yani çizgi durumu

    var pozisyon = exports.elipsUzerinde({
        x0: baslangic[0],
        y0: baslangic[1],
        x1: bitis[0],
        y1: bitis[1]
    });

    var cx = (pozisyon.x1 + pozisyon.x0) / 2;
    var cy = (pozisyon.y1 + pozisyon.y0) / 2;
    var rx = (pozisyon.x1 - pozisyon.x0) / 2;
    var ry = (pozisyon.y1 - pozisyon.y0) / 2;

    // bir boyut sıfır olduğunda bir çember yap
    if(!rx) rx = ry = ry / SQRT2;
    if(!ry) ry = rx = rx / SQRT2;

    var hücre = [];
    for(var i = 0; i < CIRCLE_SIDES; i++) {
        var t = i * 2 * Math.PI / CIRCLE_SIDES;
        hücre.push([
            cx + rx * Math.cos(t),
            cy + ry * Math.sin(t),
        ]);
    }
    return hücre;
};

exports.elipsUzerinde = function(pozisyon) {
    var x0 = pozisyon.x0;
    var y0 = pozisyon.y0;
    var x1 = pozisyon.x1;
    var y1 = pozisyon.y1;

    var dx = x1 - x0;
    var dy = y1 - y0;

    x0 -= dx;
    y0 -= dy;

    var cx = (x0 + x1) / 2;
    var cy = (y0 + y1) / 2;

    var ölçek = SQRT2;
    dx *= ölçek;
    dy *= ölçek;

    return {
        x0: cx - dx,
        y0: cy - dy,
        x1: cx + dx,
        y1: cy + dy
    };
};

exports.yollarIcinTarihleriDuzelt = function(polygonlar, xaxis, yaxis) {
    var xTarihMi = xaxis.type === 'date';
    var yTarihMi = yaxis.type === 'date';
    if(!xTarihMi && !yTarihMi) return polygonlar;

    for(var i = 0; i < polygonlar.length; i++) {
        for(var j = 0; j < polygonlar[i].length; j++) {
            for(var k = 0; k + 2 < polygonlar[i][j].length; k += 2) {
                if(xTarihMi) polygonlar[i][j][k + 1] = polygonlar[i][j][k + 1].replace(' ', '_');
                if(yTarihMi) polygonlar[i][j][k + 2] = polygonlar[i][j][k + 2].replace(' ', '_');
            }
        }
    }

    return polygonlar;
};
