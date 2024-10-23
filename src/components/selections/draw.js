'use strict';

var readPaths = require('../shapes/draw_newshape/helpers').readPaths;
var displayOutlines = require('../shapes/display_outlines');
var clearOutlineControllers = require('../shapes/handle_outline').clearOutlineControllers;

var Color = require('../color');
var Drawing = require('../drawing');
var arrayEditor = require('../../plot_api/plot_template').arrayEditor;

var helpers = require('../shapes/helpers');
var getPathString = helpers.getPathString;

// Seçimler gd.layout.selections içinde saklanır, bir nesne dizisi
// index bu dizideki bir öğeye işaret edebilir,
//  veya yeni bir tane eklemek için sayısal olmayan bir değer olabilir
//  veya mevcut olanların tümünü değiştirmek için -1 olabilir
// opt tam seçenekler nesnesi olabilir veya bir anahtar (değere ayarlanacak)
//  veya sadece yeniden çizmek için undefined olabilir
// opt boşsa, val 'add' veya bu noktada diziye yeni bir
//  açıklama eklemek için tam seçenekler nesnesi olabilir veya 'remove' bu öğeyi silmek için olabilir

module.exports = {
    draw: draw,
    drawOne: drawOne,
    activateLastSelection: activateLastSelection
};

function draw(gd) {
    var fullLayout = gd._fullLayout;

    clearOutlineControllers(gd);

    // Yeni seçimleri çizmeye başlamadan önce önceki seçimleri kaldır
    fullLayout._selectionLayer.selectAll('path').remove();

    for(var k in fullLayout._plots) {
        var selectionLayer = fullLayout._plots[k].selectionLayer;
        if(selectionLayer) selectionLayer.selectAll('path').remove();
    }

    for(var i = 0; i < fullLayout.selections.length; i++) {
        drawOne(gd, i);
    }
}

function couldHaveActiveSelection(gd) {
    return gd._context.editSelection;
}

function drawOne(gd, index) {
    // Mevcut seçimi kaldır.
    // İndeksler değişebileceğinden, tüm seçim katmanlarında arama yapmamız gerekiyor
    gd._fullLayout._paperdiv
        .selectAll('.selectionlayer [data-index="' + index + '"]')
        .remove();

    var o = helpers.makeSelectionsOptionsAndPlotinfo(gd, index);
    var options = o.options;
    var plotinfo = o.plotinfo;

    // Bu seçim gitmiş - sildikten sonra hemen çık
    // TODO: Her seferinde silip yeniden çizmek yerine d3 deyimlerini kullan
    if(!options._input) return;

    drawSelection(gd._fullLayout._selectionLayer);

    function drawSelection(selectionLayer) {
        var d = getPathString(gd, options);
        var attrs = {
            'data-index': index,
            'fill-rule': 'evenodd',
            d: d
        };

        var opacity = options.opacity;
        var fillColor = 'rgba(0,0,0,0)';
        var lineColor = options.line.color || Color.contrast(gd._fullLayout.plot_bgcolor);
        var lineWidth = options.line.width;
        var lineDash = options.line.dash;
        if(!lineWidth) {
            // Seçimi etkinleştirmek için görünmez sınır sağla
            lineWidth = 5;
            lineDash = 'solid';
        }

        var isActiveSelection = couldHaveActiveSelection(gd) &&
            gd._fullLayout._activeSelectionIndex === index;

        if(isActiveSelection) {
            fillColor = gd._fullLayout.activeselection.fillcolor;
            opacity = gd._fullLayout.activeselection.opacity;
        }

        var allPaths = [];
        for(var sensory = 1; sensory >= 0; sensory--) {
            var path = selectionLayer.append('path')
                .attr(attrs)
                .style('opacity', sensory ? 0.1 : opacity)
                .call(Color.stroke, lineColor)
                .call(Color.fill, fillColor)
                // Sensory arka plan yolunu seçmeyi kolaylaştır
                .call(Drawing.dashLine,
                    sensory ? 'solid' : lineDash,
                    sensory ? 4 + lineWidth : lineWidth
                );

            setClipPath(path, gd, options);

            if(isActiveSelection) {
                var editHelpers = arrayEditor(gd.layout, 'selections', options);

                path.style({
                    cursor: 'move',
                });

                var dragOptions = {
                    element: path.node(),
                    plotinfo: plotinfo,
                    gd: gd,
                    editHelpers: editHelpers,
                    isActiveSelection: true // Yani denetleyicileri etkinleştirmek için
                };

                var polygons = readPaths(d, gd);
                // Poligonları ekranda göster
                displayOutlines(polygons, path, dragOptions);
            } else {
                path.style('pointer-events', sensory ? 'all' : 'none');
            }

            allPaths[sensory] = path;
        }

        var forePath = allPaths[0];
        var backPath = allPaths[1];

        backPath.node().addEventListener('click', function() { return activateSelection(gd, forePath); });
    }
}

function setClipPath(selectionPath, gd, selectionOptions) {
    var clipAxes = selectionOptions.xref + selectionOptions.yref;

    Drawing.setClipUrl(
        selectionPath,
        'clip' + gd._fullLayout._uid + clipAxes,
        gd
    );
}

function activateSelection(gd, path) {
    if(!couldHaveActiveSelection(gd)) return;

    var element = path.node();
    var id = +element.getAttribute('data-index');
    if(id >= 0) {
        // Zaten aktifse devre dışı bırak
        if(id === gd._fullLayout._activeSelectionIndex) {
            deactivateSelection(gd);
            return;
        }

        gd._fullLayout._activeSelectionIndex = id;
        gd._fullLayout._deactivateSelection = deactivateSelection;
        draw(gd);
    }
}

function activateLastSelection(gd) {
    if(!couldHaveActiveSelection(gd)) return;

    var id = gd._fullLayout.selections.length - 1;
    gd._fullLayout._activeSelectionIndex = id;
    gd._fullLayout._deactivateSelection = deactivateSelection;
    draw(gd);
}

function deactivateSelection(gd) {
    if(!couldHaveActiveSelection(gd)) return;

    var id = gd._fullLayout._activeSelectionIndex;
    if(id >= 0) {
        clearOutlineControllers(gd);
        delete gd._fullLayout._activeSelectionIndex;
        draw(gd);
    }
}
