'use strict';

var setCursor = require('./setcursor');

var KAYITLI_ATTR = 'data-kayitlikursor';
var KURSOR_YOK = '!!';

/*
 * CSS kursor sınıflarımızla (bkz. css/_cursor.scss) çalışarak,
 * d3 tek element seçimlerinde daha önce ayarlanmış kursörü geçersiz kılar,
 * orijinal kursör adını data-kayitlikursor özelliğine taşır.
 * kursörü atlamayı, daha önce ayarlanmış değere geri dönmek için kullanın.
 */
module.exports = function kursorGecersizKil(el3, csr) {
    var kayitliKursor = el3.attr(KAYITLI_ATTR);
    if(csr) {
        if(!kayitliKursor) {
            var siniflar = (el3.attr('class') || '').split(' ');
            for(var i = 0; i < siniflar.length; i++) {
                var sinif = siniflar[i];
                if(sinif.indexOf('cursor-') === 0) {
                    el3.attr(KAYITLI_ATTR, sinif.substr(7))
                        .classed(sinif, false);
                }
            }
            if(!el3.attr(KAYITLI_ATTR)) {
                el3.attr(KAYITLI_ATTR, KURSOR_YOK);
            }
        }
        setCursor(el3, csr);
    } else if(kayitliKursor) {
        el3.attr(KAYITLI_ATTR, null);

        if(kayitliKursor === KURSOR_YOK) setCursor(el3);
        else setCursor(el3, kayitliKursor);
    }
};
