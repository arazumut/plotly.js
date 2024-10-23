'use strict';

// Gerekli modülleri dahil et
var drawRaw = require('../annotations/draw').drawRaw;
var project = require('../../plots/gl3d/project');
var eksenHarfleri = ['x', 'y', 'z'];

// draw fonksiyonunu dışa aktar
module.exports = function çiz(scene) {
    var tamSahneYerleşimi = scene.fullSceneLayout;
    var veriÖlçeği = scene.dataScale;
    var açıklamalar = tamSahneYerleşimi.annotations;

    for(var i = 0; i < açıklamalar.length; i++) {
        var açıklama = açıklamalar[i];
        var açıklamaEkranDışı = false;

        for(var j = 0; j < 3; j++) {
            var eksenHarf = eksenHarfleri[j];
            var pozisyon = açıklama[eksenHarf];
            var eksen = tamSahneYerleşimi[eksenHarf + 'axis'];
            var pozisyonFraksiyonu = eksen.r2fraction(pozisyon);

            if(pozisyonFraksiyonu < 0 || pozisyonFraksiyonu > 1) {
                açıklamaEkranDışı = true;
                break;
            }
        }

        if(açıklamaEkranDışı) {
            scene.fullLayout._infolayer
                .select('.annotation-' + scene.id + '[data-index="' + i + '"]')
                .remove();
        } else {
            açıklama._pdata = project(scene.glplot.cameraParams, [
                tamSahneYerleşimi.xaxis.r2l(açıklama.x) * veriÖlçeği[0],
                tamSahneYerleşimi.yaxis.r2l(açıklama.y) * veriÖlçeği[1],
                tamSahneYerleşimi.zaxis.r2l(açıklama.z) * veriÖlçeği[2]
            ]);

            drawRaw(scene.graphDiv, açıklama, i, scene.id, açıklama._xa, açıklama._ya);
        }
    }
};
