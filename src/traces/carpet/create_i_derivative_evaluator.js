'use strict';

/*
 * Kontrol noktası dizilerinin türevini hesaplar. Yani, bicubic kontrol noktalarını içerecek şekilde
 * ham verilere göre genişletilmiş diziler bekler. Eğer sadece lineer interpolasyon isteniyorsa, o
 * eksendeki veri noktaları verinin kendisiyle birebir eşleşir. Catmull-rom splineleri her iki yönde
 * olduğundan, özellikle türevlerin hücre sınırları boyunca süreksiz olduğunu unutmayın. Bu nedenle
 * hem *hücre* hem de *hücre içindeki nokta* gereklidir.
 *
 * Ayrıca türevin süreksizliği sadece büyüklükte olur. Yön hücre sınırları boyunca süreklidir.
 *
 * Örneğin, hem x hem de y ekseninde bicubic yumuşatma verilmişken, 7. ve 8. i-ızgara noktaları ile
 * 10. ve 11. j-ızgara noktaları arasında x koordinatının türevini hesaplamak için:
 *
 *     var türev = iTürevDeğerlendiriciOluştur([x], 1, 1);
 *
 *     var dxdi = türev([], 7, 10, 0.5, 0.5);
 *     // => [0.12345]
 *
 * Birden fazla türev hesaplamak için, daha fazla dizi sağlayarak bu işlemi çoğaltabilirsiniz:
 *
 *     var türev = iTürevDeğerlendiriciOluştur([x, y], 1, 1);
 *
 *     var dxdi = türev([], 7, 10, 0.5, 0.5);
 *     // => [0.12345, 0.78910]
 *
 * NB: Bu noktada tüm verilerin temizlendiği ve doğru boyutta sayısal veri dizileri olduğu varsayılır.
 */
module.exports = function(diziler, aYumuşatma, bYumuşatma) {
    if(aYumuşatma && bYumuşatma) {
        return function(çıkış, i0, j0, u, v) {
            if(!çıkış) çıkış = [];
            var f0, f1, f2, f3, ak, k;

            // Kontrol noktaları ızgarası olduğundan, gerçek indeksler * 3:
            i0 *= 3;
            j0 *= 3;

            // Bazı sayıları önceden hesaplayın:
            var u2 = u * u;
            var ou = 1 - u;
            var ou2 = ou * ou;
            var ouu2 = ou * u * 2;
            var a = -3 * ou2;
            var b = 3 * (ou2 - ouu2);
            var c = 3 * (ouu2 - u2);
            var d = 3 * u2;

            var v2 = v * v;
            var v3 = v2 * v;
            var ov = 1 - v;
            var ov2 = ov * ov;
            var ov3 = ov2 * ov;

            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                // u yönünde türevleri hesaplayın:
                f0 = a * ak[j0 ][i0] + b * ak[j0 ][i0 + 1] + c * ak[j0 ][i0 + 2] + d * ak[j0 ][i0 + 3];
                f1 = a * ak[j0 + 1][i0] + b * ak[j0 + 1][i0 + 1] + c * ak[j0 + 1][i0 + 2] + d * ak[j0 + 1][i0 + 3];
                f2 = a * ak[j0 + 2][i0] + b * ak[j0 + 2][i0 + 1] + c * ak[j0 + 2][i0 + 2] + d * ak[j0 + 2][i0 + 3];
                f3 = a * ak[j0 + 3][i0] + b * ak[j0 + 3][i0 + 1] + c * ak[j0 + 3][i0 + 2] + d * ak[j0 + 3][i0 + 3];

                // Şimdi v yönünde interpolasyon yapın çünkü hepsi ayrılabilir:
                çıkış[k] = ov3 * f0 + 3 * (ov2 * v * f1 + ov * v2 * f2) + v3 * f3;
            }

            return çıkış;
        };
    } else if(aYumuşatma) {
        // a yönünde yumuşak ama b yönünde lineer olan durumu dört lineer interpolasyon ve bir kübik interpolasyon ile ele alın
        return function(çıkış, i0, j0, u, v) {
            if(!çıkış) çıkış = [];
            var f0, f1, k, ak;
            i0 *= 3;
            var u2 = u * u;
            var ou = 1 - u;
            var ou2 = ou * ou;
            var ouu2 = ou * u * 2;
            var a = -3 * ou2;
            var b = 3 * (ou2 - ouu2);
            var c = 3 * (ouu2 - u2);
            var d = 3 * u2;
            var ov = 1 - v;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                f0 = a * ak[j0 ][i0] + b * ak[j0 ][i0 + 1] + c * ak[j0 ][i0 + 2] + d * ak[j0 ][i0 + 3];
                f1 = a * ak[j0 + 1][i0] + b * ak[j0 + 1][i0 + 1] + c * ak[j0 + 1][i0 + 2] + d * ak[j0 + 1][i0 + 3];

                çıkış[k] = ov * f0 + v * f1;
            }
            return çıkış;
        };
    } else if(bYumuşatma) {
        // Yukarıdaki durumun tersi. Bu fonksiyonun tamamen interpolasyon-agnostik olması için no-unused-vars kuralını devre dışı bıraktım.
        /* eslint-disable no-unused-vars */
        return function(çıkış, i0, j0, u, v) {
        /* eslint-enable no-unused-vars */
            if(!çıkış) çıkış = [];
            var f0, f1, f2, f3, k, ak;
            j0 *= 3;
            var v2 = v * v;
            var v3 = v2 * v;
            var ov = 1 - v;
            var ov2 = ov * ov;
            var ov3 = ov2 * ov;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                f0 = ak[j0][i0 + 1] - ak[j0][i0];
                f1 = ak[j0 + 1][i0 + 1] - ak[j0 + 1][i0];
                f2 = ak[j0 + 2][i0 + 1] - ak[j0 + 2][i0];
                f3 = ak[j0 + 3][i0 + 1] - ak[j0 + 3][i0];

                çıkış[k] = ov3 * f0 + 3 * (ov2 * v * f1 + ov * v2 * f2) + v3 * f3;
            }
            return çıkış;
        };
    } else {
        // Son olarak, her iki yönde de lineer:
        /* eslint-disable no-unused-vars */
        return function(çıkış, i0, j0, u, v) {
        /* eslint-enable no-unused-vars */
            if(!çıkış) çıkış = [];
            var f0, f1, k, ak;
            var ov = 1 - v;
            for(k = 0; k < diziler.length; k++) {
                ak = diziler[k];
                f0 = ak[j0][i0 + 1] - ak[j0][i0];
                f1 = ak[j0 + 1][i0 + 1] - ak[j0 + 1][i0];

                çıkış[k] = ov * f0 + v * f1;
            }
            return çıkış;
        };
    }
};
