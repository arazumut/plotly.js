'use strict';

var docs = require('../constants/docs');
var FORMAT_LINK = docs.FORMAT_LINK;
var DATE_FORMAT_LINK = docs.DATE_FORMAT_LINK;

function templateFormatStringDescription(opts) {
    var supportOther = opts && opts.supportOther;

    return [
        'Değişkenler %{variable} kullanılarak eklenir,',
        'örneğin "y: %{y}"' + (
            supportOther ? 
                ' ve ayrıca %{xother}, {%_xother}, {%_xother_}, {%xother_} kullanılarak. Birden fazla nokta için bilgi gösterilirken, *xother* ilk noktadan farklı x pozisyonlarına sahip olanlara eklenir. *(x|y)other* öncesinde veya sonrasında bir alt çizgi, bu alan gösterildiğinde yalnızca o tarafta bir boşluk ekler.' :
                '.'
        ),
        'Sayılar d3-format\'ın sözdizimi %{variable:d3-format} kullanılarak biçimlendirilir, örneğin "Fiyat: %{y:$.2f}".',
        FORMAT_LINK,
        'biçimlendirme sözdizimi hakkında detaylar için.',
        'Tarihler d3-time-format\'ın sözdizimi %{variable|d3-time-format} kullanılarak biçimlendirilir, örneğin "Gün: %{2019-01-01|%A}".',
        DATE_FORMAT_LINK,
        'tarih biçimlendirme sözdizimi hakkında detaylar için.'
    ].join(' ');
}

function shapeTemplateFormatStringDescription() {
    return [
        'Değişkenler %{variable} kullanılarak eklenir,',
        'örneğin "x0: %{x0}".',
        'Sayılar d3-format\'ın sözdizimi %{variable:d3-format} kullanılarak biçimlendirilir, örneğin "Fiyat: %{x0:$.2f}". Detaylar için bkz.',
        FORMAT_LINK,
        'biçimlendirme sözdizimi hakkında.',
        'Tarihler d3-time-format\'ın sözdizimi %{variable|d3-time-format} kullanılarak biçimlendirilir, örneğin "Gün: %{x0|%m %b %Y}". Detaylar için bkz.',
        DATE_FORMAT_LINK,
        'tarih biçimlendirme sözdizimi hakkında.',
        'Tek bir çarpma veya bölme işlemi sayısal değişkenlere uygulanabilir ve',
        'd3 sayı biçimlendirme ile birleştirilebilir, örneğin "Uzunluk cm cinsinden: %{x0*2.54}", "%{slope*60:.1f} saniyede metre."',
        'Log eksenleri için, değişken değerleri log birimlerinde verilir.',
        'Tarih eksenleri için, x/y koordinat değişkenleri ve merkez değişkenleri tarih saatleri kullanır, diğer tüm değişken değerleri ms cinsinden değerler kullanır.'
    ].join(' ');
}

function describeVariables(extra) {
    var descPart = extra.description ? ' ' + extra.description : '';
    var keys = extra.keys || [];
    if(keys.length > 0) {
        var quotedKeys = [];
        for(var i = 0; i < keys.length; i++) {
            quotedKeys[i] = '`' + keys[i] + '`';
        }
        descPart = descPart + 'Son olarak, şablon dizesi şu değişkenlere erişime sahiptir: ';
        if(keys.length === 1) {
            descPart = descPart + 'değişken ' + quotedKeys[0];
        } else {
            descPart = descPart + 'değişkenler ' + quotedKeys.slice(0, -1).join(', ') + ' ve ' + quotedKeys.slice(-1) + '.';
        }
    }
    return descPart;
}

exports.hovertemplateAttrs = function(opts, extra) {
    opts = opts || {};
    extra = extra || {};

    var descPart = describeVariables(extra);

    var hovertemplate = {
        valType: 'string',
        dflt: '',
        editType: opts.editType || 'none',
        description: [
            'Hover kutusunda görünen bilgileri render etmek için kullanılan şablon dizesi.',
            'Bu, `hoverinfo`yu geçersiz kılacaktır.',
            templateFormatStringDescription({supportOther: true}),
            '`hovertemplate` içinde kullanılabilir değişkenler, şu bağlantıda açıklanan olay verileri olarak yayımlananlardır: https://plotly.com/javascript/plotlyjs-events/#event-data.',
            'Ek olarak, nokta başına belirtilebilen her öznitelik (arrayOk: true olanlar) kullanılabilir.',
            descPart,
            'Tag `<extra>` içinde bulunan her şey ikincil kutuda gösterilir, örneğin "<extra>{fullData.name}</extra>".',
            'İkincil kutuyu tamamen gizlemek için, boş bir tag `<extra></extra>` kullanın.'
        ].join(' ')
    };

    if(opts.arrayOk !== false) {
        hovertemplate.arrayOk = true;
    }

    return hovertemplate;
};

exports.texttemplateAttrs = function(opts, extra) {
    opts = opts || {};
    extra = extra || {};

    var descPart = describeVariables(extra);

    var texttemplate = {
        valType: 'string',
        dflt: '',
        editType: opts.editType || 'calc',
        description: [
            'Noktalarda görünen bilgi metnini render etmek için kullanılan şablon dizesi.',
            'Bu, `textinfo`yu geçersiz kılacaktır.',
            templateFormatStringDescription(),
            'Nokta başına belirtilebilen her öznitelik (arrayOk: true olanlar) kullanılabilir.',
            descPart
        ].join(' ')
    };

    if(opts.arrayOk !== false) {
        texttemplate.arrayOk = true;
    }
    return texttemplate;
};

exports.shapeTexttemplateAttrs = function(opts, extra) {
    opts = opts || {};
    extra = extra || {};

    var newStr = opts.newshape ? 'yeni ' : '';

    var descPart = describeVariables(extra);

    var texttemplate = {
        valType: 'string',
        dflt: '',
        editType: opts.editType || 'arraydraw',
        description: [
            newStr + 'şeklin etiketini render etmek için kullanılan şablon dizesi.',
            'Bu, `text`i geçersiz kılacaktır.',
            shapeTemplateFormatStringDescription(),
            descPart,
        ].join(' ')
    };
    return texttemplate;
};
