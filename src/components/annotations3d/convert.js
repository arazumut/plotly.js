'use strict';

var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');

module.exports = function convert(scene) {
    var fullSceneLayout = scene.fullSceneLayout;
    var annotations = fullSceneLayout.annotations;

    for (var i = 0; i < annotations.length; i++) {
        fakeAnnotationAxes(annotations[i], scene);
    }

    scene.fullLayout._infolayer
        .selectAll('.annotation-' + scene.id)
        .remove();
};

function fakeAnnotationAxes(annotation, scene) {
    var fullSceneLayout = scene.fullSceneLayout;
    var domain = fullSceneLayout.domain;
    var size = scene.fullLayout._size;

    var base = {
        // to be filled during rendering
        pdata: null,

        // to prevent setConvert from working properly
        type: 'linear',

        // don't try to update when `editable: true`
        autorange: false,

        // set infinite range so that annotation drawing routine
        // doesn't try to remove 'out of range' annotations,
        // this is handled in the render loop
        range: [-Infinity, Infinity]
    };

    annotation._xa = {};
    Lib.extendFlat(annotation._xa, base);
    Axes.setConvert(annotation._xa);
    annotation._xa._offset = size.l + domain.x[0] * size.w;
    annotation._xa.l2p = function() {
        return 0.5 * (1 + annotation._pdata[0] / annotation._pdata[3]) * size.w * (domain.x[1] - domain.x[0]);
    };

    annotation._ya = {};
    Lib.extendFlat(annotation._ya, base);
    Axes.setConvert(annotation._ya);
    annotation._ya._offset = size.t + (1 - domain.y[1]) * size.h;
    annotation._ya.l2p = function() {
        return 0.5 * (1 - annotation._pdata[1] / annotation._pdata[3]) * size.h * (domain.y[1] - domain.y[0]);
    };
}
