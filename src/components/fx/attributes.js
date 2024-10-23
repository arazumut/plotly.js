'use strict';

// Gerekli modülleri dahil et
var fontAttrs = require('../../plots/font_attributes');
var hoverLabelAttrs = require('./layout_attributes').hoverlabel;
var extendFlat = require('../../lib/extend').extendFlat;

// Modülü dışa aktar
module.exports = {
    hoverlabel: {
        // Hover etiketlerinin arka plan rengini ayarlar
        bgcolor: extendFlat({}, hoverLabelAttrs.bgcolor, {
            arrayOk: true,
            description: 'Bu iz için hover etiketlerinin arka plan rengini ayarlar'
        }),
        // Hover etiketlerinin kenarlık rengini ayarlar
        bordercolor: extendFlat({}, hoverLabelAttrs.bordercolor, {
            arrayOk: true,
            description: 'Bu iz için hover etiketlerinin kenarlık rengini ayarlar.'
        }),
        // Hover etiketlerinde kullanılan yazı tipini ayarlar
        font: fontAttrs({
            arrayOk: true,
            editType: 'none',
            description: 'Hover etiketlerinde kullanılan yazı tipini ayarlar.'
        }),
        // Hover etiketlerinin hizalamasını ayarlar
        align: extendFlat({}, hoverLabelAttrs.align, {arrayOk: true}),
        // Hover etiketlerinin isim uzunluğunu ayarlar
        namelength: extendFlat({}, hoverLabelAttrs.namelength, {arrayOk: true}),
        editType: 'none'
    }
};
