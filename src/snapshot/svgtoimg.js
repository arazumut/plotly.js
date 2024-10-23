'use strict';

var Lib = require('../lib');
var EventEmitter = require('events').EventEmitter;

var yardimcilar = require('./helpers');

function svgToImg(ayarlar) {
    var olayYayici = ayarlar.yayici || new EventEmitter();

    var soz = new Promise(function(coz, reddet) {
        var Resim = window.Image;
        var svg = ayarlar.svg;
        var format = ayarlar.format || 'png';

        // IE sadece svg destekler
        if(Lib.isIE() && format !== 'svg') {
            var ieSvgHatasi = new Error(yardimcilar.MSG_IE_BAD_FORMAT);
            reddet(ieSvgHatasi);
            // sonunda olayYayici'yı kaldır
            //  sözlere tercih et
            if(!ayarlar.soz) {
                return olayYayici.emit('hata', ieSvgHatasi);
            } else {
                return soz;
            }
        }

        var tuval = ayarlar.tuval;
        var olcek = ayarlar.olcek || 1;
        var w0 = ayarlar.genislik || 300;
        var h0 = ayarlar.yukseklik || 150;
        var w1 = olcek * w0;
        var h1 = olcek * h0;

        var ctx = tuval.getContext('2d', {willReadFrequently: true});
        var resim = new Resim();
        var svgBlob, url;

        if(format === 'svg' || Lib.isSafari()) {
            url = yardimcilar.encodeSVG(svg);
        } else {
            svgBlob = yardimcilar.createBlob(svg, 'svg');
            url = yardimcilar.createObjectURL(svgBlob);
        }

        tuval.width = w1;
        tuval.height = h1;

        resim.onload = function() {
            var resimVerisi;

            svgBlob = null;
            yardimcilar.revokeObjectURL(url);

            // svg ise tuvale çizmek gerekmez
            //  zaman kazanın ve ayrıca IE'de başarısızlığı önleyin
            if(format !== 'svg') {
                ctx.drawImage(resim, 0, 0, w1, h1);
            }

            switch(format) {
                case 'jpeg':
                    resimVerisi = tuval.toDataURL('image/jpeg');
                    break;
                case 'png':
                    resimVerisi = tuval.toDataURL('image/png');
                    break;
                case 'webp':
                    resimVerisi = tuval.toDataURL('image/webp');
                    break;
                case 'svg':
                    resimVerisi = url;
                    break;
                default:
                    var hataMesaji = 'Resim formatı jpeg, png, svg veya webp değil.';
                    reddet(new Error(hataMesaji));
                    // sonunda olayYayici'yı kaldır
                    //  sözlere tercih et
                    if(!ayarlar.soz) {
                        return olayYayici.emit('hata', hataMesaji);
                    }
            }
            coz(resimVerisi);
            // sonunda olayYayici'yı kaldır
            //  sözlere tercih et
            if(!ayarlar.soz) {
                olayYayici.emit('basari', resimVerisi);
            }
        };

        resim.onerror = function(hata) {
            svgBlob = null;
            yardimcilar.revokeObjectURL(url);

            reddet(hata);
            // sonunda olayYayici'yı kaldır
            //  sözlere tercih et
            if(!ayarlar.soz) {
                return olayYayici.emit('hata', hata);
            }
        };

        resim.src = url;
    });

    // geçici olarak geriye dönük uyumluluk için
    //  2.0.0'da sadece Promise'e geç
    //  ve EventEmitter'ı ortadan kaldır
    if(ayarlar.soz) {
        return soz;
    }

    return olayYayici;
}

module.exports = svgToImg;
