'use strict';

var Lib = require('../../lib');
var polygonTester = require('../../lib/polygon').tester;

var findIndexOfMin = Lib.findIndexOfMin;
var isAngleInsideSector = Lib.isAngleInsideSector;
var angleDelta = Lib.angleDelta;
var angleDist = Lib.angleDist;

/**
 * Nokta (r,a) verilen bir polar sektördeki açılardan oluşan bir poligonun içinde mi?
 *
 * @param {number} r : Noktanın radyal koordinatı
 * @param {number} a : Noktanın açısal koordinatı (radyan cinsinden)
 * @param {2-item array} rBnds : Sektörün radyal sınırları
 * @param {2-item array} aBnds : Sektörün açısal sınırları (radyan cinsinden)
 * @param {array} vangles : Poligonun köşe açıları (radyan cinsinden)
 * @return {boolean}
 */
function isPtInsidePolygon(r, a, rBnds, aBnds, vangles) {
    if(!isAngleInsideSector(a, aBnds)) return false;

    var r0, r1;

    if(rBnds[0] < rBnds[1]) {
        r0 = rBnds[0];
        r1 = rBnds[1];
    } else {
        r0 = rBnds[1];
        r1 = rBnds[0];
    }

    var polygonIn = polygonTester(makePolygon(r0, aBnds[0], aBnds[1], vangles));
    var polygonOut = polygonTester(makePolygon(r1, aBnds[0], aBnds[1], vangles));
    var xy = [r * Math.cos(a), r * Math.sin(a)];
    return polygonOut.contains(xy) && !polygonIn.contains(xy);
}

// 'v0' <-> 'v1' kenarının 'a' açısındaki bir ışınla kesişim noktasını bulur
// (yani, 'a' açısında orijinden başlayan bir doğru)
// 'v0' ve 'v1' radyan cinsinden açılardır
function findIntersectionXY(v0, v1, a, xpyp) {
    var xstar, ystar;

    var xp = xpyp[0];
    var yp = xpyp[1];
    var dsin = clampTiny(Math.sin(v1) - Math.sin(v0));
    var dcos = clampTiny(Math.cos(v1) - Math.cos(v0));
    var tanA = Math.tan(a);
    var cotanA = clampTiny(1 / tanA);
    var m = dsin / dcos;
    var b = yp - m * xp;

    if(cotanA) {
        if(dsin && dcos) {
            xstar = b / (tanA - m);
            ystar = tanA * xstar;
        } else if(dcos) {
            xstar = yp * cotanA;
            ystar = yp;
        } else {
            xstar = xp;
            ystar = xp * tanA;
        }
    } else {
        if(dsin && dcos) {
            xstar = 0;
            ystar = b;
        } else if(dcos) {
            xstar = 0;
            ystar = yp;
        } else {
            xstar = ystar = NaN;
        }
    }

    return [xstar, ystar];
}

// l^2 = (f(x)^2 - yp)^2 + (x - xp)^2 denklemini çözer
// 0 = a*x^2 + b * x + c şeklinde yeniden düzenlenmiştir
function findXYatLength(l, m, xp, yp) {
    var t = -m * xp;
    var a = m * m + 1;
    var b = 2 * (m * t - xp);
    var c = t * t + xp * xp - l * l;
    var del = Math.sqrt(b * b - 4 * a * c);
    var x0 = (-b + del) / (2 * a);
    var x1 = (-b - del) / (2 * a);
    return [
        [x0, m * x0 + t + yp],
        [x1, m * x1 + t + yp]
    ];
}

function makeRegularPolygon(r, vangles) {
    var len = vangles.length;
    var vertices = new Array(len + 1);
    var i;
    for(i = 0; i < len; i++) {
        var va = vangles[i];
        vertices[i] = [r * Math.cos(va), r * Math.sin(va)];
    }
    vertices[i] = vertices[0].slice();
    return vertices;
}

function makeClippedPolygon(r, a0, a1, vangles) {
    var len = vangles.length;
    var vertices = [];
    var i, j;

    function a2xy(a) {
        return [r * Math.cos(a), r * Math.sin(a)];
    }

    function findXY(va0, va1, s) {
        return findIntersectionXY(va0, va1, s, a2xy(va0));
    }

    function cycleIndex(ind) {
        return Lib.mod(ind, len);
    }

    function isInside(v) {
        return isAngleInsideSector(v, [a0, a1]);
    }

    var i0 = findIndexOfMin(vangles, function(v) {
        return isInside(v) ? angleDist(v, a0) : Infinity;
    });
    var xy0 = findXY(vangles[i0], vangles[cycleIndex(i0 - 1)], a0);
    vertices.push(xy0);

    for(i = i0, j = 0; j < len; i++, j++) {
        var va = vangles[cycleIndex(i)];
        if(!isInside(va)) break;
        vertices.push(a2xy(va));
    }

    var iN = findIndexOfMin(vangles, function(v) {
        return isInside(v) ? angleDist(v, a1) : Infinity;
    });
    var xyN = findXY(vangles[iN], vangles[cycleIndex(iN + 1)], a1);
    vertices.push(xyN);

    vertices.push([0, 0]);
    vertices.push(vertices[0].slice());

    return vertices;
}

function makePolygon(r, a0, a1, vangles) {
    return Lib.isFullCircle([a0, a1]) ?
        makeRegularPolygon(r, vangles) :
        makeClippedPolygon(r, a0, a1, vangles);
}

function findPolygonOffset(r, a0, a1, vangles) {
    var minX = Infinity;
    var minY = Infinity;
    var vertices = makePolygon(r, a0, a1, vangles);

    for(var i = 0; i < vertices.length; i++) {
        var v = vertices[i];
        minX = Math.min(minX, v[0]);
        minY = Math.min(minY, -v[1]);
    }
    return [minX, minY];
}

/**
 * 'a' açısını kapsayan köşe açılarını (vangles) bulur
 *
 * @param {number} a : Açı (radyan cinsinden)
 * @param {array} vangles : Poligonun köşe açıları (radyan cinsinden)
 * @return {2-item array}
 */
function findEnclosingVertexAngles(a, vangles) {
    var minFn = function(v) {
        var adelta = angleDelta(v, a);
        return adelta > 0 ? adelta : Infinity;
    };
    var i0 = findIndexOfMin(vangles, minFn);
    var i1 = Lib.mod(i0 + 1, vangles.length);
    return [vangles[i0], vangles[i1]];
}

// 'nereye' bloklarında 'neredeyse sıfır' sayıları daha kolay yakalamak için
function clampTiny(v) {
    return Math.abs(v) > 1e-10 ? v : 0;
}

function transformForSVG(pts0, cx, cy) {
    cx = cx || 0;
    cy = cy || 0;

    var len = pts0.length;
    var pts1 = new Array(len);

    for(var i = 0; i < len; i++) {
        var pt = pts0[i];
        pts1[i] = [cx + pt[0], cy - pt[1]];
    }
    return pts1;
}

/**
 * Poligon yolu
 *
 * @param {number} r : Poligonun 'yarıçapı'
 * @param {number} a0 : İlk açısal koordinat (radyan cinsinden)
 * @param {number} a1 : İkinci açısal koordinat (radyan cinsinden)
 * @param {array} vangles : Poligonun köşe açıları (radyan cinsinden)
 * @param {number (optional)} cx : Merkezin x koordinatı
 * @param {number (optional)} cy : Merkezin y koordinatı
 * @return {string} svg yolu
 *
 */
function pathPolygon(r, a0, a1, vangles, cx, cy) {
    var poly = makePolygon(r, a0, a1, vangles);
    return 'M' + transformForSVG(poly, cx, cy).join('L');
}

/**
 * Poligon 'halka' yolu
 * Yani, eşmerkezli bir deliği olan bir poligon
 *
 * Bu rutin evenodd SVG kuralını kullanır
 *
 * @param {number} r0 : İlk radyal koordinat
 * @param {number} r1 : İkinci radyal koordinat
 * @param {number} a0 : İlk açısal koordinat (radyan cinsinden)
 * @param {number} a1 : İkinci açısal koordinat (radyan cinsinden)
 * @param {array} vangles : Poligonun köşe açıları (radyan cinsinden)
 * @param {number (optional)} cx : Merkezin x koordinatı
 * @param {number (optional)} cy : Merkezin y koordinatı
 * @return {string} svg yolu
 *
 */
function pathPolygonAnnulus(r0, r1, a0, a1, vangles, cx, cy) {
    var rStart, rEnd;

    if(r0 < r1) {
        rStart = r0;
        rEnd = r1;
    } else {
        rStart = r1;
        rEnd = r0;
    }

    var inner = transformForSVG(makePolygon(rStart, a0, a1, vangles), cx, cy);
    var outer = transformForSVG(makePolygon(rEnd, a0, a1, vangles), cx, cy);
    return 'M' + outer.reverse().join('L') + 'M' + inner.join('L');
}

module.exports = {
    isPtInsidePolygon: isPtInsidePolygon,
    findPolygonOffset: findPolygonOffset,
    findEnclosingVertexAngles: findEnclosingVertexAngles,
    findIntersectionXY: findIntersectionXY,
    findXYatLength: findXYatLength,
    clampTiny: clampTiny,
    pathPolygon: pathPolygon,
    pathPolygonAnnulus: pathPolygonAnnulus
};
