'use strict';

var mat4X4 = require('gl-mat4');

// 2 boyutlu bir dizi başlatır
exports.init2dArray = function(satirUzunlugu, sutunUzunlugu) {
    var dizi = new Array(satirUzunlugu);
    for(var i = 0; i < satirUzunlugu; i++) dizi[i] = new Array(sutunUzunlugu);
    return dizi;
};

/**
 * (muhtemelen düzensiz) 2 boyutlu bir diziyi z transpoze eder.
 * http://stackoverflow.com/questions/17428587/
 * transposing-a-2d-array-in-javascript adresinden esinlenilmiştir.
 */
exports.transposeRagged = function(z) {
    var maxlen = 0;
    var zlen = z.length;
    var i, j;
    // Maksimum satır uzunluğu:
    for(i = 0; i < zlen; i++) maxlen = Math.max(maxlen, z[i].length);

    var t = new Array(maxlen);
    for(i = 0; i < maxlen; i++) {
        t[i] = new Array(zlen);
        for(j = 0; j < zlen; j++) t[i][j] = z[j][i];
    }

    return t;
};

// Kendi çarpım fonksiyonumuz, böylece numeric modülünü dahil etmemize gerek kalmaz
exports.dot = function(x, y) {
    if(!(x.length && y.length) || x.length !== y.length) return null;

    var uzunluk = x.length;
    var sonuc;
    var i;

    if(x[0].length) {
        // mat-vec veya mat-mat
        sonuc = new Array(uzunluk);
        for(i = 0; i < uzunluk; i++) sonuc[i] = exports.dot(x[i], y);
    } else if(y[0].length) {
        // vec-mat
        var yTranspoze = exports.transposeRagged(y);
        sonuc = new Array(yTranspoze.length);
        for(i = 0; i < yTranspoze.length; i++) sonuc[i] = exports.dot(x, yTranspoze[i]);
    } else {
        // vec-vec
        sonuc = 0;
        for(i = 0; i < uzunluk; i++) sonuc += x[i] * y[i];
    }

    return sonuc;
};

// (x,y) ile çevir
exports.translationMatrix = function(x, y) {
    return [[1, 0, x], [0, 1, y], [0, 0, 1]];
};

// (0,0) etrafında alpha kadar döndür
exports.rotationMatrix = function(alpha) {
    var a = alpha * Math.PI / 180;
    return [[Math.cos(a), -Math.sin(a), 0],
            [Math.sin(a), Math.cos(a), 0],
            [0, 0, 1]];
};

// (x,y) etrafında alpha kadar döndür
exports.rotationXYMatrix = function(a, x, y) {
    return exports.dot(
        exports.dot(exports.translationMatrix(x, y),
                    exports.rotationMatrix(a)),
        exports.translationMatrix(-x, -y));
};

// 3D dönüşüm matrisini x, y ve z parametrelerine uygular
// Not: z isteğe bağlıdır
exports.apply3DTransform = function(transform) {
    return function() {
        var args = arguments;
        var xyz = arguments.length === 1 ? args[0] : [args[0], args[1], args[2] || 0];
        return exports.dot(transform, [xyz[0], xyz[1], xyz[2], 1]).slice(0, 3);
    };
};

// 2D dönüşüm matrisini x ve y parametrelerine veya bir [x,y] dizisine uygular
exports.apply2DTransform = function(transform) {
    return function() {
        var args = arguments;
        if(args.length === 3) {
            args = args[0];
        } // haritadan
        var xy = arguments.length === 1 ? args[0] : [args[0], args[1]];
        return exports.dot(transform, [xy[0], xy[1], 1]).slice(0, 2);
    };
};

// 2D dönüşüm matrisini bir [x1,y1,x2,y2] dizisine uygular (bir segmenti dönüştürmek için)
exports.apply2DTransform2 = function(transform) {
    var at = exports.apply2DTransform(transform);
    return function(xys) {
        return at(xys.slice(0, 2)).concat(at(xys.slice(2, 4)));
    };
};

// CSS matrisini dönüştürür
exports.convertCssMatrix = function(m) {
    if(m) {
        var uzunluk = m.length;
        if(uzunluk === 16) return m;
        if(uzunluk === 6) {
            // 2x3 css dönüşüm matrisini 4x4 matrise dönüştürür, bkz. https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
            return [
                m[0], m[1], 0, 0,
                m[2], m[3], 0, 0,
                0, 0, 1, 0,
                m[4], m[5], 0, 1
            ];
        }
    }
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
};

// 4x4 affine dönüşüm matrisinin tersini bulur
exports.inverseTransformMatrix = function(m) {
    var sonuc = [];
    mat4X4.invert(sonuc, m);
    return [
        [sonuc[0], sonuc[1], sonuc[2], sonuc[3]],
        [sonuc[4], sonuc[5], sonuc[6], sonuc[7]],
        [sonuc[8], sonuc[9], sonuc[10], sonuc[11]],
        [sonuc[12], sonuc[13], sonuc[14], sonuc[15]]
    ];
};
