'use strict';

// Gerekli modülleri dahil et
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var extendFlat = require('../../lib/extend').extendFlat;
var scatterPolarAttrs = require('../scatterpolar/attributes');
var barAttrs = require('../bar/attributes');

// Modülü dışa aktar
module.exports = {
    r: scatterPolarAttrs.r,
    theta: scatterPolarAttrs.theta,
    r0: scatterPolarAttrs.r0,
    dr: scatterPolarAttrs.dr,
    theta0: scatterPolarAttrs.theta0,
    dtheta: scatterPolarAttrs.dtheta,
    thetaunit: scatterPolarAttrs.thetaunit,

    // orientation: {
    //     valType: 'enumerated',
    //     values: ['radial', 'angular'],
    //     editType: 'calc+clearAxisTypes',
    //     description: 'Çubukların yönünü ayarlar.'
    // },

    base: extendFlat({}, barAttrs.base, {
        description: [
            'Çubuğun tabanının çizileceği yeri ayarlar (radyal eksen birimlerinde).',
            '*stack* çubuk modunda,',
            '*base* ayarlayan izler hariç tutulur',
            've bunun yerine *overlay* modunda çizilir.'
        ].join(' ')
    }),
    offset: extendFlat({}, barAttrs.offset, {
        description: [
            'Çubuğun çizileceği açısal pozisyonu kaydırır',
            '( *thetaunit* birimlerinde).'
        ].join(' ')
    }),
    width: extendFlat({}, barAttrs.width, {
        description: [
            'Çubuğun açısal genişliğini ayarlar ( *thetaunit* birimlerinde).'
        ].join(' ')
    }),

    text: extendFlat({}, barAttrs.text, {
        description: [
            'Her çubukla ilişkili hover metin öğelerini ayarlar.',
            'Tek bir string ise, tüm çubukların üzerinde aynı string görünür.',
            'Bir dizi string ise, öğeler sırayla bu iz koordinatlarına eşlenir.'
        ].join(' ')
    }),
    hovertext: extendFlat({}, barAttrs.hovertext, {
        description: ' `text` ile aynı.'
    }),

    // textposition: {},
    // textfont: {},
    // insidetextfont: {},
    // outsidetextfont: {},
    // constraintext: {},
    // cliponaxis: extendFlat({}, barAttrs.cliponaxis, {dflt: false}),

    marker: barPolarMarker(),

    hoverinfo: scatterPolarAttrs.hoverinfo,
    hovertemplate: hovertemplateAttrs(),

    selected: barAttrs.selected,
    unselected: barAttrs.unselected

    // error_x (error_r, error_theta)
    // error_y
};

// barPolarMarker fonksiyonu
function barPolarMarker() {
    var marker = extendFlat({}, barAttrs.marker);
    delete marker.cornerradius;
    return marker;
}
