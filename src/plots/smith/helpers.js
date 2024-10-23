'use strict';

// x'in işaretini döndüren fonksiyon
function isaret(x) {
    return (
        x < 0 ? -1 :
        x > 0 ? 1 : 0
    );
}

// Mike Bostock'un https://observablehq.com/@mbostock/smith-chart adresinden uyarlanmıştır
function smith(a) {
    var R = a[0];
    var X = a[1];

    if(!isFinite(R) || !isFinite(X)) return [1, 0];

    var D = (R + 1) * (R + 1) + X * X;
    return [(R * R + X * X - 1) / D, 2 * X / D];
}

// Alt grafiği ve a'yı dönüştüren fonksiyon
function donustur(alGrafik, a) {
    var x = a[0];
    var y = a[1];

    return [
        x * alGrafik.yaricap + alGrafik.cx,
        -y * alGrafik.yaricap + alGrafik.cy
    ];
}

// Alt grafiği ve r'yi ölçeklendiren fonksiyon
function olcek(alGrafik, r) {
    return r * alGrafik.yaricap;
}

// Alt grafiği, X, R1 ve R2'yi kullanarak reaktans yayı çizen fonksiyon
function reaktansYayi(alGrafik, X, R1, R2) {
    var t1 = donustur(alGrafik, smith([R1, X]));
    var x1 = t1[0];
    var y1 = t1[1];

    var t2 = donustur(alGrafik, smith([R2, X]));
    var x2 = t2[0];
    var y2 = t2[1];

    if(X === 0) {
        return [
            'M' + x1 + ',' + y1,
            'L' + x2 + ',' + y2
        ].join(' ');
    }

    var r = olcek(alGrafik, 1 / Math.abs(X));

    return [
        'M' + x1 + ',' + y1,
        'A' + r + ',' + r + ' 0 0,' + (X < 0 ? 1 : 0) + ' ' + x2 + ',' + y2
    ].join(' ');
}

// Alt grafiği, R, X1 ve X2'yi kullanarak direnç yayı çizen fonksiyon
function direncYayi(alGrafik, R, X1, X2) {
    var r = olcek(alGrafik, 1 / (R + 1));

    var t1 = donustur(alGrafik, smith([R, X1]));
    var x1 = t1[0];
    var y1 = t1[1];

    var t2 = donustur(alGrafik, smith([R, X2]));
    var x2 = t2[0];
    var y2 = t2[1];

    if(isaret(X1) !== isaret(X2)) {
        var t0 = donustur(alGrafik, smith([R, 0]));
        var x0 = t0[0];
        var y0 = t0[1];

        return [
            'M' + x1 + ',' + y1,
            'A' + r + ',' + r + ' 0 0,' + (0 < X1 ? 0 : 1) + ' ' + x0 + ',' + y0,
            'A' + r + ',' + r + ' 0 0,' + (X2 < 0 ? 0 : 1) + x2 + ',' + y2,
        ].join(' ');
    }

    return [
        'M' + x1 + ',' + y1,
        'A' + r + ',' + r + ' 0 0,' + (X2 < X1 ? 0 : 1) + ' ' + x2 + ',' + y2
    ].join(' ');
}

module.exports = {
    smith: smith,
    reaktansYayi: reaktansYayi,
    direncYayi: direncYayi,
    smithDonustur: donustur
};
