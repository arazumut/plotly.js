'use strict';

var d3 = require('@plotly/d3');

var Registry = require('../../registry');
var Lib = require('../../lib');
var Drawing = require('../../components/drawing');
var Axes = require('./axes');

/**
 * transitionAxes
 *
 * Bir dizi aralıktan başka bir dizi aralığa geçiş yaparak eksenleri svg
 * dönüşümleri kullanarak, kaydırma sırasında olduğu gibi geçiş yapar.
 *
 * @param {DOM element | object} gd
 * @param {array} edits : Her bir öğesi aşağıdaki özelliklere sahip 'düzenlemeler' dizisi
 * - plotinfo {object} alt grafik nesnesi
 * - xr0 {array} başlangıç x-aralığı
 * - xr1 {array} bitiş x-aralığı
 * - yr0 {array} başlangıç y-aralığı
 * - yr1 {array} bitiş y-aralığı
 * @param {object} transitionOpts
 * @param {function} makeOnCompleteCallback
 */
module.exports = function transitionAxes(gd, düzenlemeler, geçişSeçenekleri, tamamlandığındaÇağrıYap) {
    var tamYerleşim = gd._fullLayout;

    // redraw:false Plotly.animate için özel durum, bu eksen referanslı yerleşim bileşenlerini güncellemek için buna dayanır
    if(düzenlemeler.length === 0) {
        Axes.redrawComponents(gd);
        return;
    }

    function altGrafikDönüşümünüKaldır(altGrafik) {
        var xa = altGrafik.xaxis;
        var ya = altGrafik.yaxis;

        tamYerleşim._defs.select('#' + altGrafik.clipId + '> rect')
            .call(Drawing.setTranslate, 0, 0)
            .call(Drawing.setScale, 1, 1);

        altGrafik.plot
            .call(Drawing.setTranslate, xa._offset, ya._offset)
            .call(Drawing.setScale, 1, 1);

        var izGrup = altGrafik.plot.selectAll('.scatterlayer .trace');

        // Bu özellikle scatter izlerine yöneliktir, iz grubunun ölçeğini dengelemek için bireysel noktalara ters ölçek uygulamak:
        izGrup.selectAll('.point')
            .call(Drawing.setPointGroupScale, 1, 1);
        izGrup.selectAll('.textpoint')
            .call(Drawing.setTextPointsScale, 1, 1);
        izGrup
            .call(Drawing.hideOutsideRangePoints, altGrafik);
    }

    function altGrafikGüncelle(düzenleme, ilerleme) {
        var plotinfo = düzenleme.plotinfo;
        var xa = plotinfo.xaxis;
        var ya = plotinfo.yaxis;
        var xlen = xa._length;
        var ylen = ya._length;
        var editX = !!düzenleme.xr1;
        var editY = !!düzenleme.yr1;
        var viewBox = [];

        if(editX) {
            var xr0 = Lib.simpleMap(düzenleme.xr0, xa.r2l);
            var xr1 = Lib.simpleMap(düzenleme.xr1, xa.r2l);
            var dx0 = xr0[1] - xr0[0];
            var dx1 = xr1[1] - xr1[0];
            viewBox[0] = (xr0[0] * (1 - ilerleme) + ilerleme * xr1[0] - xr0[0]) / (xr0[1] - xr0[0]) * xlen;
            viewBox[2] = xlen * ((1 - ilerleme) + ilerleme * dx1 / dx0);
            xa.range[0] = xa.l2r(xr0[0] * (1 - ilerleme) + ilerleme * xr1[0]);
            xa.range[1] = xa.l2r(xr0[1] * (1 - ilerleme) + ilerleme * xr1[1]);
        } else {
            viewBox[0] = 0;
            viewBox[2] = xlen;
        }

        if(editY) {
            var yr0 = Lib.simpleMap(düzenleme.yr0, ya.r2l);
            var yr1 = Lib.simpleMap(düzenleme.yr1, ya.r2l);
            var dy0 = yr0[1] - yr0[0];
            var dy1 = yr1[1] - yr1[0];
            viewBox[1] = (yr0[1] * (1 - ilerleme) + ilerleme * yr1[1] - yr0[1]) / (yr0[0] - yr0[1]) * ylen;
            viewBox[3] = ylen * ((1 - ilerleme) + ilerleme * dy1 / dy0);
            ya.range[0] = xa.l2r(yr0[0] * (1 - ilerleme) + ilerleme * yr1[0]);
            ya.range[1] = ya.l2r(yr0[1] * (1 - ilerleme) + ilerleme * yr1[1]);
        } else {
            viewBox[1] = 0;
            viewBox[3] = ylen;
        }

        Axes.drawOne(gd, xa, {skipTitle: true});
        Axes.drawOne(gd, ya, {skipTitle: true});
        Axes.redrawComponents(gd, [xa._id, ya._id]);

        var xScaleFactor = editX ? xlen / viewBox[2] : 1;
        var yScaleFactor = editY ? ylen / viewBox[3] : 1;
        var clipDx = editX ? viewBox[0] : 0;
        var clipDy = editY ? viewBox[1] : 0;
        var fracDx = editX ? (viewBox[0] / viewBox[2] * xlen) : 0;
        var fracDy = editY ? (viewBox[1] / viewBox[3] * ylen) : 0;
        var plotDx = xa._offset - fracDx;
        var plotDy = ya._offset - fracDy;

        plotinfo.clipRect
            .call(Drawing.setTranslate, clipDx, clipDy)
            .call(Drawing.setScale, 1 / xScaleFactor, 1 / yScaleFactor);

        plotinfo.plot
            .call(Drawing.setTranslate, plotDx, plotDy)
            .call(Drawing.setScale, xScaleFactor, yScaleFactor);

        // İz grubunun ölçeğini dengelemek için bireysel noktalara ters ölçek uygulamak.
        Drawing.setPointGroupScale(plotinfo.zoomScalePts, 1 / xScaleFactor, 1 / yScaleFactor);
        Drawing.setTextPointsScale(plotinfo.zoomScaleTxt, 1 / xScaleFactor, 1 / yScaleFactor);
    }

    var tamamlandığında;
    if(tamamlandığındaÇağrıYap) {
        // Bu modül, Plotly.transition'a tamamlanma hakkında bilgi verip vermeyeceğine karar verir:
        tamamlandığında = tamamlandığındaÇağrıYap();
    }

    function geçişTamamlandı() {
        var aobj = {};

        for(var i = 0; i < düzenlemeler.length; i++) {
            var düzenleme = düzenlemeler[i];
            var xa = düzenleme.plotinfo.xaxis;
            var ya = düzenleme.plotinfo.yaxis;
            if(düzenleme.xr1) aobj[xa._name + '.range'] = düzenleme.xr1.slice();
            if(düzenleme.yr1) aobj[ya._name + '.range'] = düzenleme.yr1.slice();
        }

        // Bu geçişin tamamlandığını sinyal ver:
        tamamlandığında && tamamlandığında();

        return Registry.call('relayout', gd, aobj).then(function() {
            for(var i = 0; i < düzenlemeler.length; i++) {
                altGrafikDönüşümünüKaldır(düzenlemeler[i].plotinfo);
            }
        });
    }

    function geçişKesildi() {
        var aobj = {};

        for(var i = 0; i < düzenlemeler.length; i++) {
            var düzenleme = düzenlemeler[i];
            var xa = düzenleme.plotinfo.xaxis;
            var ya = düzenleme.plotinfo.yaxis;
            if(düzenleme.xr0) aobj[xa._name + '.range'] = düzenleme.xr0.slice();
            if(düzenleme.yr0) aobj[ya._name + '.range'] = düzenleme.yr0.slice();
        }

        return Registry.call('relayout', gd, aobj).then(function() {
            for(var i = 0; i < düzenlemeler.length; i++) {
                altGrafikDönüşümünüKaldır(düzenlemeler[i].plotinfo);
            }
        });
    }

    var t1, t2, raf;
    var easeFn = d3.ease(geçişSeçenekleri.easing);

    gd._transitionData._interruptCallbacks.push(function() {
        window.cancelAnimationFrame(raf);
        raf = null;
        return geçişKesildi();
    });

    function kareYap() {
        t2 = Date.now();

        var tInterp = Math.min(1, (t2 - t1) / geçişSeçenekleri.duration);
        var ilerleme = easeFn(tInterp);

        for(var i = 0; i < düzenlemeler.length; i++) {
            altGrafikGüncelle(düzenlemeler[i], ilerleme);
        }

        if(t2 - t1 > geçişSeçenekleri.duration) {
            geçişTamamlandı();
            raf = window.cancelAnimationFrame(kareYap);
        } else {
            raf = window.requestAnimationFrame(kareYap);
        }
    }

    t1 = Date.now();
    raf = window.requestAnimationFrame(kareYap);

    return Promise.resolve();
};
