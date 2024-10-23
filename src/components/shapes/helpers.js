'use strict';

var sabitler = require('./constants');

var Lib = require('../../lib');
var Eksenler = require('../../plots/cartesian/axes');

// Özel pozisyon dönüştürme fonksiyonları... kategori ekseni pozisyonları
// veri değerleriyle belirtilemez, çünkü sürekli bir haritalama yapmazlar.
// Bu yüzden kategori seri numaralarıyla belirtilmelidirler, ancak kesirli
// değerler alabilirler. Diğer eksen türlerinde pozisyonu gerçek veri
// değerlerine göre belirtiriz.
// TODO: V3.0'da (log ekseni aralıkları veri birimlerinde olduğunda) aralık ve
// şekil pozisyonu aynı olacak, bu yüzden rangeToShapePosition ve
// shapePositionToRange tamamen kaldırılabilir.

exports.araligiSekilPozisyonunaDonustur = function(eksen) {
    return (eksen.tipi === 'log') ? eksen.r2d : function(v) { return v; };
};

exports.sekilPozisyonunuAraligaDonustur = function(eksen) {
    return (eksen.tipi === 'log') ? eksen.d2r : function(v) { return v; };
};

exports.tarihiCoz = function(pxDonustur) {
    return function(v) {
        if(v.replace) v = v.replace('_', ' ');
        return pxDonustur(v);
    };
};

exports.tarihiKodla = function(tariheDonustur) {
    return function(v) { return tariheDonustur(v).replace(' ', '_'); };
};

exports.yolKoordinatlariniCikar = function(yol, kullanilacakParametreler, ham) {
    var cikarilanKoordinatlar = [];

    var segmentler = yol.match(sabitler.segmentRE);
    segmentler.forEach(function(segment) {
        var ilgiliParamIdx = kullanilacakParametreler[segment.charAt(0)].cizilen;
        if(ilgiliParamIdx === undefined) return;

        var parametreler = segment.substr(1).match(sabitler.paramRE);
        if(!parametreler || parametreler.length < ilgiliParamIdx) return;

        var str = parametreler[ilgiliParamIdx];
        var pos = ham ? str : Lib.cleanNumber(str);

        cikarilanKoordinatlar.push(pos);
    });

    return cikarilanKoordinatlar;
};

exports.veriyiPikseleDonustur = function(gd, eksen, kaydirma, dikeyMi, refTipi) {
    var gs = gd._fullLayout._size;
    var veriPiksele;

    if(eksen) {
        if(refTipi === 'domain') {
            veriPiksele = function(v) {
                return eksen._uzunluk * (dikeyMi ? (1 - v) : v) + eksen._offset;
            };
        } else {
            var d2r = exports.sekilPozisyonunuAraligaDonustur(eksen);

            veriPiksele = function(v) {
                var kaydirmaPiksel = pikselKaydirma(eksen, kaydirma);
                return eksen._offset + eksen.r2p(d2r(v, true)) + kaydirmaPiksel;
            };

            if(eksen.tipi === 'date') veriPiksele = exports.tarihiCoz(veriPiksele);
        }
    } else if(dikeyMi) {
        veriPiksele = function(v) { return gs.t + gs.h * (1 - v); };
    } else {
        veriPiksele = function(v) { return gs.l + gs.w * v; };
    }

    return veriPiksele;
};

exports.pikseliVeriyeDonustur = function(gd, eksen, dikeyMi, opt) {
    var gs = gd._fullLayout._size;
    var pikselVeriye;

    if(eksen) {
        if(opt === 'domain') {
            pikselVeriye = function(p) {
                var q = (p - eksen._offset) / eksen._uzunluk;
                return dikeyMi ? 1 - q : q;
            };
        } else {
            var r2d = exports.araligiSekilPozisyonunaDonustur(eksen);
            pikselVeriye = function(p) { return r2d(eksen.p2r(p - eksen._offset)); };
        }
    } else if(dikeyMi) {
        pikselVeriye = function(p) { return 1 - (p - gs.t) / gs.h; };
    } else {
        pikselVeriye = function(p) { return (p - gs.l) / gs.w; };
    }

    return pikselVeriye;
};

/**
 * Verilen çizgi genişliğine göre, geçen pozisyon değerini tam veya yarım piksel
 * olarak yuvarlar.
 *
 * Tek sayı çizgi genişliği durumunda (örneğin 1), bu ölçü, çizginin belirtilen
 * pozisyonda bulanık olmadan render edilmesini sağlar.
 *
 * Çift sayı çizgi genişliği durumunda (örneğin 2), bu ölçü, pozisyon değerinin
 * tam piksel değerine dönüştürülmesini sağlar, böylece anti-aliasing etkisi
 * oluşmaz.
 *
 * @param {number} pos Dönüştürülecek ham pozisyon değeri
 * @param {number} strokeWidth Çizgi genişliği
 * @returns {number} Tam sayı veya .5 ondalık sayı
 */
exports.keskinCizgiCizimiIcinPozisyonuYuvarla = function(pos, strokeWidth) {
    var strokeWidthTekMi = Math.round(strokeWidth % 2) === 1;
    var posDegeriTamSayi = Math.round(pos);

    return strokeWidthTekMi ? posDegeriTamSayi + 0.5 : posDegeriTamSayi;
};

exports.sekillerIcinSeceneklerVeCizimBilgisiOlustur = function(gd, index) {
    var secenekler = gd._fullLayout.shapes[index] || {};

    var cizimBilgisi = gd._fullLayout._plots[secenekler.xref + secenekler.yref];
    var cizimBilgisiVarMi = !!cizimBilgisi;
    if(cizimBilgisiVarMi) {
        cizimBilgisi._hadPlotinfo = true;
    } else {
        cizimBilgisi = {};
        if(secenekler.xref && secenekler.xref !== 'paper') cizimBilgisi.xaxis = gd._fullLayout[secenekler.xref + 'axis'];
        if(secenekler.yref && secenekler.yref !== 'paper') cizimBilgisi.yaxis = gd._fullLayout[secenekler.yref + 'axis'];
    }

    cizimBilgisi.xsizemode = secenekler.xsizemode;
    cizimBilgisi.ysizemode = secenekler.ysizemode;
    cizimBilgisi.xanchor = secenekler.xanchor;
    cizimBilgisi.yanchor = secenekler.yanchor;

    return {
        secenekler: secenekler,
        cizimBilgisi: cizimBilgisi
    };
};

// TODO: seçim yardımcılarına taşı?
exports.secmelerIcinSeceneklerVeCizimBilgisiOlustur = function(gd, index) {
    var secenekler = gd._fullLayout.selections[index] || {};

    var cizimBilgisi = gd._fullLayout._plots[secenekler.xref + secenekler.yref];
    var cizimBilgisiVarMi = !!cizimBilgisi;
    if(cizimBilgisiVarMi) {
        cizimBilgisi._hadPlotinfo = true;
    } else {
        cizimBilgisi = {};
        if(secenekler.xref) cizimBilgisi.xaxis = gd._fullLayout[secenekler.xref + 'axis'];
        if(secenekler.yref) cizimBilgisi.yaxis = gd._fullLayout[secenekler.yref + 'axis'];
    }

    return {
        secenekler: secenekler,
        cizimBilgisi: cizimBilgisi
    };
};

exports.yolDizesiAl = function(gd, secenekler) {
    var tip = secenekler.tip;
    var xRefTipi = Eksenler.getRefType(secenekler.xref);
    var yRefTipi = Eksenler.getRefType(secenekler.yref);
    var xa = Eksenler.getFromId(gd, secenekler.xref);
    var ya = Eksenler.getFromId(gd, secenekler.yref);
    var gs = gd._fullLayout._size;
    var x2r, x2p, y2r, y2p;
    var xKaydirmaBaslangic = pikselKaydirma(xa, secenekler.x0shift);
    var xKaydirmaBitis = pikselKaydirma(xa, secenekler.x1shift);
    var yKaydirmaBaslangic = pikselKaydirma(ya, secenekler.y0shift);
    var yKaydirmaBitis = pikselKaydirma(ya, secenekler.y1shift);
    var x0, x1, y0, y1;

    if(xa) {
        if(xRefTipi === 'domain') {
            x2p = function(v) { return xa._offset + xa._uzunluk * v; };
        } else {
            x2r = exports.sekilPozisyonunuAraligaDonustur(xa);
            x2p = function(v) { return xa._offset + xa.r2p(x2r(v, true)); };
        }
    } else {
        x2p = function(v) { return gs.l + gs.w * v; };
    }

    if(ya) {
        if(yRefTipi === 'domain') {
            y2p = function(v) { return ya._offset + ya._uzunluk * (1 - v); };
        } else {
            y2r = exports.sekilPozisyonunuAraligaDonustur(ya);
            y2p = function(v) { return ya._offset + ya.r2p(y2r(v, true)); };
        }
    } else {
        y2p = function(v) { return gs.t + gs.h * (1 - v); };
    }

    if(tip === 'path') {
        if(xa && xa.tipi === 'date') x2p = exports.tarihiCoz(x2p);
        if(ya && ya.tipi === 'date') y2p = exports.tarihiCoz(y2p);
        return yoluDonustur(secenekler, x2p, y2p);
    }
    if(secenekler.xsizemode === 'pixel') {
        var xAnchorPos = x2p(secenekler.xanchor);
        x0 = xAnchorPos + secenekler.x0 + xKaydirmaBaslangic;
        x1 = xAnchorPos + secenekler.x1 + xKaydirmaBitis;
    } else {
        x0 = x2p(secenekler.x0) + xKaydirmaBaslangic;
        x1 = x2p(secenekler.x1) + xKaydirmaBitis;
    }

    if(secenekler.ysizemode === 'pixel') {
        var yAnchorPos = y2p(secenekler.yanchor);
        y0 = yAnchorPos - secenekler.y0 + yKaydirmaBaslangic;
        y1 = yAnchorPos - secenekler.y1 + yKaydirmaBitis;
    } else {
        y0 = y2p(secenekler.y0) + yKaydirmaBaslangic;
        y1 = y2p(secenekler.y1) + yKaydirmaBitis;
    }

    if(tip === 'line') return 'M' + x0 + ',' + y0 + 'L' + x1 + ',' + y1;
    if(tip === 'rect') return 'M' + x0 + ',' + y0 + 'H' + x1 + 'V' + y1 + 'H' + x0 + 'Z';

    // daire
    var cx = (x0 + x1) / 2;
    var cy = (y0 + y1) / 2;
    var rx = Math.abs(cx - x0);
    var ry = Math.abs(cy - y0);
    var rArc = 'A' + rx + ',' + ry;
    var sagNokta = (cx + rx) + ',' + cy;
    var ustNokta = cx + ',' + (cy - ry);
    return 'M' + sagNokta + rArc + ' 0 1,1 ' + ustNokta +
        rArc + ' 0 0,1 ' + sagNokta + 'Z';
};

function yoluDonustur(secenekler, x2p, y2p) {
    var yolIn = secenekler.path;
    var xSizemode = secenekler.xsizemode;
    var ySizemode = secenekler.ysizemode;
    var xAnchor = secenekler.xanchor;
    var yAnchor = secenekler.yanchor;

    return yolIn.replace(sabitler.segmentRE, function(segment) {
        var parametreNumarasi = 0;
        var segmentTipi = segment.charAt(0);
        var xParametreler = sabitler.paramIsX[segmentTipi];
        var yParametreler = sabitler.paramIsY[segmentTipi];
        var nParametreler = sabitler.numParams[segmentTipi];

        var parametreDizesi = segment.substr(1).replace(sabitler.paramRE, function(param) {
            if(xParametreler[parametreNumarasi]) {
                if(xSizemode === 'pixel') param = x2p(xAnchor) + Number(param);
                else param = x2p(param);
            } else if(yParametreler[parametreNumarasi]) {
                if(ySizemode === 'pixel') param = y2p(yAnchor) - Number(param);
                else param = y2p(param);
            }
            parametreNumarasi++;

            if(parametreNumarasi > nParametreler) param = 'X';
            return param;
        });

        if(parametreNumarasi > nParametreler) {
            parametreDizesi = parametreDizesi.replace(/[\s,]*X.*/, '');
            Lib.log('Segment ' + segment + ' içindeki ekstra parametreler göz ardı ediliyor');
        }

        return segmentTipi + parametreDizesi;
    });
}

function pikselKaydirma(eksen, kaydirma) {
    kaydirma = kaydirma || 0;
    var kaydirmaPiksel = 0;
    if(kaydirma && eksen && (eksen.tipi === 'category' || eksen.tipi === 'multicategory')) {
        kaydirmaPiksel = (eksen.r2p(1) - eksen.r2p(0)) * kaydirma;
    }
    return kaydirmaPiksel;
}
