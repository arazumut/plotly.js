'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');
var Lib = require('../../lib');
var dateTime2ms = Lib.dateTime2ms;
var incrementMonth = Lib.incrementMonth;
var constants = require('../../constants/numerical');
var ONEAVGMONTH = constants.ONEAVGMONTH;

// alignPeriod fonksiyonunu dışa aktar
module.exports = function alignPeriod(trace, ax, axLetter, vals) {
    // Eğer eksen tipi 'date' değilse, sadece orijinal değerleri döndür
    if(ax.type !== 'date') return {vals: vals};

    // Hizalama türünü al
    var alignment = trace[axLetter + 'periodalignment'];
    if(!alignment) return {vals: vals};

    // Periyodu al
    var period = trace[axLetter + 'period'];
    var mPeriod;
    if(isNumeric(period)) {
        period = +period;
        if(period <= 0) return {vals: vals};
    } else if(typeof period === 'string' && period.charAt(0) === 'M') {
        var n = +(period.substring(1));
        if(n > 0 && Math.round(n) === n) {
            mPeriod = n;
        } else return {vals: vals};
    }

    var calendar = ax.calendar;

    var isStart = 'start' === alignment;
    var isEnd = 'end' === alignment;

    var period0 = trace[axLetter + 'period0'];
    var base = dateTime2ms(period0, calendar) || 0;

    var yeniDegerler = [];
    var baslangiclar = [];
    var bitisler = [];

    var uzunluk = vals.length;
    for(var i = 0; i < uzunluk; i++) {
        var v = vals[i];

        var tahminiN, baslangicZamani, bitisZamani;
        if(mPeriod) {
            tahminiN = Math.round((v - base) / (mPeriod * ONEAVGMONTH));
            bitisZamani = incrementMonth(base, mPeriod * tahminiN, calendar);

            while(bitisZamani > v) {
                bitisZamani = incrementMonth(bitisZamani, -mPeriod, calendar);
            }
            while(bitisZamani <= v) {
                bitisZamani = incrementMonth(bitisZamani, mPeriod, calendar);
            }

            baslangicZamani = incrementMonth(bitisZamani, -mPeriod, calendar);
        } else {
            tahminiN = Math.round((v - base) / period);
            bitisZamani = base + tahminiN * period;

            while(bitisZamani > v) {
                bitisZamani -= period;
            }
            while(bitisZamani <= v) {
                bitisZamani += period;
            }

            baslangicZamani = bitisZamani - period;
        }

        yeniDegerler[i] = (
            isStart ? baslangicZamani :
            isEnd ? bitisZamani :
            (baslangicZamani + bitisZamani) / 2
        );

        baslangiclar[i] = baslangicZamani;
        bitisler[i] = bitisZamani;
    }

    return {
        vals: yeniDegerler,
        starts: baslangiclar,
        ends: bitisler
    };
};
