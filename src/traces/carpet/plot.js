'use strict';

var d3 = require('@plotly/d3');
var Drawing = require('../../components/drawing');
var map1dArray = require('./map_1d_array');
var makepath = require('./makepath');
var orientText = require('./orient_text');
var svgTextUtils = require('../../lib/svg_text_utils');
var Lib = require('../../lib');
var strRotate = Lib.strRotate;
var strTranslate = Lib.strTranslate;
var alignmentConstants = require('../../constants/alignment');

module.exports = function çiz(gd, plotinfo, cdcarpet, carpetLayer) {
    var statikMi = gd._context.staticPlot;
    var xa = plotinfo.xaxis;
    var ya = plotinfo.yaxis;
    var tamYerleşim = gd._fullLayout;
    var klipKatmanı = tamYerleşim._clips;

    Lib.makeTraceGroups(carpetLayer, cdcarpet, 'trace').each(function(cd) {
        var eksenKatmanı = d3.select(this);
        var cd0 = cd[0];
        var iz = cd0.trace;
        var aEkseni = iz.aaxis;
        var bEkseni = iz.baxis;

        var küçükKatman = Lib.ensureSingle(eksenKatmanı, 'g', 'küçükKatman');
        var büyükKatman = Lib.ensureSingle(eksenKatmanı, 'g', 'büyükKatman');
        var sınırKatmanı = Lib.ensureSingle(eksenKatmanı, 'g', 'sınırKatmanı');
        var etiketKatmanı = Lib.ensureSingle(eksenKatmanı, 'g', 'etiketKatmanı');

        eksenKatmanı.style('opacity', iz.opacity);

        ızgaraÇizgileriniÇiz(xa, ya, büyükKatman, aEkseni, 'a', aEkseni._gridlines, true, statikMi);
        ızgaraÇizgileriniÇiz(xa, ya, büyükKatman, bEkseni, 'b', bEkseni._gridlines, true, statikMi);
        ızgaraÇizgileriniÇiz(xa, ya, küçükKatman, aEkseni, 'a', aEkseni._minorgridlines, true, statikMi);
        ızgaraÇizgileriniÇiz(xa, ya, küçükKatman, bEkseni, 'b', bEkseni._minorgridlines, true, statikMi);

        // Çizgiler aktif değilse bile bunlar atlanmaz. Tam bir yeniden çizim olmadan temizlenmeleri için bağlantılar yürütülmelidir.
        ızgaraÇizgileriniÇiz(xa, ya, sınırKatmanı, aEkseni, 'a-sınır', aEkseni._boundarylines, statikMi);
        ızgaraÇizgileriniÇiz(xa, ya, sınırKatmanı, bEkseni, 'b-sınır', bEkseni._boundarylines, statikMi);

        var etiketYönelimiA = eksenEtiketleriniÇiz(gd, xa, ya, iz, cd0, etiketKatmanı, aEkseni._labels, 'a-etiket');
        var etiketYönelimiB = eksenEtiketleriniÇiz(gd, xa, ya, iz, cd0, etiketKatmanı, bEkseni._labels, 'b-etiket');

        eksenBaşlıklarınıÇiz(gd, etiketKatmanı, iz, cd0, xa, ya, etiketYönelimiA, etiketYönelimiB);

        klipYoluÇiz(iz, cd0, klipKatmanı, xa, ya);
    });
};

function klipYoluÇiz(iz, t, katman, xEkseni, yEkseni) {
    var seg, xp, yp, i;

    var klip = katman.select('#' + iz._clipPathId);

    if (!klip.size()) {
        klip = katman.append('clipPath')
            .classed('carpetclip', true);
    }

    var yol = Lib.ensureSingle(klip, 'path', 'carpetboundary');
    var segmentler = t.clipsegments;
    var segs = [];

    for (i = 0; i < segmentler.length; i++) {
        seg = segmentler[i];
        xp = map1dArray([], seg.x, xEkseni.c2p);
        yp = map1dArray([], seg.y, yEkseni.c2p);
        segs.push(makepath(xp, yp, seg.bicubic));
    }

    // Bu, köşelerdeki no-op L segmentlerinden kaçınmak için biraz optimize edilebilir, ancak bu kadar önemsiz ki ekstra karmaşıklığa değmez.
    var klipYoluVerisi = 'M' + segs.join('L') + 'Z';
    klip.attr('id', iz._clipPathId);
    yol.attr('d', klipYoluVerisi);
}

function ızgaraÇizgileriniÇiz(xEkseni, yEkseni, katman, eksen, eksenHarf, ızgaraÇizgileri, statikMi) {
    var çizgiSınıfı = 'const-' + eksenHarf + '-çizgiler';
    var ızgaraBağlantısı = katman.selectAll('.' + çizgiSınıfı).data(ızgaraÇizgileri);

    ızgaraBağlantısı.enter().append('path')
        .classed(çizgiSınıfı, true)
        .style('vector-effect', statikMi ? 'none' : 'non-scaling-stroke');

    ızgaraBağlantısı.each(function(d) {
        var ızgaraÇizgisi = d;
        var x = ızgaraÇizgisi.x;
        var y = ızgaraÇizgisi.y;

        var xp = map1dArray([], x, xEkseni.c2p);
        var yp = map1dArray([], y, yEkseni.c2p);

        var yol = 'M' + makepath(xp, yp, ızgaraÇizgisi.smoothing);

        var el = d3.select(this);

        el.attr('d', yol)
            .style('stroke-width', ızgaraÇizgisi.width)
            .style('stroke', ızgaraÇizgisi.color)
            .style('stroke-dasharray', Drawing.dashStyle(ızgaraÇizgisi.dash, ızgaraÇizgisi.width))
            .style('fill', 'none');
    });

    ızgaraBağlantısı.exit().remove();
}

function eksenEtiketleriniÇiz(gd, xEkseni, yEkseni, iz, t, katman, etiketler, etiketSınıfı) {
    var etiketBağlantısı = katman.selectAll('text.' + etiketSınıfı).data(etiketler);

    etiketBağlantısı.enter().append('text')
        .classed(etiketSınıfı, true);

    var maxExtent = 0;
    var etiketYönelimi = {};

    etiketBağlantısı.each(function(etiket, i) {
        // Çoğu konumlandırma calc_labels içinde yapılır. Sadece x ve y eksenlerinin ekran alanı temsiline bağlı olan kısımlar burada:
        var yönelim;
        if (etiket.eksen.tickangle === 'auto') {
            yönelim = orientText(iz, xEkseni, yEkseni, etiket.xy, etiket.dxy);
        } else {
            var açı = (etiket.eksen.tickangle + 180.0) * Math.PI / 180.0;
            yönelim = orientText(iz, xEkseni, yEkseni, etiket.xy, [Math.cos(açı), Math.sin(açı)]);
        }

        if (!i) {
            // TODO: offsetMultiplier? Şu anda hiçbir yerde kullanılmıyor...
            etiketYönelimi = { angle: yönelim.angle, flip: yönelim.flip };
        }
        var yön = (etiket.endAnchor ? -1 : 1) * yönelim.flip;

        var etiketEl = d3.select(this)
            .attr({
                'text-anchor': yön > 0 ? 'start' : 'end',
                'data-notex': 1
            })
            .call(Drawing.font, etiket.font)
            .text(etiket.text)
            .call(svgTextUtils.convertToTspans, gd);

        var bbox = Drawing.bBox(this);

        etiketEl.attr('transform',
            // Doğru noktaya çevir:
            strTranslate(yönelim.p[0], yönelim.p[1]) +
            // Izgara çizgisi tanjantı ile hizalanacak şekilde döndür:
            strRotate(yönelim.angle) +
            // Temel çizgiyi ve girintiyi ayarla:
            strTranslate(etiket.eksen.labelpadding * yön, bbox.height * 0.3)
        );

        maxExtent = Math.max(maxExtent, bbox.width + etiket.eksen.labelpadding);
    });

    etiketBağlantısı.exit().remove();

    etiketYönelimi.maxExtent = maxExtent;
    return etiketYönelimi;
}

function eksenBaşlıklarınıÇiz(gd, katman, iz, t, xa, ya, etiketYönelimiA, etiketYönelimiB) {
    var a, b, xy, dxy;

    var aMin = Lib.aggNums(Math.min, null, iz.a);
    var aMax = Lib.aggNums(Math.max, null, iz.a);
    var bMin = Lib.aggNums(Math.min, null, iz.b);
    var bMax = Lib.aggNums(Math.max, null, iz.b);

    a = 0.5 * (aMin + aMax);
    b = bMin;
    xy = iz.ab2xy(a, b, true);
    dxy = iz.dxyda_rough(a, b);
    if (etiketYönelimiA.angle === undefined) {
        Lib.extendFlat(etiketYönelimiA, orientText(iz, xa, ya, xy, iz.dxydb_rough(a, b)));
    }
    eksenBaşlığınıÇiz(gd, katman, iz, t, xy, dxy, iz.aaxis, xa, ya, etiketYönelimiA, 'a-title');

    a = aMin;
    b = 0.5 * (bMin + bMax);
    xy = iz.ab2xy(a, b, true);
    dxy = iz.dxydb_rough(a, b);
    if (etiketYönelimiB.angle === undefined) {
        Lib.extendFlat(etiketYönelimiB, orientText(iz, xa, ya, xy, iz.dxyda_rough(a, b)));
    }
    eksenBaşlığınıÇiz(gd, katman, iz, t, xy, dxy, iz.baxis, xa, ya, etiketYönelimiB, 'b-title');
}

var çizgiAralığı = alignmentConstants.LINE_SPACING;
var ortaKayma = ((1 - alignmentConstants.MID_SHIFT) / çizgiAralığı) + 1;

function eksenBaşlığınıÇiz(gd, katman, iz, t, xy, dxy, eksen, xa, ya, etiketYönelimi, etiketSınıfı) {
    var veri = [];
    if (eksen.title.text) veri.push(eksen.title.text);
    var başlıkBağlantısı = katman.selectAll('text.' + etiketSınıfı).data(veri);
    var ofset = etiketYönelimi.maxExtent;

    başlıkBağlantısı.enter().append('text')
        .classed(etiketSınıfı, true);

    // Sadece bir tane var, ama güzelce güncellenmesi için bir bağlantı olarak yapacağız:
    başlıkBağlantısı.each(function() {
        var yönelim = orientText(iz, xa, ya, xy, dxy);

        if (['start', 'both'].indexOf(eksen.showticklabels) === -1) {
            ofset = 0;
        }

        // Etiketlerin boyutuna ek olarak, biraz ekstra dolgu ekleyin:
        var başlıkBoyutu = eksen.title.font.size;
        ofset += başlıkBoyutu + eksen.title.offset;

        var etiketNorm = etiketYönelimi.angle + (etiketYönelimi.flip < 0 ? 180 : 0);
        var açıFarkı = (etiketNorm - yönelim.angle + 450) % 360;
        var başlığıTersÇevir = açıFarkı > 90 && açıFarkı < 270;

        var el = d3.select(this);

        el.text(eksen.title.text)
            .call(svgTextUtils.convertToTspans, gd);

        if (başlığıTersÇevir) {
            ofset = (-svgTextUtils.lineCount(el) + ortaKayma) * çizgiAralığı * başlıkBoyutu - ofset;
        }

        el.attr('transform',
            strTranslate(yönelim.p[0], yönelim.p[1]) +
            strRotate(yönelim.angle) +
            strTranslate(0, ofset)
        )
            .attr('text-anchor', 'middle')
            .call(Drawing.font, eksen.title.font);
    });

    başlıkBağlantısı.exit().remove();
}
