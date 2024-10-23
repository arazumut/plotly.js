'use strict';

var isArrayOrTypedArray = require('../../lib').isArrayOrTypedArray;

/*
 * a, b ve bir eğim (slope) verilerek hileli (cheater) değerlerin 2D bir dizisini oluşturur.
 */
module.exports = function(a, b, cheaterslope) {
    var i, j, ascal, bscal, aval, bval;
    var data = [];

    var na = isArrayOrTypedArray(a) ? a.length : a;
    var nb = isArrayOrTypedArray(b) ? b.length : b;
    var adata = isArrayOrTypedArray(a) ? a : null;
    var bdata = isArrayOrTypedArray(b) ? b : null;

    // Eğer veri kullanıyorsak, veriyi ölçeklendiririz ki
    // veriler tam olarak eşit aralıklı olmasa bile, değer tabanlı indekslemeye geçiş sürekli olsun.
    // Bu, eşit aralıklı verilerin değer veya indeks hile türü olup olmadığına bakılmaksızın aynı görünmesini sağlar.
    if(adata) {
        ascal = (adata.length - 1) / (adata[adata.length - 1] - adata[0]) / (na - 1);
    }

    if(bdata) {
        bscal = (bdata.length - 1) / (bdata[bdata.length - 1] - bdata[0]) / (nb - 1);
    }

    var xval;
    var xmin = Infinity;
    var xmax = -Infinity;
    for(j = 0; j < nb; j++) {
        data[j] = [];
        bval = bdata ? (bdata[j] - bdata[0]) * bscal : j / (nb - 1);
        for(i = 0; i < na; i++) {
            aval = adata ? (adata[i] - adata[0]) * ascal : i / (na - 1);
            xval = aval - bval * cheaterslope;
            xmin = Math.min(xval, xmin);
            xmax = Math.max(xval, xmax);
            data[j][i] = xval;
        }
    }

    // Hileli değerleri 0-1 aralığına normalize et. Bu, birden fazla hileli grafik olduğunda devreye girer.
    // Dikkatli bir değerlendirmeden sonra, hileli değerlerin tutarlı bir aralığa normalize edilmesinin daha iyi olduğu görülmüştür.
    // Aksi takdirde, bir hileli grafik aynı eksendeki diğer hileli grafiklerin düzenini etkiler.
    var slope = 1.0 / (xmax - xmin);
    var offset = -xmin * slope;
    for(j = 0; j < nb; j++) {
        for(i = 0; i < na; i++) {
            data[j][i] = slope * data[j][i] + offset;
        }
    }

    return data;
};
