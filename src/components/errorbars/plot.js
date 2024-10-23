'use strict';

var d3 = require('@plotly/d3');
var isNumeric = require('fast-isnumeric');

var Drawing = require('../drawing');
var subTypes = require('../../traces/scatter/subtypes');

module.exports = function plot(gd, izler, plotinfo, transitionOpts) {
    var yeniMi;

    var xa = plotinfo.xaxis;
    var ya = plotinfo.yaxis;

    var animasyonVarMi = transitionOpts && transitionOpts.duration > 0;
    var statikMi = gd._context.staticPlot;

    izler.each(function(d) {
        var iz = d[0].trace;
        var xObj = iz.error_x || {};
        var yObj = iz.error_y || {};

        var anahtarFonksiyonu;

        if(iz.ids) {
            anahtarFonksiyonu = function(d) {return d.id;};
        }

        var seyrek = (
            subTypes.hasMarkers(iz) &&
            iz.marker.maxdisplayed > 0
        );

        if(!yObj.visible && !xObj.visible) d = [];

        var hataCizgileri = d3.select(this).selectAll('g.errorbar')
            .data(d, anahtarFonksiyonu);

        hataCizgileri.exit().remove();

        if(!d.length) return;

        if(!xObj.visible) hataCizgileri.selectAll('path.xerror').remove();
        if(!yObj.visible) hataCizgileri.selectAll('path.yerror').remove();

        hataCizgileri.style('opacity', 1);

        var giris = hataCizgileri.enter().append('g')
            .classed('errorbar', true);

        if(animasyonVarMi) {
            giris.style('opacity', 0).transition()
                .duration(transitionOpts.duration)
                .style('opacity', 1);
        }

        Drawing.setClipUrl(hataCizgileri, plotinfo.layerClipId, gd);

        hataCizgileri.each(function(d) {
            var hataCizgisi = d3.select(this);
            var koordinatlar = hataKoordinatlari(d, xa, ya);

            if(seyrek && !d.vis) return;

            var yol;

            var yHata = hataCizgisi.select('path.yerror');
            if(yObj.visible && isNumeric(koordinatlar.x) &&
                    isNumeric(koordinatlar.yh) &&
                    isNumeric(koordinatlar.ys)) {
                var yw = yObj.width;

                yol = 'M' + (koordinatlar.x - yw) + ',' +
                    koordinatlar.yh + 'h' + (2 * yw) + // şapka
                    'm-' + yw + ',0V' + koordinatlar.ys; // çubuk

                if(!koordinatlar.noYS) yol += 'm-' + yw + ',0h' + (2 * yw); // ayakkabı

                yeniMi = !yHata.size();

                if(yeniMi) {
                    yHata = hataCizgisi.append('path')
                        .style('vector-effect', statikMi ? 'none' : 'non-scaling-stroke')
                        .classed('yerror', true);
                } else if(animasyonVarMi) {
                    yHata = yHata
                        .transition()
                            .duration(transitionOpts.duration)
                            .ease(transitionOpts.easing);
                }

                yHata.attr('d', yol);
            } else yHata.remove();

            var xHata = hataCizgisi.select('path.xerror');
            if(xObj.visible && isNumeric(koordinatlar.y) &&
                    isNumeric(koordinatlar.xh) &&
                    isNumeric(koordinatlar.xs)) {
                var xw = (xObj.copy_ystyle ? yObj : xObj).width;

                yol = 'M' + koordinatlar.xh + ',' +
                    (koordinatlar.y - xw) + 'v' + (2 * xw) + // şapka
                    'm0,-' + xw + 'H' + koordinatlar.xs; // çubuk

                if(!koordinatlar.noXS) yol += 'm0,-' + xw + 'v' + (2 * xw); // ayakkabı

                yeniMi = !xHata.size();

                if(yeniMi) {
                    xHata = hataCizgisi.append('path')
                        .style('vector-effect', statikMi ? 'none' : 'non-scaling-stroke')
                        .classed('xerror', true);
                } else if(animasyonVarMi) {
                    xHata = xHata
                        .transition()
                            .duration(transitionOpts.duration)
                            .ease(transitionOpts.easing);
                }

                xHata.attr('d', yol);
            } else xHata.remove();
        });
    });
};

// hata çubuklarının koordinatlarını hesapla
function hataKoordinatlari(d, xa, ya) {
    var sonuc = {
        x: xa.c2p(d.x),
        y: ya.c2p(d.y)
    };

    // hata çubuğu boyutunu ve şapka ve ayakkabı konumlarını hesapla
    if(d.yh !== undefined) {
        sonuc.yh = ya.c2p(d.yh);
        sonuc.ys = ya.c2p(d.ys);

        // ayakkabılar ölçek dışına çıkarsa (örneğin log ölçeği, sıfırın ötesindeki hata çubukları)
        // çubuğu kırp ve ayakkabıları gizle
        if(!isNumeric(sonuc.ys)) {
            sonuc.noYS = true;
            sonuc.ys = ya.c2p(d.ys, true);
        }
    }

    if(d.xh !== undefined) {
        sonuc.xh = xa.c2p(d.xh);
        sonuc.xs = xa.c2p(d.xs);

        if(!isNumeric(sonuc.xs)) {
            sonuc.noXS = true;
            sonuc.xs = xa.c2p(d.xs, true);
        }
    }

    return sonuc;
}
