'use strict';

var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');
var svgTextUtils = require('../../lib/svg_text_utils');

var Drawing = require('../drawing');

var readPaths = require('./draw_newshape/helpers').readPaths;
var helpers = require('./helpers');
var getPathString = helpers.getPathString;
var shapeLabelTexttemplateVars = require('./label_texttemplate');

var FROM_TL = require('../../constants/alignment').FROM_TL;

module.exports = function etiketÇiz(gd, index, seçenekler, şekilGrubu) {
    // Mevcut etiketi kaldır
    şekilGrubu.selectAll('.shape-label').remove();

    // Eğer etiket metni veya metin şablonu yoksa, geri dön
    if(!(seçenekler.label.text || seçenekler.label.texttemplate)) return;

    // Metin şablonu metni geçersiz kılar
    var metin;
    if(seçenekler.label.texttemplate) {
        var şablonDeğerleri = {};
        if(seçenekler.type !== 'path') {
            var _xa = Axes.getFromId(gd, seçenekler.xref);
            var _ya = Axes.getFromId(gd, seçenekler.yref);
            for(var anahtar in shapeLabelTexttemplateVars) {
                var değer = shapeLabelTexttemplateVars[anahtar](seçenekler, _xa, _ya);
                if(değer !== undefined) şablonDeğerleri[anahtar] = değer;
            }
        }
        metin = Lib.texttemplateStringForShapes(seçenekler.label.texttemplate,
            {},
            gd._fullLayout._d3locale,
            şablonDeğerleri);
    } else {
        metin = seçenekler.label.text;
    }

    var etiketGrupÖzellikleri = {
        'data-index': index,
    };
    var yazıTipi = seçenekler.label.font;

    var etiketMetinÖzellikleri = {
        'data-notex': 1
    };

    var etiketGrubu = şekilGrubu.append('g')
        .attr(etiketGrupÖzellikleri)
        .classed('shape-label', true);
    var etiketMetni = etiketGrubu.append('text')
        .attr(etiketMetinÖzellikleri)
        .classed('shape-label-text', true)
        .text(metin);

    // Şeklin x ve y sınırlarını al
    var şekilx0, şekilx1, şekily0, şekily1;
    if(seçenekler.path) {
        // Eğer şekil bir yol olarak tanımlanmışsa,
        // yoldaki tüm çokgenler arasında min ve max sınırları al
        var d = getPathString(gd, seçenekler);
        var çokgenler = readPaths(d, gd);
        şekilx0 = Infinity;
        şekily0 = Infinity;
        şekilx1 = -Infinity;
        şekily1 = -Infinity;
        for(var i = 0; i < çokgenler.length; i++) {
            for(var j = 0; j < çokgenler[i].length; j++) {
                var p = çokgenler[i][j];
                for(var k = 1; k < p.length; k += 2) {
                    var _x = p[k];
                    var _y = p[k + 1];

                    şekilx0 = Math.min(şekilx0, _x);
                    şekilx1 = Math.max(şekilx1, _x);
                    şekily0 = Math.min(şekily0, _y);
                    şekily1 = Math.max(şekily1, _y);
                }
            }
        }
    } else {
        // Aksi takdirde, şekil seçeneklerinde tanımlanan x ve y sınırlarını kullanırız
        // ve bunları piksel koordinatlarına dönüştürürüz
        // Dönüşüm fonksiyonlarını ayarla
        var xa = Axes.getFromId(gd, seçenekler.xref);
        var xShiftStart = seçenekler.x0shift;
        var xShiftEnd = seçenekler.x1shift;
        var xRefType = Axes.getRefType(seçenekler.xref);
        var ya = Axes.getFromId(gd, seçenekler.yref);
        var yShiftStart = seçenekler.y0shift;
        var yShiftEnd = seçenekler.y1shift;
        var yRefType = Axes.getRefType(seçenekler.yref);
        var x2p = function(v, shift) {
            var dataToPixel = helpers.getDataToPixel(gd, xa, shift, false, xRefType);
            return dataToPixel(v);
        };
        var y2p = function(v, shift) {
            var dataToPixel = helpers.getDataToPixel(gd, ya, shift, true, yRefType);
            return dataToPixel(v);
        };
        şekilx0 = x2p(seçenekler.x0, xShiftStart);
        şekilx1 = x2p(seçenekler.x1, xShiftEnd);
        şekily0 = y2p(seçenekler.y0, yShiftStart);
        şekily1 = y2p(seçenekler.y1, yShiftEnd);
    }

    // `auto` açısını işle
    var metinAçısı = seçenekler.label.textangle;
    if(metinAçısı === 'auto') {
        if(seçenekler.type === 'line') {
            // Çizgi için otomatik açı, çizgi ile aynı açıdır
            metinAçısı = metinAçısınıHesapla(şekilx0, şekily0, şekilx1, şekily1);
        } else {
            // Diğer tüm şekiller için otomatik açı 0'dır
            metinAçısı = 0;
        }
    }

    // Metin sınır kutusu yüksekliğini almak için ilk render yap
    etiketMetni.call(function(s) {
        s.call(Drawing.font, yazıTipi).attr({});
        svgTextUtils.convertToTspans(s, gd);
        return s;
    });
    var metinBB = Drawing.bBox(etiketMetni.node());

    // Metin için doğru (x,y) hesapla
    // Ayrıca gerçek xanchor'ı belirleriz çünkü xanchor pozisyona bağlı olarak `auto` olarak ayarlanır
    var metinPozisyonu = metinPozisyonunuHesapla(şekilx0, şekily0, şekilx1, şekily1, seçenekler, metinAçısı, metinBB);
    var metinx = metinPozisyonu.metinX;
    var metiny = metinPozisyonu.metinY;
    var xanchor = metinPozisyonu.xanchor;

    // (x,y) pozisyonunu, xanchor'ı ve açıyı güncelle
    etiketMetni.attr({
        'text-anchor': {
            left: 'start',
            center: 'middle',
            right: 'end'
        }[xanchor],
        y: metiny,
        x: metinx,
        transform: 'rotate(' + metinAçısı + ',' + metinx + ',' + metiny + ')'
    }).call(svgTextUtils.positionText, metinx, metiny);
};

function metinAçısınıHesapla(şekilx0, şekily0, şekilx1, şekily1) {
    var dy, dx;
    dx = Math.abs(şekilx1 - şekilx0);
    if(şekilx1 >= şekilx0) {
        dy = şekily0 - şekily1;
    } else {
        dy = şekily1 - şekily0;
    }
    return -180 / Math.PI * Math.atan2(dy, dx);
}

function metinPozisyonunuHesapla(şekilx0, şekily0, şekilx1, şekily1, şekilSeçenekleri, gerçekMetinAçısı, metinBB) {
    var metinPozisyonu = şekilSeçenekleri.label.textposition;
    var metinAçısı = şekilSeçenekleri.label.textangle;
    var metinPadding = şekilSeçenekleri.label.padding;
    var şekilTipi = şekilSeçenekleri.type;
    var metinAçısıRad = Math.PI / 180 * gerçekMetinAçısı;
    var sinA = Math.sin(metinAçısıRad);
    var cosA = Math.cos(metinAçısıRad);
    var xanchor = şekilSeçenekleri.label.xanchor;
    var yanchor = şekilSeçenekleri.label.yanchor;

    var metinx, metiny, paddingX, paddingY;

    // Metin pozisyonu çizgiler için diğer şekillere göre farklı çalışır
    if(şekilTipi === 'line') {
        // Çizginin başlangıcı, ortası veya sonu için temel pozisyonu ayarla (varsayılan 'center')
        if(metinPozisyonu === 'start') {
            metinx = şekilx0;
            metiny = şekily0;
        } else if(metinPozisyonu === 'end') {
            metinx = şekilx1;
            metiny = şekily1;
        } else { // Varsayılan: center
            metinx = (şekilx0 + şekilx1) / 2;
            metiny = (şekily0 + şekily1) / 2;
        }

        // xanchor'ı ayarla eğer xanchor 'auto' ise
        if(xanchor === 'auto') {
            if(metinPozisyonu === 'start') {
                if(metinAçısı === 'auto') {
                    if(şekilx1 > şekilx0) xanchor = 'left';
                    else if(şekilx1 < şekilx0) xanchor = 'right';
                    else xanchor = 'center';
                } else {
                    if(şekilx1 > şekilx0) xanchor = 'right';
                    else if(şekilx1 < şekilx0) xanchor = 'left';
                    else xanchor = 'center';
                }
            } else if(metinPozisyonu === 'end') {
                if(metinAçısı === 'auto') {
                    if(şekilx1 > şekilx0) xanchor = 'right';
                    else if(şekilx1 < şekilx0) xanchor = 'left';
                    else xanchor = 'center';
                } else {
                    if(şekilx1 > şekilx0) xanchor = 'left';
                    else if(şekilx1 < şekilx0) xanchor = 'right';
                    else xanchor = 'center';
                }
            } else {
                xanchor = 'center';
            }
        }

        // Çizgiler için açı 'auto' olduğunda özel durum
        // Bu durumda padding, dikey bir offset olarak ele alınmalıdır
        // Aksi takdirde, padding basit bir x ve y offsetidir
        var paddingConstantsX = { left: 1, center: 0, right: -1 };
        var paddingConstantsY = { bottom: -1, middle: 0, top: 1 };
        if(metinAçısı === 'auto') {
            // Padding uygulanacak yönü ayarla (`yanchor`a göre)
            var paddingDirection = paddingConstantsY[yanchor];
            paddingX = -metinPadding * sinA * paddingDirection;
            paddingY = metinPadding * cosA * paddingDirection;
        } else {
            // Padding uygulanacak yönü ayarla (`xanchor` ve `yanchor`a göre)
            var paddingDirectionX = paddingConstantsX[xanchor];
            var paddingDirectionY = paddingConstantsY[yanchor];
            paddingX = metinPadding * paddingDirectionX;
            paddingY = metinPadding * paddingDirectionY;
        }
        metinx = metinx + paddingX;
        metiny = metiny + paddingY;
    } else {
        // Çizgi olmayan şekiller için metin pozisyonu
        // yatay pozisyonu hesapla
        // Yatay, dengeli görünmesi için biraz ekstra padding gerektirir
        paddingX = metinPadding + 3;
        if(metinPozisyonu.indexOf('right') !== -1) {
            metinx = Math.max(şekilx0, şekilx1) - paddingX;
            if(xanchor === 'auto') xanchor = 'right';
        } else if(metinPozisyonu.indexOf('left') !== -1) {
            metinx = Math.min(şekilx0, şekilx1) + paddingX;
            if(xanchor === 'auto') xanchor = 'left';
        } else { // Varsayılan: center
            metinx = (şekilx0 + şekilx1) / 2;
            if(xanchor === 'auto') xanchor = 'center';
        }

        // dikey pozisyonu hesapla
        if(metinPozisyonu.indexOf('top') !== -1) {
            metiny = Math.min(şekily0, şekily1);
        } else if(metinPozisyonu.indexOf('bottom') !== -1) {
            metiny = Math.max(şekily0, şekily1);
        } else {
            metiny = (şekily0 + şekily1) / 2;
        }
        // Padding uygula
        paddingY = metinPadding;
        if(yanchor === 'bottom') {
            metiny = metiny - paddingY;
        } else if(yanchor === 'top') {
            metiny = metiny + paddingY;
        }
    }

    // `yanchor`a göre dikey (& yatay) pozisyonu kaydır
    var shiftFraction = FROM_TL[yanchor];
    // Metnin ilk satırının üst kısmına değil, ilk satırın temel çizgisine sabitlenmesi için ayarla
    var baselineAdjust = şekilSeçenekleri.label.font.size;
    var metinYüksekliği = metinBB.height;
    var xshift = (metinYüksekliği * shiftFraction - baselineAdjust) * sinA;
    var yshift = -(metinYüksekliği * shiftFraction - baselineAdjust) * cosA;

    return { metinX: metinx + xshift, metinY: metiny + yshift, xanchor: xanchor };
}
