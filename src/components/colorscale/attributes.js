'use strict';

var colorbarAttrs = require('../colorbar/attributes');
var counterRegex = require('../../lib/regex').counter;
var sortObjectKeys = require('../../lib/sort_object_keys');

var palettes = require('./scales.js').scales;
var paletteStr = sortObjectKeys(palettes);

function kod(s) {
    return '`' + s + '`';
}

/**
 * Renk skalası öznitelik deklarasyonları oluşturur
 *
 * - colorscale,
 * - (c|z)auto, (c|z)min, (c|z)max,
 * - autocolorscale, reversescale,
 * - showscale (isteğe bağlı)
 * - color (isteğe bağlı)
 *
 * @param {string} context (varsayılan: '', yani iz kökünden):
 *     bu konteynerin içinde olduğu yer ('', *marker*, *marker.line* vb.)
 *
 * @param {object} opts:
 *   - cLetter {string} (varsayılan: 'c'):
 *     'min', 'max' ve 'auto' öznitelikleri için öncü harf (ya 'z' ya da 'c')
 *
 *   - colorAttr {string} (varsayılan: `cLetter: 'z'` ise 'z', `cLetter: 'c'` ise 'color'):
 *     (açıklamalar için) renk özniteliğinin adını belirler.
 *
 *     Not: `colorAttr: 'color'` ise, burada `color` deklarasyonunu içeririz.
 *
 *   - onlyIfNumerical {string} (varsayılan: `cLetter: 'z'` ise false, `cLetter: 'c'` ise true):
 *     (açıklamalar için) renk skalası özniteliğinin yalnızca sayısal olduğunda geçerli olup olmadığını belirler.
 *
 *   - colorscaleDflt {string}:
 *     renk skalası varsayılanını geçersiz kılar
 *
 *   - autoColorDflt {boolean} (varsayılan true):
 *     normalde autocolorscale.dflt `true`'dur, ancak `false` geçerek geçersiz kılabilirsiniz
 *
 *   - noScale {boolean} (varsayılan: `context: 'marker.line'` ise true, aksi takdirde false):
 *     showscale özniteliğini dahil etmemek için `false` olarak ayarlayın (örneğin 'marker.line' için)
 *
 *   - showScaleDflt {boolean} (varsayılan: `cLetter: 'z'` ise true, aksi takdirde false)
 *
 *   - editTypeOverride {boolean} (varsayılan: ''):
 *     bu özniteliklerin çoğu zaten bir yeniden hesaplama gerektirir, ancak gerektirmeyenler
 *     *style* veya *plot* düzenleme türüne sahiptir, aksi takdirde (muhtemelen *calc* ile) geçersiz kılabilirsiniz
 *
 *   - anim {boolean) (varsayılan: undefined): 'color' animasyonlu mu?
 *
 * @return {object}
 */
module.exports = function renkSkalasıÖznitelikleri(context, opts) {
    context = context || '';
    opts = opts || {};

    var cLetter = opts.cLetter || 'c';
    var onlyIfNumerical = ('onlyIfNumerical' in opts) ? opts.onlyIfNumerical : Boolean(context);
    var noScale = ('noScale' in opts) ? opts.noScale : context === 'marker.line';
    var showScaleDflt = ('showScaleDflt' in opts) ? opts.showScaleDflt : cLetter === 'z';
    var colorscaleDflt = typeof opts.colorscaleDflt === 'string' ? palettes[opts.colorscaleDflt] : null;
    var editTypeOverride = opts.editTypeOverride || '';
    var contextHead = context ? (context + '.') : '';

    var colorAttr, colorAttrFull;

    if('colorAttr' in opts) {
        colorAttr = opts.colorAttr;
        colorAttrFull = opts.colorAttr;
    } else {
        colorAttr = {z: 'z', c: 'color'}[cLetter];
        colorAttrFull = 'in ' + kod(contextHead + colorAttr);
    }

    var effectDesc = onlyIfNumerical ?
        ' Yalnızca ' + colorAttrFull + ' sayısal bir dizi olarak ayarlandığında etkisi vardır.' :
        '';

    var auto = cLetter + 'auto';
    var min = cLetter + 'min';
    var max = cLetter + 'max';
    var mid = cLetter + 'mid';
    var autoFull = kod(contextHead + auto);
    var minFull = kod(contextHead + min);
    var maxFull = kod(contextHead + max);
    var minmaxFull = minFull + ' ve ' + maxFull;
    var autoImpliedEdits = {};
    autoImpliedEdits[min] = autoImpliedEdits[max] = undefined;
    var minmaxImpliedEdits = {};
    minmaxImpliedEdits[auto] = false;

    var attrs = {};

    if(colorAttr === 'color') {
        attrs.color = {
            valType: 'color',
            arrayOk: true,
            editType: editTypeOverride || 'style',
            description: [
                context, ' rengini ayarlar.',
                'Belirli bir rengi veya',
                'dizinin maksimum ve minimum değerlerine göre veya',
                minmaxFull, 'ayarlanmışsa,',
                'renk skalasına eşlenen sayıların bir dizisini kabul eder.'
            ].join(' ')
        };

        if(opts.anim) {
            attrs.color.anim = true;
        }
    }

    attrs[auto] = {
        valType: 'boolean',
        dflt: true,
        editType: 'calc',
        impliedEdits: autoImpliedEdits,
        description: [
            'Renk alanının giriş verilerine göre mi',
            '(burada ' + colorAttrFull + ') yoksa',
            minmaxFull + effectDesc,
            'kullanıcı tarafından ayarlandığında `false` olur.'
        ].join(' ')
    };

    attrs[min] = {
        valType: 'number',
        dflt: null,
        editType: editTypeOverride || 'plot',
        impliedEdits: minmaxImpliedEdits,
        description: [
            'Renk alanının alt sınırını ayarlar.' + effectDesc,
            'Değer', colorAttrFull, 'ile aynı birimlerde olmalıdır',
            've ayarlanmışsa,', maxFull, 'da ayarlanmalıdır.'
        ].join(' ')
    };

    attrs[max] = {
        valType: 'number',
        dflt: null,
        editType: editTypeOverride || 'plot',
        impliedEdits: minmaxImpliedEdits,
        description: [
            'Renk alanının üst sınırını ayarlar.' + effectDesc,
            'Değer', colorAttrFull, 'ile aynı birimlerde olmalıdır',
            've ayarlanmışsa,', minFull, 'da ayarlanmalıdır.'
        ].join(' ')
    };

    attrs[mid] = {
        valType: 'number',
        dflt: null,
        editType: 'calc',
        impliedEdits: autoImpliedEdits,
        description: [
            'Renk alanının orta noktasını ayarlar', minFull,
            've/veya', maxFull, 'bu noktaya eşit uzaklıkta olacak şekilde ölçeklendirilir.' + effectDesc,
            'Değer', colorAttrFull + ' ile aynı birimlerde olmalıdır.',
            autoFull, ' `false` olduğunda etkisi yoktur.'
        ].join(' ')
    };

    attrs.colorscale = {
        valType: 'colorscale',
        editType: 'calc',
        dflt: colorscaleDflt,
        impliedEdits: {autocolorscale: false},
        description: [
            'Renk skalasını ayarlar.' + effectDesc,
            'Renk skalası, normalize edilmiş bir değeri',
            'rgb, rgba, hex, hsl, hsv veya adlandırılmış renk dizgisine eşleyen',
            'diziler içeren bir dizi olmalıdır.',
            'En azından, en düşük (0) ve en yüksek (1)',
            'değerler için bir eşleme gereklidir. Örneğin,',
            '`[[0, \'rgb(0,0,255)\'], [1, \'rgb(255,0,0)\']]`.',
            'Renk alanının sınırlarını renk uzayında kontrol etmek için,',
            minmaxFull + ' kullanın.',
            'Alternatif olarak, `colorscale` aşağıdaki listeden bir palet adı dizgisi olabilir: ' + paletteStr + '.'
        ].join(' ')
    };

    attrs.autocolorscale = {
        valType: 'boolean',
        // 'heatmap' ve 'surface' için geriye dönük uyumlulukta geçersiz kılınır.
        dflt: opts.autoColorDflt === false ? false : true,
        editType: 'calc',
        impliedEdits: {colorscale: undefined},
        description: [
            'Renk skalasının varsayılan bir palet olup olmadığını belirler (`autocolorscale: true`)',
            'veya', kod(contextHead + 'colorscale') + ' tarafından belirlenen palet.' + effectDesc,
            '`colorscale` belirtilmemişse veya `autocolorscale` true ise, varsayılan',
            'palet, `color` dizisindeki sayıların',
            'tamamının pozitif, tamamının negatif veya karışık olup olmamasına göre seçilecektir.'
        ].join(' ')
    };

    attrs.reversescale = {
        valType: 'boolean',
        dflt: false,
        editType: 'plot',
        description: [
            'Renk eşlemeyi tersine çevirir.' + effectDesc,
            'Eğer true ise,', minFull, 'dizideki son renge',
            've', maxFull, 'dizideki ilk renge karşılık gelir.'
        ].join(' ')
    };

    if(!noScale) {
        attrs.showscale = {
            valType: 'boolean',
            dflt: showScaleDflt,
            editType: 'calc',
            description: [
                'Bu iz için bir renk çubuğunun gösterilip gösterilmeyeceğini belirler.' + effectDesc
            ].join(' ')
        };

        attrs.colorbar = colorbarAttrs;
    }

    if(!opts.noColorAxis) {
        attrs.coloraxis = {
            valType: 'subplotid',
            regex: counterRegex('coloraxis'),
            dflt: null,
            editType: 'calc',
            description: [
                'Paylaşılan bir renk eksenine referans ayarlar.',
                'Bu paylaşılan renk eksenlerine referanslar *coloraxis*, *coloraxis2*, *coloraxis3* vb. şeklindedir.',
                'Bu paylaşılan renk eksenleri için ayarlar, yerleşimde,',
                '`layout.coloraxis`, `layout.coloraxis2` vb. altında ayarlanır.',
                'Birden fazla renk skalasının aynı renk eksenine bağlanabileceğini unutmayın.'
            ].join(' ')
        };
    }

    return attrs;
};
