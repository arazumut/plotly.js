'use strict';

var BADNUM = require('../constants/numerical').BADNUM;

/**
 * calcTrace'i GeoJSON 'MultiLineString' koordinat dizilerine dönüştür
 *
 * @param {object} calcTrace
 *  gd.calcdata öğesi.
 *  calcTrace[i].lonlat'in tanımlı olduğu varsayılır
 *
 * @return {array}
 *  çizgi koordinatları dizisini (veya diziler dizisini) döndürür
 *
 */
exports.calcTraceToLineCoords = function(calcTrace) {
    var trace = calcTrace[0].trace;
    var connectgaps = trace.connectgaps;

    var coords = [];
    var lineString = [];

    for(var i = 0; i < calcTrace.length; i++) {
        var calcPt = calcTrace[i];
        var lonlat = calcPt.lonlat;

        if(lonlat[0] !== BADNUM) {
            lineString.push(lonlat);
        } else if(!connectgaps && lineString.length > 0) {
            coords.push(lineString);
            lineString = [];
        }
    }

    if(lineString.length > 0) {
        coords.push(lineString);
    }

    return coords;
};

/**
 * Çizgi ('LineString' veya 'MultiLineString') GeoJSON oluştur
 *
 * @param {array} coords
 *  calcTraceToLineCoords sonuçları
 * @return {object} out
 *  GeoJSON nesnesi
 *
 */
exports.makeLine = function(coords) {
    if(coords.length === 1) {
        return {
            type: 'LineString',
            coordinates: coords[0]
        };
    } else {
        return {
            type: 'MultiLineString',
            coordinates: coords
        };
    }
};

/**
 * Poligon ('Polygon' veya 'MultiPolygon') GeoJSON oluştur
 *
 * @param {array} coords
 *  calcTraceToLineCoords sonuçları
 * @return {object} out
 *  GeoJSON nesnesi
 */
exports.makePolygon = function(coords) {
    if(coords.length === 1) {
        return {
            type: 'Polygon',
            coordinates: coords
        };
    } else {
        var _coords = new Array(coords.length);

        for(var i = 0; i < coords.length; i++) {
            _coords[i] = [coords[i]];
        }

        return {
            type: 'MultiPolygon',
            coordinates: _coords
        };
    }
};

/**
 * Boş GeoJSON oluştur
 *
 * @return {object}
 *  Boş GeoJSON nesnesi
 *
 */
exports.makeBlank = function() {
    return {
        type: 'Point',
        coordinates: []
    };
};
