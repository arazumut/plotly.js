'use strict';

var EventEmitter = require('events').EventEmitter;

var Olaylar = {

    başlat: function(plotObj) {
        /*
         * Eğer bu grafik için zaten bir emitter oluşturduysak
         * erken dön.
         */
        if(plotObj._ev instanceof EventEmitter) return plotObj;

        var ev = new EventEmitter();
        var içEv = new EventEmitter();

        /*
         * plot._ev'ye atama yaparken hala
         * plot'un bir DOM elemanı olduğu bir dünyada yaşıyoruz.
         * Gelecekte plot'u doğrudan bir event emitter yapabiliriz.
         */
        plotObj._ev = ev;

        /*
         * İç olayları yönetecek ikinci bir olay işleyici oluştur.
         * Bu, plotly'nin yeniden düzenleme gibi şeylere yanıt vermesini sağlar
         * kullanıcıya yönelik olay işleyicisini kullanmadan. Aynı işleyicide
         * barış içinde bir arada bulunamazlar çünkü bir kullanıcı
         * plotObj.removeAllListeners() çağırdığında iç olayları
         * ayırır ve plotly'yi bozar.
         */
        plotObj._içEv = içEv;

        /*
         * ev'den bağlanmış yöntemleri plot nesnesine atayın. Bu yöntemler
         * plot._ev'nin 'this' referansını alacak, ancak plot'un yöntemleri olacak.
         * Bu, olay mekanizmasını plot nesnesinden uzak tutar
         * ki bu şu anda genellikle bir DOM elemanıdır, ancak plot bir emitter
         * olduğunda çalışmaya devam edecek bir API sunar. Tüm EventEmitter
         * yöntemleri `plot`a bağlanmamıştır çünkü bazıları şu anda
         * Plotly olay API'sine değer katmamaktadır.
         */
        plotObj.on = ev.on.bind(ev);
        plotObj.once = ev.once.bind(ev);
        plotObj.removeListener = ev.removeListener.bind(ev);
        plotObj.removeAllListeners = ev.removeAllListeners.bind(ev);

        /*
         * İç olayları yönetmek için işlevler oluşturun. Bunlar *yalnızca*
         * emit işlevi aracılığıyla dış olayların yansıtılmasıyla tetiklenir.
         */
        plotObj._içOn = içEv.on.bind(içEv);
        plotObj._içBirKez = içEv.once.bind(içEv);
        plotObj._içDinleyiciKaldır = içEv.removeListener.bind(içEv);
        plotObj._tümİçDinleyicileriKaldır = içEv.removeAllListeners.bind(içEv);

        plotObj.emit = function(olay, veri) {
            ev.emit(olay, veri);
            içEv.emit(olay, veri);
        };

        return plotObj;
    },

    /*
     * Bu işlev jQuery'nin triggerHandler'ı gibi davranır. Belirli bir olay için
     * tüm işleyicileri çağırır ve SON işleyicinin dönüş değerini döner.
     */
    tetikleyiciİşleyici: function(plotObj, olay, veri) {
        var düğümOlayİşleyiciDeğeri;

        /*
         * Şimdi tüm node tarzı olay işleyicilerini çalıştır
         */
        var ev = plotObj._ev;
        if(!ev) return;

        var işleyiciler = ev._events[olay];
        if(!işleyiciler) return;

        // 'this'in EventEmitter örneği olduğundan emin olun
        function uygula(işleyici) {
            // 'once' durumu, işleyiciyi sadece çağırmak yeterli değil
            // çünkü burada dönüş değerine ihtiyacımız var. Bu yüzden,
            // - işleyiciyi kaldır
            // - dinleyiciyi çağır ve dönüş değerini al!
            // - işleyiciyi iki kez çağırmamak için 'fired' anahtarını sakla
            if(işleyici.listener) {
                ev.removeListener(olay, işleyici.listener);
                if(!işleyici.fired) {
                    işleyici.fired = true;
                    return işleyici.listener.apply(ev, [veri]);
                }
            } else {
                return işleyici.apply(ev, [veri]);
            }
        }

        // işleyiciler işlev veya işlev dizisi olabilir
        işleyiciler = Array.isArray(işleyiciler) ? işleyiciler : [işleyiciler];

        var i;
        for(i = 0; i < işleyiciler.length - 1; i++) {
            uygula(işleyiciler[i]);
        }
        // şimdi son işleyiciyi çağır ve değerini topla
        düğümOlayİşleyiciDeğeri = uygula(işleyiciler[i]);

        return düğümOlayİşleyiciDeğeri;
    },

    temizle: function(plotObj) {
        delete plotObj._ev;
        delete plotObj.on;
        delete plotObj.once;
        delete plotObj.removeListener;
        delete plotObj.removeAllListeners;
        delete plotObj.emit;

        delete plotObj._ev;
        delete plotObj._içEv;
        delete plotObj._içOn;
        delete plotObj._içBirKez;
        delete plotObj._içDinleyiciKaldır;
        delete plotObj._tümİçDinleyicileriKaldır;

        return plotObj;
    }

};

module.exports = Olaylar;
