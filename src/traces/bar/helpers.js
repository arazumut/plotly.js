'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');
var tinycolor = require('tinycolor2');
var isArrayOrTypedArray = require('../../lib').isArrayOrTypedArray;

// String değerini zorla
exports.coerceString = function(attributeDefinition, value, defaultValue) {
    if(typeof value === 'string') {
        if(value || !attributeDefinition.noBlank) return value;
    } else if(typeof value === 'number' || value === true) {
        if(!attributeDefinition.strict) return String(value);
    }

    return (defaultValue !== undefined) ?
      defaultValue :
      attributeDefinition.dflt;
};

// Sayısal değeri zorla
exports.coerceNumber = function(attributeDefinition, value, defaultValue) {
    if(isNumeric(value)) {
        value = +value;

        var min = attributeDefinition.min;
        var max = attributeDefinition.max;
        var isOutOfBounds = (min !== undefined && value < min) ||
              (max !== undefined && value > max);

        if(!isOutOfBounds) return value;
    }

    return (defaultValue !== undefined) ?
      defaultValue :
      attributeDefinition.dflt;
};

// Renk değerini zorla
exports.coerceColor = function(attributeDefinition, value, defaultValue) {
    if(tinycolor(value).isValid()) return value;

    return (defaultValue !== undefined) ?
      defaultValue :
      attributeDefinition.dflt;
};

// Belirtilen değeri zorla
exports.coerceEnumerated = function(attributeDefinition, value, defaultValue) {
    if(attributeDefinition.coerceNumber) value = +value;

    if(attributeDefinition.values.indexOf(value) !== -1) return value;

    return (defaultValue !== undefined) ?
      defaultValue :
      attributeDefinition.dflt;
};

// Dizi veya skaler değeri al
exports.getValue = function(arrayOrScalar, index) {
    var value;
    if(!isArrayOrTypedArray(arrayOrScalar)) value = arrayOrScalar;
    else if(index < arrayOrScalar.length) value = arrayOrScalar[index];
    return value;
};

// Çizgi genişliğini al
exports.getLineWidth = function(trace, di) {
    var w =
        (0 < di.mlw) ? di.mlw :
        !isArrayOrTypedArray(trace.marker.line.width) ? trace.marker.line.width :
        0;

    return w;
};
