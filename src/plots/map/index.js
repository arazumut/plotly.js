'use strict';

// Gerekli kütüphaneleri ve modülleri dahil et
var Lib = require('../../lib');
var strTranslate = Lib.strTranslate;
var strScale = Lib.strScale;
var getSubplotCalcData = require('../get_data').getSubplotCalcData;
var xmlnsNamespaces = require('../../constants/xmlns_namespaces');
var d3 = require('@plotly/d3');
var Drawing = require('../../components/drawing');
var svgTextUtils = require('../../lib/svg_text_utils');

var Map = require('./map');

var HARITA = 'map';

exports.name = HARITA;

exports.attr = 'subplot';

exports.idRoot = HARITA;

exports.idRegex = exports.attrRegex = Lib.counterRegex(HARITA);

exports.attributes = {
    subplot: {
        valType: 'subplotid',
        dflt: 'map',
        editType: 'calc',
        description: [
            'Bu iz verilerinin koordinatları ile',
            'bir harita alt grafiği arasında bir referans ayarlar.',
            'Eğer *map* (varsayılan değer) ise, veriler `layout.map` referans alınır.',
            'Eğer *map2* ise, veriler `layout.map2` referans alınır ve bu şekilde devam eder.'
        ].join(' ')
    }
};

exports.layoutAttributes = require('./layout_attributes');

exports.supplyLayoutDefaults = require('./layout_defaults');

exports.plot = function plot(gd) {
    var fullLayout = gd._fullLayout;
    var calcData = gd.calcdata;
    var mapIds = fullLayout._subplots[HARITA];

    for(var i = 0; i < mapIds.length; i++) {
        var id = mapIds[i];
        var subplotCalcData = getSubplotCalcData(calcData, HARITA, id);
        var opts = fullLayout[id];
        var map = opts._subplot;

        if(!map) {
            map = new Map(gd, id);
            fullLayout[id]._subplot = map;
        }

        if(!map.viewInitial) {
            map.viewInitial = {
                center: Lib.extendFlat({}, opts.center),
                zoom: opts.zoom,
                bearing: opts.bearing,
                pitch: opts.pitch
            };
        }

        map.plot(subplotCalcData, fullLayout, gd._promises);
    }
};

exports.clean = function(newFullData, newFullLayout, oldFullData, oldFullLayout) {
    var oldMapKeys = oldFullLayout._subplots[HARITA] || [];

    for(var i = 0; i < oldMapKeys.length; i++) {
        var oldMapKey = oldMapKeys[i];

        if(!newFullLayout[oldMapKey] && !!oldFullLayout[oldMapKey]._subplot) {
            oldFullLayout[oldMapKey]._subplot.destroy();
        }
    }
};

exports.toSVG = function(gd) {
    var fullLayout = gd._fullLayout;
    var subplotIds = fullLayout._subplots[HARITA];
    var size = fullLayout._size;

    for(var i = 0; i < subplotIds.length; i++) {
        var opts = fullLayout[subplotIds[i]];
        var domain = opts.domain;
        var map = opts._subplot;

        var imageData = map.toImage('png');
        var image = fullLayout._glimages.append('svg:image');

        image.attr({
            xmlns: xmlnsNamespaces.svg,
            'xlink:href': imageData,
            x: size.l + size.w * domain.x[0],
            y: size.t + size.h * (1 - domain.y[1]),
            width: size.w * (domain.x[1] - domain.x[0]),
            height: size.h * (domain.y[1] - domain.y[0]),
            preserveAspectRatio: 'none'
        });

        var subplotDiv = d3.select(opts._subplot.div);

        // Atıfları ekle
        var attributions = subplotDiv
                              .select('.maplibregl-ctrl-attrib').text()
                              .replace('Improve this map', '');

        var attributionGroup = fullLayout._glimages.append('g');

        var attributionText = attributionGroup.append('text');
        attributionText
          .text(attributions)
          .classed('static-attribution', true)
          .attr({
              'font-size': 12,
              'font-family': 'Arial',
              color: 'rgba(0, 0, 0, 0.75)',
              'text-anchor': 'end',
              'data-unformatted': attributions
          });

        var bBox = Drawing.bBox(attributionText.node());

        // Alanın iki katı genişliğinde çok satırlı metin
        var maxWidth = size.w * (domain.x[1] - domain.x[0]);
        if((bBox.width > maxWidth / 2)) {
            var multilineAttributions = attributions.split('|').join('<br>');
            attributionText
              .text(multilineAttributions)
              .attr('data-unformatted', multilineAttributions)
              .call(svgTextUtils.convertToTspans, gd);

            bBox = Drawing.bBox(attributionText.node());
        }
        attributionText.attr('transform', strTranslate(-3, -bBox.height + 8));

        // Metnin arkasına beyaz dikdörtgen çiz
        attributionGroup
          .insert('rect', '.static-attribution')
          .attr({
              x: -bBox.width - 6,
              y: -bBox.height - 3,
              width: bBox.width + 6,
              height: bBox.height + 3,
              fill: 'rgba(255, 255, 255, 0.75)'
          });

        // Alanın genişliğinden büyükse ölçekle
        var scaleRatio = 1;
        if((bBox.width + 6) > maxWidth) scaleRatio = maxWidth / (bBox.width + 6);

        var offset = [(size.l + size.w * domain.x[1]), (size.t + size.h * (1 - domain.y[0]))];
        attributionGroup.attr('transform', strTranslate(offset[0], offset[1]) + strScale(scaleRatio));
    }
};

exports.updateFx = function(gd) {
    var fullLayout = gd._fullLayout;
    var subplotIds = fullLayout._subplots[HARITA];

    for(var i = 0; i < subplotIds.length; i++) {
        var subplotObj = fullLayout[subplotIds[i]]._subplot;
        subplotObj.updateFx(fullLayout);
    }
};
