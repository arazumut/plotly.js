'use strict';

module.exports = {
    moduleType: 'bileşen', // moduleType: 'component'
    name: 'resimler', // name: 'images'

    yerleşimÖzellikleri: require('./attributes'), // layoutAttributes: require('./attributes')
    yerleşimVarsayılanlarınıSağla: require('./defaults'), // supplyLayoutDefaults: require('./defaults')
    temelGrafiğiDahilEt: require('../../plots/cartesian/include_components')('resimler'), // includeBasePlot: require('../../plots/cartesian/include_components')('images')

    çiz: require('./draw'), // draw: require('./draw')

    koordinatlarıDönüştür: require('./convert_coords') // convertCoords: require('./convert_coords')
};
