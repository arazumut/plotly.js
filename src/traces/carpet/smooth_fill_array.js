'use strict';

/*
 * Bir 1D diziyi doğrusal enterpolasyon ile doldur. Bu, 2D versiyonu için bazı temellerle
 * ölçeklendirmemiz gereken temeldir. Bu, bunu çok daha basit hale getirir. Sadece
 * döngü yap ve diziyi doldurmak için en iyisini yap.
 */
module.exports = function smoothFillArray(data) {
    var i, i0, i1;
    var n = data.length;

    // İlk tanımlı değeri bul
    for(i = 0; i < n; i++) {
        if(data[i] !== undefined) {
            i0 = i;
            break;
        }
    }

    // Son tanımlı değeri bul
    for(i = n - 1; i >= 0; i--) {
        if(data[i] !== undefined) {
            i1 = i;
            break;
        }
    }

    if(i0 === undefined) {
        // Tüm diziyi sıfırlarla doldur ve erken dön;
        for(i = 0; i < n; i++) {
            data[i] = 0;
        }

        return data;
    } else if(i0 === i1) {
        // Sadece bir veri noktası var, bu yüzden ekstrapolasyon yapamayız. Onunla doldur ve erken dön:
        for(i = 0; i < n; i++) {
            data[i] = data[i0];
        }

        return data;
    }

    var iA = i0;
    var iB;
    var m, b, dA, dB;

    // İç verileri doldur. Tanımsız bir noktaya geldiğimizde,
    // bir sonraki tanımlı noktaya kadar bak ve doğrusal olarak doldur:
    for(i = i0; i < i1; i++) {
        if(data[i] === undefined) {
            iA = iB = i;
            while(iB < i1 && data[iB] === undefined) iB++;

            dA = data[iA - 1];
            dB = data[iB];

            // Birçok değişken var, ama bu sadece mx + b:
            m = (dB - dA) / (iB - iA + 1);
            b = dA + (1 - iA) * m;

            // Bu dış döngü sayacını artırır. Bir linter şikayet edebilir, ama bu durumda amaç budur:
            for(i = iA; i < iB; i++) {
                data[i] = m * i + b;
            }

            i = iA = iB;
        }
    }

    // İlk veri noktasına kadar doldur:
    if(i0 > 0) {
        m = data[i0 + 1] - data[i0];
        b = data[i0];
        for(i = 0; i < i0; i++) {
            data[i] = m * (i - i0) + b;
        }
    }

    // Son veri noktasından sonra doldur:
    if(i1 < n - 1) {
        m = data[i1] - data[i1 - 1];
        b = data[i1];
        for(i = i1 + 1; i < n; i++) {
            data[i] = m * (i - i1) + b;
        }
    }

    return data;
};
