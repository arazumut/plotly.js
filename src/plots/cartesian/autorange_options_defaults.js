'use strict';

// Bu fonksiyon, otomatik aralık seçeneklerinin varsayılanlarını işler
module.exports = function handleAutorangeOptionsDefaults(coerce, autorange, range) {
    var minAralık, maxAralık;
    if(range) {
        var tersMi = (
            autorange === 'ters' ||
            autorange === 'min ters' ||
            autorange === 'max ters'
        );

        minAralık = range[tersMi ? 1 : 0];
        maxAralık = range[tersMi ? 0 : 1];
    }

    var minİzinVerilen = coerce('otomatikaralıkseçenekleri.minİzinVerilen', maxAralık === null ? minAralık : undefined);
    var maxİzinVerilen = coerce('otomatikaralıkseçenekleri.maxİzinVerilen', minAralık === null ? maxAralık : undefined);

    if(minİzinVerilen === undefined) coerce('otomatikaralıkseçenekleri.minKes');
    if(maxİzinVerilen === undefined) coerce('otomatikaralıkseçenekleri.maxKes');

    coerce('otomatikaralıkseçenekleri.dahilEt');
};
