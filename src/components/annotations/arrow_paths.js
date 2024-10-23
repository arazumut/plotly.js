'use strict';

/**
 * Tüm yollar, ok başının maksimum ölçeklenebilirliği için ayarlanmıştır,
 * yani arrowwidth=0.3..3 boyunca baş, çizgiye düzgün bir şekilde bağlanır,
 * çizgi soldan gelir ve (0, 0) noktasında biter.
 *
 * `backoff`, ok başını ve çizginin sonunu hareket ettirme mesafesidir,
 * ok başının istenen yere, ya ok ucuna ya da (daire veya kare durumunda)
 * sembolün merkezine işaret etmesi için.
 *
 * `noRotate`, doğruysa, bu ok başının okla birlikte dönmemesi gerektiğini belirtir.
 * Bu, her zaman düz olması gereken kareler ve bunun önemsiz olduğu daireler için geçerlidir.
 */

module.exports = [
    // ok yok
    {
        path: '',
        backoff: 0
    },
    // geniş ve düz arka
    {
        path: 'M-2.4,-3V3L0.6,0Z',
        backoff: 0.6
    },
    // daha dar ve düz arka
    {
        path: 'M-3.7,-2.5V2.5L1.3,0Z',
        backoff: 1.3
    },
    // çentikli
    {
        path: 'M-4.45,-3L-1.65,-0.2V0.2L-4.45,3L1.55,0Z',
        backoff: 1.55
    },
    // geniş çizgi çizilmiş
    {
        path: 'M-2.2,-2.2L-0.2,-0.2V0.2L-2.2,2.2L-1.4,3L1.6,0L-1.4,-3Z',
        backoff: 1.6
    },
    // daha dar çizgi çizilmiş
    {
        path: 'M-4.4,-2.1L-0.6,-0.2V0.2L-4.4,2.1L-4,3L2,0L-4,-3Z',
        backoff: 2
    },
    // daire
    {
        path: 'M2,0A2,2 0 1,1 0,-2A2,2 0 0,1 2,0Z',
        backoff: 0,
        noRotate: true
    },
    // kare
    {
        path: 'M2,2V-2H-2V2Z',
        backoff: 0,
        noRotate: true
    }
];
