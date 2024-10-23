'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Color = require('../../components/color');
var Registry = require('../../registry');

var handleXYDefaults = require('../scatter/xy_defaults');
var handlePeriodDefaults = require('../scatter/period_defaults');
var handleStyleDefaults = require('./style_defaults');
var handleGroupingDefaults = require('../scatter/grouping_defaults');
var attributes = require('./attributes');

var coerceFont = Lib.coerceFont;

function varsayılanlarıSağla(traceIn, traceOut, varsayılanRenk, layout) {
    function zorla(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    var uzunluk = handleXYDefaults(traceIn, traceOut, layout, zorla);
    if(!uzunluk) {
        traceOut.visible = false;
        return;
    }

    handlePeriodDefaults(traceIn, traceOut, layout, zorla);
    zorla('xhoverformat');
    zorla('yhoverformat');

    zorla('zorder');

    zorla('orientation', (traceOut.x && !traceOut.y) ? 'h' : 'v');
    zorla('base');
    zorla('offset');
    zorla('width');

    zorla('text');
    zorla('hovertext');
    zorla('hovertemplate');

    var textposition = zorla('textposition');
    metniEle(traceIn, traceOut, layout, zorla, textposition, {
        moduleHasSelected: true,
        moduleHasUnselected: true,
        moduleHasConstrain: true,
        moduleHasCliponaxis: true,
        moduleHasTextangle: true,
        moduleHasInsideanchor: true
    });

    handleStyleDefaults(traceIn, traceOut, zorla, varsayılanRenk, layout);
    var lineColor = (traceOut.marker.line || {}).color;

    // Hata çubukları için varsayılan rengi defaultLine ile geçersiz kıl
    var errorBarsSupplyDefaults = Registry.getComponentMethod('errorbars', 'supplyDefaults');
    errorBarsSupplyDefaults(traceIn, traceOut, lineColor || Color.defaultLine, {axis: 'y'});
    errorBarsSupplyDefaults(traceIn, traceOut, lineColor || Color.defaultLine, {axis: 'x', inherit: 'y'});

    Lib.coerceSelectionMarkerOpacity(traceOut, zorla);
}

function çaprazİzVarsayılanları(fullData, fullLayout) {
    var traceIn, traceOut;

    function zorla(attr, dflt) {
        return Lib.coerce(traceOut._input, traceOut, attributes, attr, dflt);
    }

    for(var i = 0; i < fullData.length; i++) {
        traceOut = fullData[i];

        if(traceOut.type === 'bar') {
            traceIn = traceOut._input;
            // `marker.cornerradius` handleStyleDefaults() içinde değil burada zorlanmalı
            // çünkü `layout.barcornerradius` zorlandıktan sonra yapılması gerekiyor
            var r = zorla('marker.cornerradius', fullLayout.barcornerradius);
            if(traceOut.marker) {
                traceOut.marker.cornerradius = köşeYarıçapınıDoğrula(r);
            }

            if(fullLayout.barmode === 'group') {
                handleGroupingDefaults(traceIn, traceOut, fullLayout, zorla);
            }
        }
    }
}

// Verilen köşe yarıçapı değerine eşdeğer bir değer döndürür, eğer geçerliyse;
// aksi takdirde `undefined` döner.
// Geçerli köşe yarıçapı değerleri şunlar olmalıdır:
//   - >= 0 olan sayısal bir değer (string veya sayı), veya
//   - >= 0 olan bir sayı ve ardından % işareti içeren bir string
// Verilen köşe yarıçapı değeri sayısal bir string ise, bir sayıya dönüştürülecektir.
function köşeYarıçapınıDoğrula(r) {
    if(isNumeric(r)) {
        r = +r;
        if(r >= 0) return r;
    } else if(typeof r === 'string') {
        r = r.trim();
        if(r.slice(-1) === '%' && isNumeric(r.slice(0, -1))) {
            r = +r.slice(0, -1);
            if(r >= 0) return r + '%';
        }
    }
    return undefined;
}

function metniEle(traceIn, traceOut, layout, zorla, textposition, opts) {
    opts = opts || {};
    var moduleHasSelected = !(opts.moduleHasSelected === false);
    var moduleHasUnselected = !(opts.moduleHasUnselected === false);
    var moduleHasConstrain = !(opts.moduleHasConstrain === false);
    var moduleHasCliponaxis = !(opts.moduleHasCliponaxis === false);
    var moduleHasTextangle = !(opts.moduleHasTextangle === false);
    var moduleHasInsideanchor = !(opts.moduleHasInsideanchor === false);
    var hasPathbar = !!opts.hasPathbar;

    var hasBoth = Array.isArray(textposition) || textposition === 'auto';
    var hasInside = hasBoth || textposition === 'inside';
    var hasOutside = hasBoth || textposition === 'outside';

    if(hasInside || hasOutside) {
        var varsayılanFont = coerceFont(zorla, 'textfont', layout.font);

        // `insidetextfont`'un zorlanması her zaman gereklidir –
        // her iz için `textposition` `outside` olsa bile –
        // çünkü bir dış etiket, örneğin üzerine bir çubuk yığıldığı için
        // iç etiket haline gelebilir.
        var içMetinFontVarsayılan = Lib.extendFlat({}, varsayılanFont);
        var izMetinFontRengiAyarlandı = traceIn.textfont && traceIn.textfont.color;
        var renkLayoutFonttanMirasAlındı = !izMetinFontRengiAyarlandı;
        if(renkLayoutFonttanMirasAlındı) {
            delete içMetinFontVarsayılan.color;
        }
        coerceFont(zorla, 'insidetextfont', içMetinFontVarsayılan);

        if(hasPathbar) {
            var pathbarMetinFontVarsayılan = Lib.extendFlat({}, varsayılanFont);
            if(renkLayoutFonttanMirasAlındı) {
                delete pathbarMetinFontVarsayılan.color;
            }
            coerceFont(zorla, 'pathbar.textfont', pathbarMetinFontVarsayılan);
        }

        if(hasOutside) coerceFont(zorla, 'outsidetextfont', varsayılanFont);

        if(moduleHasSelected) zorla('selected.textfont.color');
        if(moduleHasUnselected) zorla('unselected.textfont.color');
        if(moduleHasConstrain) zorla('constraintext');
        if(moduleHasCliponaxis) zorla('cliponaxis');
        if(moduleHasTextangle) zorla('textangle');

        zorla('texttemplate');
    }

    if(hasInside) {
        if(moduleHasInsideanchor) zorla('insidetextanchor');
    }
}

module.exports = {
    varsayılanlarıSağla: varsayılanlarıSağla,
    çaprazİzVarsayılanları: çaprazİzVarsayılanları,
    metniEle: metniEle,
    köşeYarıçapınıDoğrula: köşeYarıçapınıDoğrula,
};
