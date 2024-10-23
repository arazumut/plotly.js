'use strict';

var strTranslate = require('../../lib').strTranslate;

// v3'te (log aralıkları düzeltildiğinde),
// burada tüm eksen türleri için p2r yapabileceğiz
function p2r(ax, v) {
    switch(ax.type) {
        case 'log':
            return ax.p2d(v);
        case 'date':
            return ax.p2r(v, 0, ax.calendar);
        default:
            return ax.p2r(v);
    }
}

function r2p(ax, v) {
    switch(ax.type) {
        case 'log':
            return ax.d2p(v);
        case 'date':
            return ax.r2p(v, 0, ax.calendar);
        default:
            return ax.r2p(v);
    }
}

function eksenDegeri(ax) {
    var index = (ax._id.charAt(0) === 'y') ? 1 : 0;
    return function(v) { return p2r(ax, v[index]); };
}

function donusumGetir(plotinfo) {
    return strTranslate(
        plotinfo.xaxis._offset,
        plotinfo.yaxis._offset
    );
}

module.exports = {
    p2r: p2r,
    r2p: r2p,
    eksenDegeri: eksenDegeri,
    donusumGetir: donusumGetir
};
