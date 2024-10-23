'use strict';

var EventEmitter = require('events').EventEmitter;

var Registry = require('../registry');
var Lib = require('../lib');

var helpers = require('./helpers');
var clonePlot = require('./cloneplot');
var toSVG = require('./tosvg');
var svgToImg = require('./svgtoimg');

/**
 * @param {object} gd Grafik nesnesi
 * @param {object} opts Seçenek nesnesi
 * @param opts.format 'jpeg' | 'png' | 'webp' | 'svg'
 */
function toImage(gd, opts) {
    // İlk olarak GD'yi klonlayarak temiz bir ortamda çalışalım
    var ev = new EventEmitter();

    var clone = clonePlot(gd, {format: 'png'});
    var klonlanmışGd = clone.gd;

    // Klonlanmış div'i DOM'a eklemeden önce ekran dışında bir yere koy
    klonlanmışGd.style.position = 'absolute';
    klonlanmışGd.style.left = '-5000px';
    document.body.appendChild(klonlanmışGd);

    function bekle() {
        var gecikme = helpers.getDelay(klonlanmışGd._fullLayout);

        setTimeout(function() {
            var svg = toSVG(klonlanmışGd);

            var canvas = document.createElement('canvas');
            canvas.id = Lib.randstr();

            ev = svgToImg({
                format: opts.format,
                width: klonlanmışGd._fullLayout.width,
                height: klonlanmışGd._fullLayout.height,
                canvas: canvas,
                emitter: ev,
                svg: svg
            });

            ev.clean = function() {
                if(klonlanmışGd) document.body.removeChild(klonlanmışGd);
            };
        }, gecikme);
    }

    var yenidenÇizimFonksiyonu = helpers.getRedrawFunc(klonlanmışGd);

    Registry.call('_doPlot', klonlanmışGd, clone.data, clone.layout, clone.config)
        .then(yenidenÇizimFonksiyonu)
        .then(bekle)
        .catch(function(hata) {
            ev.emit('error', hata);
        });

    return ev;
}

module.exports = toImage;
