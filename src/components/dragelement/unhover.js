'use strict';

var Olaylar = require('../../lib/events');
var throttle = require('../../lib/throttle');
var getGraphDiv = require('../../lib/dom').getGraphDiv;

var hoverConstants = require('../fx/constants');

var unhover = module.exports = {};

// Fare çıkışı sırasında hover efektlerini kaldır ve unhover olayını tetikle
unhover.wrapped = function(gd, evt, subplot) {
    gd = getGraphDiv(gd);

    // Önemli, sıradaki hover işlemlerini temizle
    if(gd._fullLayout) {
        throttle.clear(gd._fullLayout._uid + hoverConstants.HOVERID);
    }

    unhover.raw(gd, evt, subplot);
};

unhover.raw = function raw(gd, evt) {
    var fullLayout = gd._fullLayout;
    var eskiHoverVerisi = gd._hoverdata;

    if(!evt) evt = {};
    if(evt.target && !gd._dragged &&
       Olaylar.triggerHandler(gd, 'plotly_beforehover', evt) === false) {
        return;
    }

    fullLayout._hoverlayer.selectAll('g').remove();
    fullLayout._hoverlayer.selectAll('line').remove();
    fullLayout._hoverlayer.selectAll('circle').remove();
    gd._hoverdata = undefined;

    if(evt.target && eskiHoverVerisi) {
        gd.emit('plotly_unhover', {
            event: evt,
            points: eskiHoverVerisi
        });
    }
};
