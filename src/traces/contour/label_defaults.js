'use strict';

// Gerekli kütüphaneyi dahil et
var Lib = require('../../lib');

// Etiket varsayılanlarını işlemek için fonksiyon
module.exports = function etiketVarsayilanlariniIsle(coerce, layout, cizgiRengi, secenekler) {
    // Eğer seçenekler yoksa boş bir obje olarak ayarla
    if(!secenekler) secenekler = {};
    
    // Etiketlerin gösterilip gösterilmeyeceğini belirle
    var etiketleriGoster = coerce('contours.showlabels');
    if(etiketleriGoster) {
        // Genel yazı tipini al
        var genelYaziTipi = layout.font;
        
        // Yazı tipi ayarlarını zorla
        Lib.coerceFont(coerce, 'contours.labelfont', genelYaziTipi, { overrideDflt: {
            color: cizgiRengi
        }});
        
        // Etiket formatını zorla
        coerce('contours.labelformat');
    }

    // Eğer hover özelliği kapalı değilse zhoverformat'ı zorla
    if(secenekler.hasHover !== false) coerce('zhoverformat');
};
