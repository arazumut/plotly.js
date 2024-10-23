'use strict';

// Bir matris ve vektör üzerinde dönüşüm işlemi yapan fonksiyon
function donusumMatrisi(m, v) {
    var sonuc = [0, 0, 0, 0];
    var i, j;

    for(i = 0; i < 4; ++i) {
        for(j = 0; j < 4; ++j) {
            sonuc[j] += m[4 * i + j] * v[i];
        }
    }

    return sonuc;
}

// Kamera ve vektör kullanarak projeksiyon işlemi yapan fonksiyon
function projekteEt(kamera, v) {
    var p = donusumMatrisi(kamera.projeksiyon,
        donusumMatrisi(kamera.gorunum,
        donusumMatrisi(kamera.model, [v[0], v[1], v[2], 1])));
    return p;
}

module.exports = projekteEt;
