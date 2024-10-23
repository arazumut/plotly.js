'use strict';

var cartesianConstants = require('../../plots/cartesian/constants');
var templatedArray = require('../../plot_api/plot_template').templatedArray;
var axisPlaceableObjs = require('../../constants/axis_placeable_objects');

module.exports = templatedArray('image', {
    visible: {
        valType: 'boolean',
        dflt: true,
        editType: 'arraydraw',
        description: 'Bu görüntünün görünür olup olmadığını belirler.'
    },

    source: {
        valType: 'string',
        editType: 'arraydraw',
        description: [
            'Kullanılacak görüntünün URL\'sini belirtir.',
            'URL, grafiğin çalıştırıldığı alandan erişilebilir olmalıdır',
            've göreceli veya mutlak olabilir.'
        ].join(' ')
    },

    layer: {
        valType: 'enumerated',
        values: ['below', 'above'],
        dflt: 'above',
        editType: 'arraydraw',
        description: [
            'Görüntülerin izlerin altında mı yoksa üstünde mi çizileceğini belirtir.',
            '`xref` ve `yref` her ikisi de `paper` olarak ayarlandığında,',
            'görüntü tüm grafik alanının altında çizilir.'
        ].join(' ')
    },

    sizex: {
        valType: 'number',
        dflt: 0,
        editType: 'arraydraw',
        description: [
            'Görüntü konteynerinin yatay boyutunu ayarlar.',
            'Görüntü, `position` değerine göre boyutlandırılacaktır.',
            '`xref` `paper` olarak ayarlandığında, birimler grafiğin genişliğine göre boyutlandırılır.',
            '`xref` `domain` ile bittiğinde, birimler eksen genişliğine göre boyutlandırılır.'
        ].join(' ')
    },

    sizey: {
        valType: 'number',
        dflt: 0,
        editType: 'arraydraw',
        description: [
            'Görüntü konteynerinin dikey boyutunu ayarlar.',
            'Görüntü, `position` değerine göre boyutlandırılacaktır.',
            '`yref` `paper` olarak ayarlandığında, birimler grafiğin yüksekliğine göre boyutlandırılır.',
            '`yref` `domain` ile bittiğinde, birimler eksen yüksekliğine göre boyutlandırılır.'
        ].join(' ')
    },

    sizing: {
        valType: 'enumerated',
        values: ['fill', 'contain', 'stretch'],
        dflt: 'contain',
        editType: 'arraydraw',
        description: 'Görüntünün hangi boyutunun kısıtlanacağını belirtir.'
    },

    opacity: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 1,
        editType: 'arraydraw',
        description: 'Görüntünün opaklığını ayarlar.'
    },

    x: {
        valType: 'any',
        dflt: 0,
        editType: 'arraydraw',
        description: [
            'Görüntünün x konumunu ayarlar.',
            '`xref` `paper` olarak ayarlandığında, birimler grafiğin yüksekliğine göre boyutlandırılır.',
            'Daha fazla bilgi için `xref`e bakın.'
        ].join(' ')
    },

    y: {
        valType: 'any',
        dflt: 0,
        editType: 'arraydraw',
        description: [
            'Görüntünün y konumunu ayarlar.',
            '`yref` `paper` olarak ayarlandığında, birimler grafiğin yüksekliğine göre boyutlandırılır.',
            'Daha fazla bilgi için `yref`e bakın.'
        ].join(' ')
    },

    xanchor: {
        valType: 'enumerated',
        values: ['left', 'center', 'right'],
        dflt: 'left',
        editType: 'arraydraw',
        description: 'x konumu için referans noktasını ayarlar.'
    },

    yanchor: {
        valType: 'enumerated',
        values: ['top', 'middle', 'bottom'],
        dflt: 'top',
        editType: 'arraydraw',
        description: 'y konumu için referans noktasını ayarlar.'
    },

    xref: {
        valType: 'enumerated',
        values: [
            'paper',
            cartesianConstants.idRegex.x.toString()
        ],
        dflt: 'paper',
        editType: 'arraydraw',
        description: [
            'Görüntünün x koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('x', 'left', 'right')
        ].join(' ')
    },

    yref: {
        valType: 'enumerated',
        values: [
            'paper',
            cartesianConstants.idRegex.y.toString()
        ],
        dflt: 'paper',
        editType: 'arraydraw',
        description: [
            'Görüntünün y koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('y', 'bottom', 'top')
        ].join(' ')
    },
    editType: 'arraydraw'
});
