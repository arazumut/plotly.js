'use strict';

/*
 * Bir yazı tipi (font) öznitelik grubu oluştur
 *
 * @param {object} seçenekler
 *   @param {string}
 *     seçenekler.açıklama: bu yazı tipinin nerede ve nasıl kullanıldığı
 *   @param {optional bool} arrayOk:
 *     her bir parça (family, size, color) arrayOk olmalı mı? varsayılan false.
 *   @param {string} düzenlemeTürü:
 *     bu yazı tipinin tüm parçaları için düzenleme türü
 *   @param {optional string} renkDüzenlemeTürü:
 *     sadece renk için ayrı bir düzenleme türü
 *
 * @return {object} {family, size, color} içeren öznitelikler nesnesi
 */
module.exports = function(seçenekler) {
    var varyantDeğerleri = seçenekler.varyantDeğerleri;
    var düzenlemeTürü = seçenekler.düzenlemeTürü;
    var renkDüzenlemeTürü = seçenekler.renkDüzenlemeTürü;
    if(renkDüzenlemeTürü === undefined) renkDüzenlemeTürü = düzenlemeTürü;

    var ağırlık = {
        düzenlemeTürü: düzenlemeTürü,
        değerTürü: 'integer',
        min: 1,
        max: 1000,
        ekstralar: ['normal', 'bold'],
        varsayılan: 'normal',
        açıklama: [
            'Yazı tipinin ağırlığını (veya kalınlığını) ayarlar.'
        ].join(' ')
    };

    if(seçenekler.sayıDeğeriOlmayanAğırlık) {
        ağırlık.değerTürü = 'enumerated';
        ağırlık.değerler = ağırlık.ekstralar;
        ağırlık.ekstralar = undefined;
        ağırlık.min = undefined;
        ağırlık.max = undefined;
    }

    var öznitelikler = {
        family: {
            değerTürü: 'string',
            boşOlmasın: true,
            katı: true,
            düzenlemeTürü: düzenlemeTürü,
            açıklama: [
                'HTML yazı tipi ailesi - web tarayıcısı tarafından uygulanacak yazı tipi.',
                'Web tarayıcısı, yalnızca sistemde mevcutsa bir yazı tipini uygulayabilir.',
                'Yazı tiplerini sistemde mevcut değilse uygulama sırasını belirtmek için',
                'virgülle ayrılmış birden fazla yazı tipi ailesi sağlayın.',
                'Chart Studio Cloud (https://chart-studio.plotly.com veya yerinde) sunucuda görüntüler oluşturur,',
                'sadece belirli sayıda yazı tipi yüklenmiş ve desteklenmiştir.',
                'Bunlar *Arial*, *Balto*, *Courier New*, *Droid Sans*, *Droid Serif*,',
                '*Droid Sans Mono*, *Gravitas One*, *Old Standard TT*, *Open Sans*, *Overpass*,',
                '*PT Sans Narrow*, *Raleway*, *Times New Roman* içerir.'
            ].join(' ')
        },
        size: {
            değerTürü: 'number',
            min: 1,
            düzenlemeTürü: düzenlemeTürü
        },
        color: {
            değerTürü: 'color',
            düzenlemeTürü: renkDüzenlemeTürü
        },

        ağırlık: ağırlık,

        stil: {
            düzenlemeTürü: düzenlemeTürü,
            değerTürü: 'enumerated',
            değerler: ['normal', 'italic'],
            varsayılan: 'normal',
            açıklama: [
                'Bir yazı tipinin normal veya italik yüzle stilize edilip edilmeyeceğini ayarlar.'
            ].join(' ')
        },

        varyant: seçenekler.yazıTipiVaryantıYok ? undefined : {
            düzenlemeTürü: düzenlemeTürü,
            değerTürü: 'enumerated',
            değerler: varyantDeğerleri || [
                'normal',
                'small-caps',
                'all-small-caps',
                'all-petite-caps',
                'petite-caps',
                'unicase'
            ],
            varsayılan: 'normal',
            açıklama: [
                'Yazı tipinin varyantını ayarlar.'
            ].join(' ')
        },

        metinDurumu: seçenekler.yazıTipiMetinDurumuYok ? undefined : {
            düzenlemeTürü: düzenlemeTürü,
            değerTürü: 'enumerated',
            değerler: ['normal', 'kelime büyük', 'büyük', 'küçük'],
            varsayılan: 'normal',
            açıklama: [
                'Metnin büyük/küçük harf durumunu ayarlar.',
                'Metni tamamen büyük harf veya tamamen küçük harf olarak görünmesini sağlar,',
                'veya her kelimenin baş harfi büyük olacak şekilde ayarlar.'
            ].join(' ')
        },

        çizgiKonumu: seçenekler.yazıTipiÇizgiKonumuYok ? undefined : {
            düzenlemeTürü: düzenlemeTürü,
            değerTürü: 'flaglist',
            bayraklar: ['alt', 'üst', 'üzerinden'],
            ekstralar: ['yok'],
            varsayılan: 'yok',
            açıklama: [
                'Metinle birlikte dekorasyon çizgisi türünü ayarlar,',
                'örneğin *alt*, *üst* veya *üzerinden*',
                'veya kombinasyonlar örn. *alt+üst*, vb.'
            ].join(' ')
        },

        gölge: seçenekler.yazıTipiGölgesiYok ? undefined : {
            düzenlemeTürü: düzenlemeTürü,
            değerTürü: 'string',
            varsayılan: seçenekler.otoGölgeVarsayılan ? 'auto' : 'yok',
            açıklama: [
                'Metnin arkasındaki gölgenin şeklini ve rengini ayarlar.',
                '*auto* minimal gölge yerleştirir ve kontrast metin yazı tipi rengini uygular.',
                'Ek seçenekler için bkz. https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow.'
            ].join(' ')
        },

        düzenlemeTürü: düzenlemeTürü,
        // boş dizeler böylece compress_attributes kaldırabilir
        // TODO - bu çok hileli... daha iyi bir çözüm?
        açıklama: '' + (seçenekler.açıklama || '') + ''
    };

    if(seçenekler.otoBoyut) öznitelikler.size.varsayılan = 'auto';
    if(seçenekler.otoRenk) öznitelikler.color.varsayılan = 'auto';

    if(seçenekler.arrayOk) {
        öznitelikler.family.arrayOk = true;
        öznitelikler.ağırlık.arrayOk = true;
        öznitelikler.stil.arrayOk = true;
        if(!seçenekler.yazıTipiVaryantıYok) {
            öznitelikler.varyant.arrayOk = true;
        }
        if(!seçenekler.yazıTipiMetinDurumuYok) {
            öznitelikler.metinDurumu.arrayOk = true;
        }
        if(!seçenekler.yazıTipiÇizgiKonumuYok) {
            öznitelikler.çizgiKonumu.arrayOk = true;
        }
        if(!seçenekler.yazıTipiGölgesiYok) {
            öznitelikler.gölge.arrayOk = true;
        }
        öznitelikler.size.arrayOk = true;
        öznitelikler.color.arrayOk = true;
    }

    return öznitelikler;
};
