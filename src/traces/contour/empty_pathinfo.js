'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var constraintMapping = require('./constraint_mapping');
var endPlus = require('./end_plus');

// Boş yol bilgisi fonksiyonunu dışa aktar
module.exports = function emptyPathinfo(contours, plotinfo, cd0) {
    // Kontur türüne göre son konturları belirle
    var contoursFinal = (contours.type === 'constraint') ?
        constraintMapping[contours._operation](contours.value) :
        contours;

    var cs = contoursFinal.size;
    var pathinfo = [];
    var end = endPlus(contoursFinal);

    var carpet = cd0.trace._carpetTrace;

    // Temel yol bilgisi oluştur
    var basePathinfo = carpet ? {
        // Piksel dönüşümü için eksenleri sakla
        xaxis: carpet.aaxis,
        yaxis: carpet.baxis,
        // Enterpolasyon için tam veri dizileri
        x: cd0.a,
        y: cd0.b
    } : {
        xaxis: plotinfo.xaxis,
        yaxis: plotinfo.yaxis,
        x: cd0.x,
        y: cd0.y
    };

    // Kontur seviyeleri için yol bilgisi oluştur
    for(var ci = contoursFinal.start; ci < end; ci += cs) {
        pathinfo.push(Lib.extendFlat({
            level: ci,
            // Anlamlı marching index'e sahip tüm hücreler
            crossings: {},
            // Her kontur için kafesin kenarlarında başlangıç noktaları
            starts: [],
            // Tüm kapanmamış yollar (bir yol yuvarlama ile kapanırsa, başlangıçlardan daha az öğe olabilir)
            edgepaths: [],
            // Tüm kapalı yollar
            paths: [],
            z: cd0.z,
            smoothing: cd0.trace.line.smoothing
        }, basePathinfo));

        // Çok fazla kontur varsa uyarı ver ve kırp
        if(pathinfo.length > 1000) {
            Lib.warn('Çok fazla kontur var, 1000 ile sınırlandırılıyor', contours);
            break;
        }
    }
    return pathinfo;
};
