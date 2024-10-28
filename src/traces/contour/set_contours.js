'use strict';

var Axes = require('../../plots/cartesian/axes');
var Lib = require('../../lib');

module.exports = function setContours(trace, vals) {
    var contours = trace.contours;

    // Kontur seviyelerini otomatik seçmemiz gerekip gerekmediğini kontrol et
    if(trace.autocontour) {
        // Not: coloraxis cmin/cmax kullanmaya çalışmayın,
        // bu değerler şimdilik "her iz" için kalmalıdır
        var zmin = trace.zmin;
        var zmax = trace.zmax;
        if(trace.zauto || zmin === undefined) {
            zmin = Lib.aggNums(Math.min, null, vals);
        }
        if(trace.zauto || zmax === undefined) {
            zmax = Lib.aggNums(Math.max, null, vals);
        }

        var dummyAx = autoContours(zmin, zmax, trace.ncontours);
        contours.size = dummyAx.dtick;
        contours.start = Axes.tickFirst(dummyAx);
        dummyAx.range.reverse();
        contours.end = Axes.tickFirst(dummyAx);

        if(contours.start === zmin) contours.start += contours.size;
        if(contours.end === zmax) contours.end -= contours.size;

        // Küçük bir ncontours ayarlarsanız *ve* uçlar tam olarak zmin/zmax üzerinde olursa
        // start > end olduğu bir kenar durumu vardır. En az bir anlamlı kontur olduğundan emin olun,
        // kesişen değerlerin ortasına yerleştirin
        if(contours.start > contours.end) {
            contours.start = contours.end = (contours.start + contours.end) / 2;
        }

        // Otomatik kontur bilgilerini kaynak veriye geri kopyalayın.
        // Daha önce tüm konturlar nesnesini geri kopyalıyorduk, ancak bu,
        // supplyDefaults'a bırakılması gereken diğer bilgileri (renklendirme, çizgileri gösterme) içeriyordu
        if(!trace._input.contours) trace._input.contours = {};
        Lib.extendFlat(trace._input.contours, {
            start: contours.start,
            end: contours.end,
            size: contours.size
        });
        trace._input.autocontour = true;
    } else if(contours.type !== 'constraint') {
        // Manuel olarak sağlanan başlangıç/bitiş/boyut üzerinde mantık kontrolleri
        var start = contours.start;
        var end = contours.end;
        var inputContours = trace._input.contours;

        if(start > end) {
            contours.start = inputContours.start = end;
            end = contours.end = inputContours.end = start;
            start = contours.start;
        }

        if(!(contours.size > 0)) {
            var sizeOut;
            if(start === end) sizeOut = 1;
            else sizeOut = autoContours(start, end, trace.ncontours).dtick;

            inputContours.size = contours.size = sizeOut;
        }
    }
};

/*
 * autoContours: dtick ile kullanabileceğimiz sahte bir eksen nesnesi oluşturur
 * contours.size olarak kullanabiliriz ve gerekirse Axes.tickFirst ile
 * bu eksen nesnesini kullanarak başlangıç ve bitişi de hesaplayabiliriz
 *
 * start: konturları başlatmak için değer
 * end: bitiş değeri (başlangıçtan büyük olmalıdır)
 * ncontours: yapılacak maksimum kontur sayısı, roughDTick gibi
 *
 * döner: bir eksen nesnesi
 */
function autoContours(start, end, ncontours) {
    var dummyAx = {
        type: 'linear',
        range: [start, end]
    };

    Axes.autoTicks(
        dummyAx,
        (end - start) / (ncontours || 15)
    );

    return dummyAx;
}
