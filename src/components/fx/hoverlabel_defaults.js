'use strict';

var Lib = require('../../lib');
var Color = require('../color');
var isUnifiedHover = require('./helpers').isUnifiedHover;

module.exports = function handleHoverLabelDefaults(girdi, çıktı, zorla, seçenekler) {
    seçenekler = seçenekler || {};

    var efsaneVar = çıktı.legend;

    function yazıTipiÖzelliğiniMirasAl(özellik) {
        if(!seçenekler.yazıTipi[özellik]) {
            seçenekler.yazıTipi[özellik] = efsaneVar ? çıktı.legend.yazıTipi[özellik] : çıktı.yazıTipi[özellik];
        }
    }

    // Birleşik hover modunda, layout.legend'den veya layout'tan miras al
    if(çıktı && isUnifiedHover(çıktı.hovermode)) {
        if(!seçenekler.yazıTipi) seçenekler.yazıTipi = {};
        yazıTipiÖzelliğiniMirasAl('boyut');
        yazıTipiÖzelliğiniMirasAl('aile');
        yazıTipiÖzelliğiniMirasAl('renk');
        yazıTipiÖzelliğiniMirasAl('ağırlık');
        yazıTipiÖzelliğiniMirasAl('stil');
        yazıTipiÖzelliğiniMirasAl('varyant');

        if(efsaneVar) {
            if(!seçenekler.arkaPlanRengi) seçenekler.arkaPlanRengi = Color.combine(çıktı.legend.arkaPlanRengi, çıktı.kağıtArkaPlanRengi);
            if(!seçenekler.kenarRengi) seçenekler.kenarRengi = çıktı.legend.kenarRengi;
        } else {
            if(!seçenekler.arkaPlanRengi) seçenekler.arkaPlanRengi = çıktı.kağıtArkaPlanRengi;
        }
    }

    zorla('hoverlabel.arkaPlanRengi', seçenekler.arkaPlanRengi);
    zorla('hoverlabel.kenarRengi', seçenekler.kenarRengi);
    zorla('hoverlabel.isimUzunluğu', seçenekler.isimUzunluğu);
    Lib.coerceFont(zorla, 'hoverlabel.yazıTipi', seçenekler.yazıTipi);
    zorla('hoverlabel.hizalama', seçenekler.hizalama);
};
