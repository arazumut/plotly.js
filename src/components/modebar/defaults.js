'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var Color = require('../color');
var Template = require('../../plot_api/plot_template');
var attributes = require('./attributes');

// Layout varsayılanlarını sağla
module.exports = function layoutVarsayilanlariniSagla(layoutIn, layoutOut) {
    var containerIn = layoutIn.modebar || {};
    var containerOut = Template.newContainer(layoutOut, 'modebar');

    // Değerleri zorla (coerce) fonksiyonu
    function zorla(attr, varsayilan) {
        return Lib.coerce(containerIn, containerOut, attributes, attr, varsayilan);
    }

    // Zorla fonksiyonunu kullanarak değerleri ayarla
    zorla('orientation');
    zorla('bgcolor', Color.addOpacity(layoutOut.paper_bgcolor, 0.5));
    var varsayilanRenk = Color.contrast(Color.rgb(layoutOut.modebar.bgcolor));
    zorla('color', Color.addOpacity(varsayilanRenk, 0.3));
    zorla('activecolor', Color.addOpacity(varsayilanRenk, 0.7));
    zorla('uirevision', layoutOut.uirevision);
    zorla('add');
    zorla('remove');
};
