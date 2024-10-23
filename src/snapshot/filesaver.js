'use strict';

var Lib = require('../lib');
var helpers = require('./helpers');

/*
* Bu kodun önemli bir kısmı FileSaver.js'den alınmıştır
* https://github.com/eligrey/FileSaver.js
* Lisans: https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
* FileSaver.js
* Bir saveAs() FileSaver uygulaması.
* 1.1.20160328
*
* Eli Grey tarafından, http://eligrey.com
* Lisans: MIT
*   Bkz. https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
*/
function dosyaKaydedici(url, isim, format) {
    var kaydetLinki = document.createElement('a');
    var kaydetLinkiKullanilabilir = 'download' in kaydetLinki;

    var soz = new Promise(function(coz, reddet) {
        var blob;
        var nesneUrl;

        // IE 10+ (yerel saveAs)
        if(Lib.isIE()) {
            // Bu noktada sadece bir veri URL'si olarak kodlanmış bir SVG ile ilgileniyoruz
            // (çünkü IE sadece SVG'yi destekliyor)
            blob = helpers.createBlob(url, 'svg');
            window.navigator.msSaveBlob(blob, isim);
            blob = null;
            return coz(isim);
        }

        if(kaydetLinkiKullanilabilir) {
            blob = helpers.createBlob(url, format);
            nesneUrl = helpers.createObjectURL(blob);

            kaydetLinki.href = nesneUrl;
            kaydetLinki.download = isim;
            document.body.appendChild(kaydetLinki);
            kaydetLinki.click();

            document.body.removeChild(kaydetLinki);
            helpers.revokeObjectURL(nesneUrl);
            blob = null;

            return coz(isim);
        }

        // Safari'nin eski sürümleri blob URL'lerinin indirilmesine izin vermiyordu
        if(Lib.isSafari()) {
            var onEk = format === 'svg' ? ',' : ';base64,';
            helpers.octetStream(onEk + encodeURIComponent(url));
            return coz(isim);
        }

        reddet(new Error('indirme hatası'));
    });

    return soz;
}

module.exports = dosyaKaydedici;
