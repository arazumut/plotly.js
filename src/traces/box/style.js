'use strict';

// Gerekli modülleri dahil et
var d3 = require('@plotly/d3');
var Renk = require('../../components/color');
var Çizim = require('../../components/drawing');

// Stil fonksiyonu
function stil(gd, cd, sel) {
    var s = sel ? sel : d3.select(gd).selectAll('g.trace.boxes');

    s.style('opacity', function(d) { return d[0].trace.opacity; });

    s.each(function(d) {
        var el = d3.select(this);
        var iz = d[0].trace;
        var çizgiKalınlığı = iz.line.width;

        function kutuStili(kutuSel, çizgiKalınlığı, çizgiRengi, dolguRengi) {
            kutuSel.style('stroke-width', çizgiKalınlığı + 'px')
                .call(Renk.stroke, çizgiRengi)
                .call(Renk.fill, dolguRengi);
        }

        var tümKutular = el.selectAll('path.box');

        if(iz.type === 'candlestick') {
            tümKutular.each(function(kutuVerisi) {
                if(kutuVerisi.empty) return;

                var buKutu = d3.select(this);
                var konteyner = iz[kutuVerisi.dir]; // dir = 'increasing' veya 'decreasing'
                kutuStili(buKutu, konteyner.line.width, konteyner.line.color, konteyner.fillcolor);
                // TODO: Mum çubukları için özel seçim stili
                buKutu.style('opacity', iz.selectedpoints && !kutuVerisi.selected ? 0.3 : 1);
            });
        } else {
            kutuStili(tümKutular, çizgiKalınlığı, iz.line.color, iz.fillcolor);
            el.selectAll('path.mean')
                .style({
                    'stroke-width': çizgiKalınlığı,
                    'stroke-dasharray': (2 * çizgiKalınlığı) + 'px,' + çizgiKalınlığı + 'px'
                })
                .call(Renk.stroke, iz.line.color);

            var noktalar = el.selectAll('path.point');
            Çizim.pointStyle(noktalar, iz, gd);
        }
    });
}

// Seçim üzerine stil fonksiyonu
function seçimÜzerineStil(gd, cd, sel) {
    var iz = cd[0].trace;
    var noktalar = sel.selectAll('path.point');

    if(iz.selectedpoints) {
        Çizim.selectedPointStyle(noktalar, iz);
    } else {
        Çizim.pointStyle(noktalar, iz, gd);
    }
}

// Modülleri dışa aktar
module.exports = {
    stil: stil,
    seçimÜzerineStil: seçimÜzerineStil
};
