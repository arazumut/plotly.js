'use strict';

// Gerekli modülleri dahil et
var d3 = require('@plotly/d3');
var Lib = require('../../lib');
var geoUtils = require('../../lib/geo_location_utils');
var getTopojsonFeatures = require('../../lib/topojson_utils').getTopojsonFeatures;
var findExtremes = require('../../plots/cartesian/autorange').findExtremes;
var style = require('./style').style;

// Harita çizim fonksiyonu
function plot(gd, geo, calcData) {
    var choroplethLayer = geo.layers.backplot.select('.choroplethlayer');

    // Trace gruplarını oluştur
    Lib.makeTraceGroups(choroplethLayer, calcData, 'trace choropleth').each(function(calcTrace) {
        var sel = d3.select(this);

        // Path elemanlarını seç ve güncelle
        var paths = sel.selectAll('path.choroplethlocation')
            .data(Lib.identity);

        paths.enter().append('path')
            .classed('choroplethlocation', true);

        paths.exit().remove();

        // Stil fonksiyonunu topojson isteği geri çağrımı içinde çağır
        style(gd, calcTrace);
    });
}

// GeoJSON hesaplama fonksiyonu
function calcGeoJSON(calcTrace, fullLayout) {
    var trace = calcTrace[0].trace;
    var geoLayout = fullLayout[trace.geo];
    var geo = geoLayout._subplot;
    var locationmode = trace.locationmode;
    var len = trace._length;

    // Özellikleri al
    var features = locationmode === 'geojson-id' ?
        geoUtils.extractTraceFeature(calcTrace) :
        getTopojsonFeatures(trace, geo.topojson);

    var lonArray = [];
    var latArray = [];

    // Her bir nokta için özellikleri hesapla
    for(var i = 0; i < len; i++) {
        var calcPt = calcTrace[i];
        var feature = locationmode === 'geojson-id' ?
            calcPt.fOut :
            geoUtils.locationToFeature(locationmode, calcPt.loc, features);

        if(feature) {
            calcPt.geojson = feature;
            calcPt.ct = feature.properties.ct;
            calcPt._polygons = geoUtils.feature2polygons(feature);

            var bboxFeature = geoUtils.computeBbox(feature);
            lonArray.push(bboxFeature[0], bboxFeature[2]);
            latArray.push(bboxFeature[1], bboxFeature[3]);
        } else {
            calcPt.geojson = null;
        }
    }

    // GeoJSON'a göre sınırları ayarla
    if(geoLayout.fitbounds === 'geojson' && locationmode === 'geojson-id') {
        var bboxGeojson = geoUtils.computeBbox(geoUtils.getTraceGeojson(trace));
        lonArray = [bboxGeojson[0], bboxGeojson[2]];
        latArray = [bboxGeojson[1], bboxGeojson[3]];
    }

    // Ekstrem değerleri bul ve ayarla
    var opts = {padded: true};
    trace._extremes.lon = findExtremes(geoLayout.lonaxis._ax, lonArray, opts);
    trace._extremes.lat = findExtremes(geoLayout.lataxis._ax, latArray, opts);
}

// Modülleri dışa aktar
module.exports = {
    calcGeoJSON: calcGeoJSON,
    plot: plot
};
