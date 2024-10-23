'use strict';

var isNumeric = require('fast-isnumeric');
var isMobileOrTablet = require('is-mobile');

module.exports = function çizimTamponunuKoru(opts) {
    var kullanıcıAjanı;

    if(opts && opts.hasOwnProperty('userAgent')) {
        kullanıcıAjanı = opts.userAgent;
    } else {
        kullanıcıAjanı = kullanıcıAjanınıAl();
    }

    if(typeof kullanıcıAjanı !== 'string') return true;

    var etkinleştir = isMobileOrTablet({
        ua: { headers: {'user-agent': kullanıcıAjanı }},
        tablet: true,
        featureDetect: false
    });

    if(!etkinleştir) {
        var tümParçalar = kullanıcıAjanı.split(' ');
        for(var i = 1; i < tümParçalar.length; i++) {
            var parça = tümParçalar[i];
            if(parça.indexOf('Safari') !== -1) {
                // Safari sürümünü bul
                for(var k = i - 1; k > -1; k--) {
                    var öncekiParça = tümParçalar[k];
                    if(öncekiParça.substr(0, 8) === 'Version/') {
                        var sürüm = öncekiParça.substr(8).split('.')[0];
                        if(isNumeric(sürüm)) sürüm = +sürüm;
                        if(sürüm >= 13) return true;
                    }
                }
            }
        }
    }

    return etkinleştir;
};

function kullanıcıAjanınıAl() {
    // https://github.com/juliangruber/is-mobile/blob/91ca39ccdd4cfc5edfb5391e2515b923a730fbea/index.js#L14-L17 benzeri
    var kullanıcıAjanı;
    if(typeof navigator !== 'undefined') {
        kullanıcıAjanı = navigator.userAgent;
    }

    if(
        kullanıcıAjanı &&
        kullanıcıAjanı.headers &&
        typeof kullanıcıAjanı.headers['user-agent'] === 'string'
    ) {
        kullanıcıAjanı = kullanıcıAjanı.headers['user-agent'];
    }

    return kullanıcıAjanı;
}
