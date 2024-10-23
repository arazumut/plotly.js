'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');
var handleArrayContainerDefaults = require('../../plots/array_container_defaults');
var handleAnnotationCommonDefaults = require('./common_defaults');
var attributes = require('./attributes');

// Layout varsayılanlarını sağla
module.exports = function layoutVarsayilanlariniSagla(layoutIn, layoutOut) {
    handleArrayContainerDefaults(layoutIn, layoutOut, {
        name: 'annotations',
        handleItemDefaults: annotationVarsayilanlariniIsle
    });
};

// Annotation varsayılanlarını işle
function annotationVarsayilanlariniIsle(annIn, annOut, fullLayout) {
    function zorla(attr, dflt) {
        return Lib.coerce(annIn, annOut, attributes, attr, dflt);
    }

    var gorunur = zorla('visible');
    var tiklaGoster = zorla('clicktoshow');

    if (!(gorunur || tiklaGoster)) return;

    handleAnnotationCommonDefaults(annIn, annOut, fullLayout, zorla);

    var okGoster = annOut.showarrow;

    // Konumlandırma
    var eksenHarfleri = ['x', 'y'];
    var okKonumVarsayilan = [-10, -30];
    var gdMock = { _fullLayout: fullLayout };

    for (var i = 0; i < 2; i++) {
        var eksenHarf = eksenHarfleri[i];

        // xref, yref
        var eksenRef = Axes.coerceRef(annIn, annOut, gdMock, eksenHarf, '', 'paper');

        if (eksenRef !== 'paper') {
            var eksen = Axes.getFromId(gdMock, eksenRef);
            eksen._annIndices.push(annOut._index);
        }

        // x, y
        Axes.coercePosition(annOut, gdMock, zorla, eksenRef, eksenHarf, 0.5);

        if (okGoster) {
            var okKonumAttr = 'a' + eksenHarf;
            // axref, ayref
            var aEksenRef = Axes.coerceRef(annIn, annOut, gdMock, okKonumAttr, 'pixel', ['pixel', 'paper']);

            if (aEksenRef !== 'pixel' && aEksenRef !== eksenRef) {
                aEksenRef = annOut[okKonumAttr] = 'pixel';
            }

            // ax, ay
            var aVarsayilan = (aEksenRef === 'pixel') ? okKonumVarsayilan[i] : 0.4;
            Axes.coercePosition(annOut, gdMock, zorla, aEksenRef, okKonumAttr, aVarsayilan);
        }

        // xanchor, yanchor
        zorla(eksenHarf + 'anchor');

        // xshift, yshift
        zorla(eksenHarf + 'shift');
    }

    // Eğer bir koordinat varsa, her ikisi de olmalı
    Lib.noneOrAll(annIn, annOut, ['x', 'y']);

    // Eğer ok uzunluğunun bir kısmı varsa, her ikisi de olmalı
    if (okGoster) {
        Lib.noneOrAll(annIn, annOut, ['ax', 'ay']);
    }

    if (tiklaGoster) {
        var xTikla = zorla('xclick');
        var yTikla = zorla('yclick');

        // Gerçek tıklama verilerini özel niteliklere koy
        annOut._xclick = (xTikla === undefined) ?
            annOut.x :
            Axes.cleanPosition(xTikla, gdMock, annOut.xref);
        annOut._yclick = (yTikla === undefined) ?
            annOut.y :
            Axes.cleanPosition(yTikla, gdMock, annOut.yref);
    }
}
