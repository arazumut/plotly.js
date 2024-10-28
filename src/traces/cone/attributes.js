'use strict';

var colorScaleAttrs = require('../../components/colorscale/attributes');
var axisHoverFormat = require('../../plots/cartesian/axis_format_attributes').axisHoverFormat;
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var mesh3dAttrs = require('../mesh3d/attributes');
var baseAttrs = require('../../plots/attributes');

var extendFlat = require('../../lib/extend').extendFlat;

var attrs = {
    x: {
        valType: 'data_array',
        editType: 'calc+clearAxisTypes',
        description: 'Vektör alanının ve görüntülenen konilerin x koordinatlarını ayarlar.'
    },
    y: {
        valType: 'data_array',
        editType: 'calc+clearAxisTypes',
        description: 'Vektör alanının ve görüntülenen konilerin y koordinatlarını ayarlar.'
    },
    z: {
        valType: 'data_array',
        editType: 'calc+clearAxisTypes',
        description: 'Vektör alanının ve görüntülenen konilerin z koordinatlarını ayarlar.'
    },

    u: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Vektör alanının x bileşenlerini ayarlar.'
    },
    v: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Vektör alanının y bileşenlerini ayarlar.'
    },
    w: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Vektör alanının z bileşenlerini ayarlar.'
    },

    sizemode: {
        valType: 'enumerated',
        values: ['scaled', 'absolute', 'raw'],
        editType: 'calc',
        dflt: 'scaled',
        description: [
            '`sizeref`in *scaled* (ölçeklenmiş) bir skaler olarak mı',
            '(vektör alanındaki maksimum u/v/w normuna göre normalize edilmiş) yoksa',
            '*absolute* (mutlak) bir değer olarak mı ayarlandığını belirler.',
            'Gerçek vektör uzunluğunda boyutları görüntülemek için *raw* kullanın.'
        ].join(' ')
    },
    sizeref: {
        valType: 'number',
        editType: 'calc',
        min: 0,
        description: [
            'Koni boyutu ölçeklendirmesini ayarlar.',
            'Konilerin boyutu, u/v/w normları ile bir faktör ve `sizeref` çarpılarak belirlenir.',
            'Bu faktör (içsel olarak hesaplanır),',
            'iki ardışık x/y/z pozisyonları arasında ortalama hızda seyahat etmek için gereken minimum "zaman"a karşılık gelir.',
            'Belirli bir izdeki tüm koniler aynı faktörü kullanır.',
            '`sizemode` *raw* olarak ayarlandığında, varsayılan değeri *1*dir.',
            '`sizemode` *scaled* olarak ayarlandığında, `sizeref` birimsizdir, varsayılan değeri *0.5*dir.',
            '`sizemode` *absolute* olarak ayarlandığında, `sizeref` u/v/w vektör alanı ile aynı birimlere sahiptir,',
            'varsayılan değeri örneğin maksimum vektör normunun yarısıdır.'
        ].join(' ')
    },

    anchor: {
        valType: 'enumerated',
        editType: 'calc',
        values: ['tip', 'tail', 'cm', 'center'],
        dflt: 'cm',
        description: [
            'Konilerin x/y/z pozisyonlarına göre ankrajını ayarlar.',
            '*cm* koninin kütle merkezi anlamına gelir ve',
            'uçtan uca 1/4 oranında yer alır.'
        ].join(' ')
    },

    text: {
        valType: 'string',
        dflt: '',
        arrayOk: true,
        editType: 'calc',
        description: [
            'Konilerle ilişkili metin öğelerini ayarlar.',
            'İz `hoverinfo` bir *text* bayrağı içeriyorsa ve *hovertext* ayarlanmamışsa,',
            'bu öğeler hover etiketlerinde görülecektir.'
        ].join(' ')
    },
    hovertext: {
        valType: 'string',
        dflt: '',
        arrayOk: true,
        editType: 'calc',
        description: 'Aynı `text` gibi.'
    },

    hovertemplate: hovertemplateAttrs({editType: 'calc'}, {keys: ['norm']}),
    uhoverformat: axisHoverFormat('u', 1),
    vhoverformat: axisHoverFormat('v', 1),
    whoverformat: axisHoverFormat('w', 1),
    xhoverformat: axisHoverFormat('x'),
    yhoverformat: axisHoverFormat('y'),
    zhoverformat: axisHoverFormat('z'),

    showlegend: extendFlat({}, baseAttrs.showlegend, {dflt: false})
};

extendFlat(attrs, colorScaleAttrs('', {
    colorAttr: 'u/v/w norm',
    showScaleDflt: true,
    editTypeOverride: 'calc'
}));

var fromMesh3d = ['opacity', 'lightposition', 'lighting'];

fromMesh3d.forEach(function(k) {
    attrs[k] = mesh3dAttrs[k];
});

attrs.hoverinfo = extendFlat({}, baseAttrs.hoverinfo, {
    editType: 'calc',
    flags: ['x', 'y', 'z', 'u', 'v', 'w', 'norm', 'text', 'name'],
    dflt: 'x+y+z+norm+text+name'
});

attrs.transforms = undefined;

module.exports = attrs;
