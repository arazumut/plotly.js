'use strict';

var colorMix = require('tinycolor2').mix;
var colorAttrs = require('../../components/color/attributes');
var Lib = require('../../lib');

/**
 * @param {object} seçenekler :
 *   - varsayılanRenk {string} : varsayılan eksen rengi
 *   - arkaPlanRengi {string} : birleşik alt grafik arka plan rengi
 *   - karışım {number, optional} : karışım yüzdesi (varsayılan ızgara rengini hesaplamak için)
 *   - çizgiGöster {boolean} : varsayılan olarak çizgiyi göster
 *   - ızgaraGöster {boolean} : varsayılan olarak ızgarayı göster
 *   - sıfırÇizgisiYok {boolean} : sıfır çizgisi* özniteliklerini zorlamayın
 *   - öznitelikler {object} : giriş konteynerleriyle ilişkili öznitelik nesnesi
 */
module.exports = function çizgiIzgaraVarsayılanlarınıEleAl(girişKonteyneri, çıkışKonteyneri, zorla, seçenekler) {
    seçenekler = seçenekler || {};

    var varsayılanRenk = seçenekler.varsayılanRenk;

    function zorla2(özellik, varsayılan) {
        return Lib.zorla2(girişKonteyneri, çıkışKonteyneri, seçenekler.öznitelikler, özellik, varsayılan);
    }

    var çizgiRengi = zorla2('çizgirengi', varsayılanRenk);
    var çizgiGenişliği = zorla2('çizgigenişliği');
    var çizgiGöster = zorla('çizgiyiGöster', seçenekler.çizgiGöster || !!çizgiRengi || !!çizgiGenişliği);

    if(!çizgiGöster) {
        delete çıkışKonteyneri.çizgirengi;
        delete çıkışKonteyneri.çizgigenişliği;
    }

    var ızgaraRengiVarsayılan = colorMix(varsayılanRenk, seçenekler.arkaPlanRengi, seçenekler.karışım || colorAttrs.lightFraction).toRgbString();
    var ızgaraRengi = zorla2('ızgararengi', ızgaraRengiVarsayılan);
    var ızgaraGenişliği = zorla2('ızgaragenişliği');
    var ızgaraÇizgisi = zorla2('ızgaracizgisi');
    var ızgaraGöster = zorla('ızgarayıGöster', seçenekler.ızgaraGöster ||
        !!ızgaraRengi ||
        !!ızgaraGenişliği ||
        !!ızgaraÇizgisi
    );

    if(!ızgaraGöster) {
        delete çıkışKonteyneri.ızgararengi;
        delete çıkışKonteyneri.ızgaragenişliği;
        delete çıkışKonteyneri.ızgaracizgisi;
    }

    if(seçenekler.küçükIzgara) {
        var küçükIzgaraRengiVarsayılan = colorMix(çıkışKonteyneri.ızgararengi, seçenekler.arkaPlanRengi, 67).toRgbString();
        var küçükIzgaraRengi = zorla2('küçük.ızgararengi', küçükIzgaraRengiVarsayılan);
        var küçükIzgaraGenişliği = zorla2('küçük.ızgaragenişliği', çıkışKonteyneri.ızgaragenişliği || 1);
        var küçükIzgaraÇizgisi = zorla2('küçük.ızgaracizgisi', çıkışKonteyneri.ızgaracizgisi || 'solid');
        var küçükIzgaraGöster = zorla('küçük.ızgarayıGöster',
            !!küçükIzgaraRengi ||
            !!küçükIzgaraGenişliği ||
            !!küçükIzgaraÇizgisi
        );

        if(!küçükIzgaraGöster) {
            delete çıkışKonteyneri.küçük.ızgararengi;
            delete çıkışKonteyneri.küçük.ızgaragenişliği;
            delete çıkışKonteyneri.küçük.ızgaracizgisi;
        }
    }

    if(!seçenekler.sıfırÇizgisiYok) {
        var sıfırÇizgisiRengi = zorla2('sıfırçizgisirengi', varsayılanRenk);
        var sıfırÇizgisiGenişliği = zorla2('sıfırçizgisigenişliği');
        var sıfırÇizgisiGöster = zorla('sıfırçizgisiniGöster', seçenekler.ızgaraGöster || !!sıfırÇizgisiRengi || !!sıfırÇizgisiGenişliği);

        if(!sıfırÇizgisiGöster) {
            delete çıkışKonteyneri.sıfırçizgisirengi;
            delete çıkışKonteyneri.sıfırçizgisigenişliği;
        }
    }
};
