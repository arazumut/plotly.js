'use strict';

module.exports = {
    segmentRE: /[MLHVQCTSZ][^MLHVQCTSZ]*/g,
    paramRE: /[^\s,]+/g,

    // Her yol segmentindeki hangi sayılar x (veya y) değerleridir
    // drawn, hangi parametrenin çizilmiş bir nokta olduğunu belirtir,
    // kontrol noktası (autorange sınırlarına dahil olmayan) değil.
    // TODO: Bu, eğri yolların autorange sınırlarının ötesine geçebileceği
    // anlamına gelir. Bunu doğru yapmak biraz zor, bounding box'lara
    // dönmedikçe, ancak belki yapabileceğimiz bir hesaplama vardır...
    paramIsX: {
        M: {0: true, drawn: 0},
        L: {0: true, drawn: 0},
        H: {0: true, drawn: 0},
        V: {},
        Q: {0: true, 2: true, drawn: 2},
        C: {0: true, 2: true, 4: true, drawn: 4},
        T: {0: true, drawn: 0},
        S: {0: true, 2: true, drawn: 2},
        // A: {0: true, 5: true},
        Z: {}
    },

    paramIsY: {
        M: {1: true, drawn: 1},
        L: {1: true, drawn: 1},
        H: {},
        V: {0: true, drawn: 0},
        Q: {1: true, 3: true, drawn: 3},
        C: {1: true, 3: true, 5: true, drawn: 5},
        T: {1: true, drawn: 1},
        S: {1: true, 3: true, drawn: 3},
        // A: {1: true, 6: true},
        Z: {}
    },

    numParams: {
        M: 2,
        L: 2,
        H: 1,
        V: 1,
        Q: 4,
        C: 6,
        T: 2,
        S: 4,
        // A: 7,
        Z: 0
    }
};
