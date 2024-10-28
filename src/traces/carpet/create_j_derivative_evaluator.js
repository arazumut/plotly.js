'use strict';

// Bu modül, verilen bir dizi ve yumuşatma parametrelerine göre türev hesaplayıcı fonksiyon döndürür.
module.exports = function(diziler, aYumusatma, bYumusatma) {
    if(aYumusatma && bYumusatma) {
        return function(out, i0, j0, u, v) {
            if(!out) out = [];
            var f0, f1, f2, f3, ak, k;

            // Kontrol noktalarının bir ızgarası olduğu için, gerçek indeksler * 3 ile çarpılır:
            i0 *= 3;
            j0 *= 3;

            // Bazı sayıları önceden hesapla:
            var u2 = u * u;
            var u3 = u2 * u;
            var ou = 1 - u;
            var ou2 = ou * ou;
            var ou3 = ou2 * ou;

            var v2 = v * v;
            var ov = 1 - v;
            var ov2 = ov * ov;
            var ovv2 = ov * v * 2;
            var a = -3 * ov2;
            var b = 3 * (ov2 - ovv2);
            var c = 3 * (ovv2 - v2);
            var d = 3 * v2;

            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];

                // v yönünde türevleri hesapla:
                f0 = a * ak[j0][i0] + b * ak[j0 + 1][i0] + c * ak[j0 + 2][i0] + d * ak[j0 + 3][i0];
                f1 = a * ak[j0][i0 + 1] + b * ak[j0 + 1][i0 + 1] + c * ak[j0 + 2][i0 + 1] + d * ak[j0 + 3][i0 + 1];
                f2 = a * ak[j0][i0 + 2] + b * ak[j0 + 1][i0 + 2] + c * ak[j0 + 2][i0 + 2] + d * ak[j0 + 3][i0 + 2];
                f3 = a * ak[j0][i0 + 3] + b * ak[j0 + 1][i0 + 3] + c * ak[j0 + 2][i0 + 3] + d * ak[j0 + 3][i0 + 3];

                // Şimdi v yönünde interpolasyon yap:
                out[k] = ou3 * f0 + 3 * (ou2 * u * f1 + ou * u2 * f2) + u3 * f3;
            }

            return out;
        };
    } else if(aYumusatma) {
        // a yönünde yumuşatma, b yönünde lineer interpolasyon yapar
        return function(out, i0, j0, v, u) {
            if(!out) out = [];
            var f0, f1, f2, f3, k, ak;
            i0 *= 3;
            var u2 = u * u;
            var u3 = u2 * u;
            var ou = 1 - u;
            var ou2 = ou * ou;
            var ou3 = ou2 * ou;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];

                f0 = ak[j0 + 1][i0] - ak[j0][i0];
                f1 = ak[j0 + 1][i0 + 1] - ak[j0][i0 + 1];
                f2 = ak[j0 + 1][i0 + 2] - ak[j0][i0 + 2];
                f3 = ak[j0 + 1][i0 + 3] - ak[j0][i0 + 3];

                out[k] = ou3 * f0 + 3 * (ou2 * u * f1 + ou * u2 * f2) + u3 * f3;
            }
            return out;
        };
    } else if(bYumusatma) {
        // Yukarıdaki durumun tersini yapar:
        return function(out, i0, j0, u, v) {
            if(!out) out = [];
            var f0, f1, k, ak;
            j0 *= 3;
            var ou = 1 - u;
            var v2 = v * v;
            var ov = 1 - v;
            var ov2 = ov * ov;
            var ovv2 = ov * v * 2;
            var a = -3 * ov2;
            var b = 3 * (ov2 - ovv2);
            var c = 3 * (ovv2 - v2);
            var d = 3 * v2;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                f0 = a * ak[j0][i0] + b * ak[j0 + 1][i0] + c * ak[j0 + 2][i0] + d * ak[j0 + 3][i0];
                f1 = a * ak[j0][i0 + 1] + b * ak[j0 + 1][i0 + 1] + c * ak[j0 + 2][i0 + 1] + d * ak[j0 + 3][i0 + 1];

                out[k] = ou * f0 + u * f1;
            }
            return out;
        };
    } else {
        // Son olarak, her iki yönde de lineer interpolasyon yapar:
        return function(out, i0, j0, v, u) {
            if(!out) out = [];
            var f0, f1, k, ak;
            var ov = 1 - v;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                f0 = ak[j0 + 1][i0] - ak[j0][i0];
                f1 = ak[j0 + 1][i0 + 1] - ak[j0][i0 + 1];

                out[k] = ov * f0 + v * f1;
            }
            return out;
        };
    }
};
