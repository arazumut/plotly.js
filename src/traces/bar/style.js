'use strict';

var d3 = require('@plotly/d3');
var Renk = require('../../components/color');
var Çizim = require('../../components/drawing');
var Lib = require('../../lib');
var Kayıt = require('../../registry');

var metinBoyutunuYenidenBoyutlandır = require('./uniform_text').resizeText;
var özellikler = require('./attributes');
var özellikMetinFontu = özellikler.textfont;
var özellikİçMetinFontu = özellikler.insidetextfont;
var özellikDışMetinFontu = özellikler.outsidetextfont;
var yardımcılar = require('./helpers');

function stil(gd) {
    var s = d3.select(gd).selectAll('g[class^="barlayer"]').selectAll('g.trace');
    metinBoyutunuYenidenBoyutlandır(gd, s, 'bar');

    var barSayısı = s.size();
    var tamYerleşim = gd._fullLayout;

    // iz stilini ayarla
    s.style('opacity', function(d) { return d[0].trace.opacity; })

    // boşluksuz (ya istiflenmiş ya da komşu gruplandırılmış) çubuklar için
    // antialiasing'i kapatmak için crispEdges kullanın, böylece yapay bir boşluk
    // oluşturulmaz.
    .each(function(d) {
        if((tamYerleşim.barmode === 'stack' && barSayısı > 1) ||
                (tamYerleşim.bargap === 0 &&
                 tamYerleşim.bargroupgap === 0 &&
                 !d[0].trace.marker.line.width)) {
            d3.select(this).attr('shape-rendering', 'crispEdges');
        }
    });

    s.selectAll('g.points').each(function(d) {
        var sel = d3.select(this);
        var iz = d[0].trace;
        noktalarıStilizeEt(sel, iz, gd);
    });

    Kayıt.getComponentMethod('errorbars', 'style')(s);
}

function noktalarıStilizeEt(sel, iz, gd) {
    Çizim.noktaStili(sel.selectAll('path'), iz, gd);
    metinNoktalarınıStilizeEt(sel, iz, gd);
}

function metinNoktalarınıStilizeEt(sel, iz, gd) {
    sel.selectAll('text').each(function(d) {
        var tx = d3.select(this);
        var font = Lib.ensureUniformFontSize(gd, fontuBelirle(tx, d, iz, gd));

        Çizim.font(tx, font);
    });
}

function seçildiğindeStilizeEt(gd, cd, sel) {
    var iz = cd[0].trace;

    if(iz.selectedpoints) {
        seçimModundaNoktalarıStilizeEt(sel, iz, gd);
    } else {
        noktalarıStilizeEt(sel, iz, gd);
        Kayıt.getComponentMethod('errorbars', 'style')(sel);
    }
}

function seçimModundaNoktalarıStilizeEt(s, iz, gd) {
    Çizim.seçiliNoktaStili(s.selectAll('path'), iz);
    seçimModundaMetinStilizeEt(s.selectAll('text'), iz, gd);
}

function seçimModundaMetinStilizeEt(txs, iz, gd) {
    txs.each(function(d) {
        var tx = d3.select(this);
        var font;

        if(d.selected) {
            font = Lib.ensureUniformFontSize(gd, fontuBelirle(tx, d, iz, gd));

            var seçiliFontRengi = iz.selected.textfont && iz.selected.textfont.color;
            if(seçiliFontRengi) {
                font.color = seçiliFontRengi;
            }

            Çizim.font(tx, font);
        } else {
            Çizim.seçiliMetinStili(tx, iz);
        }
    });
}

function fontuBelirle(tx, d, iz, gd) {
    var yerleşimFontu = gd._fullLayout.font;
    var metinFontu = iz.textfont;

    if(tx.classed('bartext-inside')) {
        var çubukRengi = çubukRenginiAl(d, iz);
        metinFontu = içMetinFontunuAl(iz, d.i, yerleşimFontu, çubukRengi);
    } else if(tx.classed('bartext-outside')) {
        metinFontu = dışMetinFontunuAl(iz, d.i, yerleşimFontu);
    }

    return metinFontu;
}

function metinFontunuAl(iz, index, varsayılanDeğer) {
    return fontDeğeriniAl(
      özellikMetinFontu, iz.textfont, index, varsayılanDeğer);
}

function içMetinFontunuAl(iz, index, yerleşimFontu, çubukRengi) {
    var varsayılanFont = metinFontunuAl(iz, index, yerleşimFontu);

    var yerleşimFontunaGeriDönecek =
      (iz._input.textfont === undefined || iz._input.textfont.color === undefined) ||
      (Array.isArray(iz.textfont.color) && iz.textfont.color[index] === undefined);
    if(yerleşimFontunaGeriDönecek) {
        varsayılanFont = {
            color: Renk.kontrast(çubukRengi),
            family: varsayılanFont.family,
            size: varsayılanFont.size,
            weight: varsayılanFont.weight,
            style: varsayılanFont.style,
            variant: varsayılanFont.variant,
            textcase: varsayılanFont.textcase,
            lineposition: varsayılanFont.lineposition,
            shadow: varsayılanFont.shadow,
        };
    }

    return fontDeğeriniAl(
      özellikİçMetinFontu, iz.insidetextfont, index, varsayılanFont);
}

function dışMetinFontunuAl(iz, index, yerleşimFontu) {
    var varsayılanFont = metinFontunuAl(iz, index, yerleşimFontu);
    return fontDeğeriniAl(
      özellikDışMetinFontu, iz.outsidetextfont, index, varsayılanFont);
}

function fontDeğeriniAl(özellikTanımı, özellikDeğeri, index, varsayılanDeğer) {
    özellikDeğeri = özellikDeğeri || {};

    var familyDeğeri = yardımcılar.değeriAl(özellikDeğeri.family, index);
    var sizeDeğeri = yardımcılar.değeriAl(özellikDeğeri.size, index);
    var colorDeğeri = yardımcılar.değeriAl(özellikDeğeri.color, index);
    var weightDeğeri = yardımcılar.değeriAl(özellikDeğeri.weight, index);
    var styleDeğeri = yardımcılar.değeriAl(özellikDeğeri.style, index);
    var variantDeğeri = yardımcılar.değeriAl(özellikDeğeri.variant, index);
    var textcaseDeğeri = yardımcılar.değeriAl(özellikDeğeri.textcase, index);
    var linepositionDeğeri = yardımcılar.değeriAl(özellikDeğeri.lineposition, index);
    var shadowDeğeri = yardımcılar.değeriAl(özellikDeğeri.shadow, index);

    return {
        family: yardımcılar.stringZorla(
          özellikTanımı.family, familyDeğeri, varsayılanDeğer.family),
        size: yardımcılar.numberZorla(
          özellikTanımı.size, sizeDeğeri, varsayılanDeğer.size),
        color: yardımcılar.colorZorla(
          özellikTanımı.color, colorDeğeri, varsayılanDeğer.color),
        weight: yardımcılar.stringZorla(
            özellikTanımı.weight, weightDeğeri, varsayılanDeğer.weight),
        style: yardımcılar.stringZorla(
            özellikTanımı.style, styleDeğeri, varsayılanDeğer.style),
        variant: yardımcılar.stringZorla(
            özellikTanımı.variant, variantDeğeri, varsayılanDeğer.variant),
        textcase: yardımcılar.stringZorla(
            özellikTanımı.variant, textcaseDeğeri, varsayılanDeğer.textcase),
        lineposition: yardımcılar.stringZorla(
            özellikTanımı.variant, linepositionDeğeri, varsayılanDeğer.lineposition),
        shadow: yardımcılar.stringZorla(
            özellikTanımı.variant, shadowDeğeri, varsayılanDeğer.shadow),
    };
}

function çubukRenginiAl(cd, iz) {
    if(iz.type === 'waterfall') {
        return iz[cd.dir].marker.color;
    }
    return cd.mcc || cd.mc || iz.marker.color;
}

module.exports = {
    stil: stil,
    metinNoktalarınıStilizeEt: metinNoktalarınıStilizeEt,
    seçildiğindeStilizeEt: seçildiğindeStilizeEt,
    içMetinFontunuAl: içMetinFontunuAl,
    dışMetinFontunuAl: dışMetinFontunuAl,
    çubukRenginiAl: çubukRenginiAl,
    metinBoyutunuYenidenBoyutlandır: metinBoyutunuYenidenBoyutlandır
};
