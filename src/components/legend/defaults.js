'use strict';

var Kayıt = require('../../registry');
var Kütüphane = require('../../lib');
var Şablon = require('../../plot_api/plot_template');

var grafikÖznitelikleri = require('../../plots/attributes');
var öznitelikler = require('./attributes');
var temelGrafikYerleşimÖznitelikleri = require('../../plots/layout_attributes');
var yardımcılar = require('./helpers');

function grupVarsayılanları(legendId, yerleşimGiriş, yerleşimÇıkış, tamVeri) {
    var konteynerGiriş = yerleşimGiriş[legendId] || {};
    var konteynerÇıkış = Şablon.yeniKonteyner(yerleşimÇıkış, legendId);

    function zorla(attr, varsayılan) {
        return Kütüphane.zorla(konteynerGiriş, konteynerÇıkış, öznitelikler, attr, varsayılan);
    }

    // Not: Birleşik hover, legend.visible false olsa bile font, arkaplan rengi ve kenarlık renginden miras almalıdır
    var öğeFontu = Kütüphane.zorlaFont(zorla, 'font', yerleşimÇıkış.font);
    zorla('bgcolor', yerleşimÇıkış.paper_bgcolor);
    zorla('bordercolor');

    var görünür = zorla('visible');
    if(!görünür) return;

    var iz;
    var izZorla = function(attr, varsayılan) {
        var izGiriş = iz._giriş;
        var izÇıkış = iz;
        return Kütüphane.zorla(izGiriş, izÇıkış, grafikÖznitelikleri, attr, varsayılan);
    };

    var genelFont = yerleşimÇıkış.font || {};
    var grupBaşlıkFontu = Kütüphane.zorlaFont(zorla, 'grouptitlefont', genelFont, { overrideDflt: {
        size: Math.round(genelFont.size * 1.1)
    }});

    var legendIzSayısı = 0;
    var legendGerçektenBirIzVar = false;
    var varsayılanSıra = 'normal';

    var legendliŞekiller = (yerleşimÇıkış.shapes || []).filter(function(d) { return d.showlegend; });

    var tümLegendÖğeleri = tamVeri.concat(legendliŞekiller).filter(function(d) {
        return legendId === (d.legend || 'legend');
    });

    for(var i = 0; i < tümLegendÖğeleri.length; i++) {
        iz = tümLegendÖğeleri[i];

        if(!iz.visible) continue;

        var şekilMi = iz._isShape;

        if(iz.showlegend || (
            iz._dfltShowLegend && !(
                iz._module &&
                iz._module.attributes &&
                iz._module.attributes.showlegend &&
                iz._module.attributes.showlegend.dflt === false
            )
        )) {
            legendIzSayısı++;
            if(iz.showlegend) {
                legendGerçektenBirIzVar = true;
                if(!şekilMi && Kayıt.izMi(iz, 'pie-like') ||
                    iz._giriş.showlegend === true
                ) {
                    legendIzSayısı++;
                }
            }

            Kütüphane.zorlaFont(izZorla, 'legendgrouptitle.font', grupBaşlıkFontu);
        }

        if((!şekilMi && Kayıt.izMi(iz, 'bar') && yerleşimÇıkış.barmode === 'stack') ||
                ['tonextx', 'tonexty'].indexOf(iz.fill) !== -1) {
            varsayılanSıra = yardımcılar.gruplandırılmışMı({traceorder: varsayılanSıra}) ?
                'grouped+reversed' : 'reversed';
        }

        if(iz.legendgroup !== undefined && iz.legendgroup !== '') {
            varsayılanSıra = yardımcılar.tersMi({traceorder: varsayılanSıra}) ?
                'reversed+grouped' : 'grouped';
        }
    }

    var legendGöster = Kütüphane.zorla(yerleşimGiriş, yerleşimÇıkış,
        temelGrafikYerleşimÖznitelikleri, 'showlegend',
        legendGerçektenBirIzVar && (legendIzSayısı > (legendId === 'legend' ? 1 : 0)));

    if(legendGöster === false) yerleşimÇıkış[legendId] = undefined;

    if(legendGöster === false && !konteynerGiriş.uirevision) return;

    zorla('uirevision', yerleşimÇıkış.uirevision);

    if(legendGöster === false) return;

    zorla('borderwidth');

    var yön = zorla('orientation');

    var yref = zorla('yref');
    var xref = zorla('xref');

    var yatayMı = yön === 'h';
    var kağıtYMi = yref === 'paper';
    var kağıtXMi = xref === 'paper';
    var varsayılanX, varsayılanY, varsayılanYAnchor;
    var varsayılanXAnchor = 'left';

    if(yatayMı) {
        varsayılanX = 0;

        if(Kayıt.getComponentMethod('rangeslider', 'isVisible')(yerleşimGiriş.xaxis)) {
            if(kağıtYMi) {
                varsayılanY = 1.1;
                varsayılanYAnchor = 'bottom';
            } else {
                varsayılanY = 1;
                varsayılanYAnchor = 'top';
            }
        } else {
            if(kağıtYMi) {
                varsayılanY = -0.1;
                varsayılanYAnchor = 'top';
            } else {
                varsayılanY = 0;
                varsayılanYAnchor = 'bottom';
            }
        }
    } else {
        varsayılanY = 1;
        varsayılanYAnchor = 'auto';
        if(kağıtXMi) {
            varsayılanX = 1.02;
        } else {
            varsayılanX = 1;
            varsayılanXAnchor = 'right';
        }
    }

    Kütüphane.zorla(konteynerGiriş, konteynerÇıkış, {
        x: {
            valType: 'number',
            editType: 'legend',
            min: kağıtXMi ? -2 : 0,
            max: kağıtXMi ? 3 : 1,
            dflt: varsayılanX,
        }
    }, 'x');

    Kütüphane.zorla(konteynerGiriş, konteynerÇıkış, {
        y: {
            valType: 'number',
            editType: 'legend',
            min: kağıtYMi ? -2 : 0,
            max: kağıtYMi ? 3 : 1,
            dflt: varsayılanY,
        }
    }, 'y');

    zorla('traceorder', varsayılanSıra);
    if(yardımcılar.gruplandırılmışMı(yerleşimÇıkış[legendId])) zorla('tracegroupgap');

    zorla('entrywidth');
    zorla('entrywidthmode');
    zorla('indentation');
    zorla('itemsizing');
    zorla('itemwidth');

    zorla('itemclick');
    zorla('itemdoubleclick');
    zorla('groupclick');

    zorla('xanchor', varsayılanXAnchor);
    zorla('yanchor', varsayılanYAnchor);
    zorla('valign');
    Kütüphane.noneOrAll(konteynerGiriş, konteynerÇıkış, ['x', 'y']);

    var başlıkMetni = zorla('title.text');
    if(başlıkMetni) {
        zorla('title.side', yatayMı ? 'left' : 'top');
        var varsayılanBaşlıkFontu = Kütüphane.extendFlat({}, öğeFontu, {
            size: Kütüphane.büyükFont(öğeFontu.size)
        });

        Kütüphane.zorlaFont(zorla, 'title.font', varsayılanBaşlıkFontu);
    }
}

module.exports = function legendVarsayılanları(yerleşimGiriş, yerleşimÇıkış, tamVeri) {
    var i;

    var tümLegendVerileri = tamVeri.slice();

    var şekiller = yerleşimÇıkış.shapes;
    if(şekiller) {
        for(i = 0; i < şekiller.length; i++) {
            var şekil = şekiller[i];
            if(!şekil.showlegend) continue;

            var sahteIz = {
                _giriş: şekil._giriş,
                visible: şekil.visible,
                showlegend: şekil.showlegend,
                legend: şekil.legend
            };

            tümLegendVerileri.push(sahteIz);
        }
    }

    var legendler = ['legend'];
    for(i = 0; i < tümLegendVerileri.length; i++) {
        Kütüphane.pushUnique(legendler, tümLegendVerileri[i].legend);
    }

    yerleşimÇıkış._legends = [];
    for(i = 0; i < legendler.length; i++) {
        var legendId = legendler[i];

        grupVarsayılanları(legendId, yerleşimGiriş, yerleşimÇıkış, tümLegendVerileri);

        if(
            yerleşimÇıkış[legendId] &&
            yerleşimÇıkış[legendId].visible
        ) {
            yerleşimÇıkış[legendId]._id = legendId;
        }

        yerleşimÇıkış._legends.push(legendId);
    }
};
