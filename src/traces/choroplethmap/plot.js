'use strict';

// Gerekli modülleri dahil et
var convert = require('./convert').convert;
var convertOnSelect = require('./convert').convertOnSelect;
var LAYER_PREFIX = require('../../plots/map/constants').traceLayerPrefix;

// ChoroplethMap sınıfı tanımla
function ChoroplethMap(subplot, uid) {
    this.type = 'choroplethmap';
    this.subplot = subplot;
    this.uid = uid;

    // Not: fill ve line katmanları aynı kaynağı paylaşır
    this.sourceId = 'source-' + uid;

    this.layerList = [
        ['fill', LAYER_PREFIX + uid + '-fill'],
        ['line', LAYER_PREFIX + uid + '-line']
    ];

    // Önceki 'below' değeri,
    // bunu düzgün güncellemek için gerekli
    this.below = null;
}

var proto = ChoroplethMap.prototype;

// Güncelleme fonksiyonu
proto.update = function(calcTrace) {
    this._update(convert(calcTrace));

    // Seçimler sırasında hızlı güncelleme için referans bağlantısı
    calcTrace[0].trace._glTrace = this;
};

// Seçim sırasında güncelleme fonksiyonu
proto.updateOnSelect = function(calcTrace) {
    this._update(convertOnSelect(calcTrace));
};

// İç güncelleme fonksiyonu
proto._update = function(optsAll) {
    var subplot = this.subplot;
    var layerList = this.layerList;
    var below = subplot.belowLookup['trace-' + this.uid];

    subplot.map
        .getSource(this.sourceId)
        .setData(optsAll.geojson);

    if(below !== this.below) {
        this._removeLayers();
        this._addLayers(optsAll, below);
        this.below = below;
    }

    for(var i = 0; i < layerList.length; i++) {
        var item = layerList[i];
        var k = item[0];
        var id = item[1];
        var opts = optsAll[k];

        subplot.setOptions(id, 'setLayoutProperty', opts.layout);

        if(opts.layout.visibility === 'visible') {
            subplot.setOptions(id, 'setPaintProperty', opts.paint);
        }
    }
};

// Katman ekleme fonksiyonu
proto._addLayers = function(optsAll, below) {
    var subplot = this.subplot;
    var layerList = this.layerList;
    var sourceId = this.sourceId;

    for(var i = 0; i < layerList.length; i++) {
        var item = layerList[i];
        var k = item[0];
        var opts = optsAll[k];

        subplot.addLayer({
            type: k,
            id: item[1],
            source: sourceId,
            layout: opts.layout,
            paint: opts.paint
        }, below);
    }
};

// Katman kaldırma fonksiyonu
proto._removeLayers = function() {
    var map = this.subplot.map;
    var layerList = this.layerList;

    for(var i = layerList.length - 1; i >= 0; i--) {
        map.removeLayer(layerList[i][1]);
    }
};

// Temizleme fonksiyonu
proto.dispose = function() {
    var map = this.subplot.map;
    this._removeLayers();
    map.removeSource(this.sourceId);
};

// ChoroplethMap oluşturma fonksiyonu
module.exports = function createChoroplethMap(subplot, calcTrace) {
    var trace = calcTrace[0].trace;
    var choroplethMap = new ChoroplethMap(subplot, trace.uid);
    var sourceId = choroplethMap.sourceId;
    var optsAll = convert(calcTrace);
    var below = choroplethMap.below = subplot.belowLookup['trace-' + trace.uid];

    subplot.map.addSource(sourceId, {
        type: 'geojson',
        data: optsAll.geojson
    });

    choroplethMap._addLayers(optsAll, below);

    // Seçimler sırasında hızlı güncelleme için referans bağlantısı
    calcTrace[0].trace._glTrace = choroplethMap;

    return choroplethMap;
};
