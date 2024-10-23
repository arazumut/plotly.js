'use strict';

// Legend (açıklama) düzeninin gruplandırılmış olup olmadığını kontrol eder
exports.gruplandırılmışMı = function gruplandırılmışMı(legendDüzeni) {
    return (legendDüzeni.izSırası || '').indexOf('gruplandırılmış') !== -1;
};

// Legend (açıklama) düzeninin dikey olup olmadığını kontrol eder
exports.dikeyMi = function dikeyMi(legendDüzeni) {
    return legendDüzeni.yön !== 'y';
};

// Legend (açıklama) düzeninin ters çevrilmiş olup olmadığını kontrol eder
exports.tersMi = function tersMi(legendDüzeni) {
    return (legendDüzeni.izSırası || '').indexOf('ters') !== -1;
};
