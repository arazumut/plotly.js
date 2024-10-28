'use strict';

// Bu modül, belirli noktaları seçmek için kullanılır.
module.exports = function selectPoints(searchInfo, selectionTester) {
    var cd = searchInfo.cd; // Veri dizisi
    var xa = searchInfo.xaxis; // X ekseni
    var ya = searchInfo.yaxis; // Y ekseni
    var selection = []; // Seçilen noktaların listesi

    var i, di, ct, x, y;

    // Eğer selectionTester false ise, tüm noktaları seçilmemiş olarak işaretle
    if(selectionTester === false) {
        for(i = 0; i < cd.length; i++) {
            cd[i].selected = 0;
        }
    } else {
        // Aksi takdirde, selectionTester kullanarak noktaları seç
        for(i = 0; i < cd.length; i++) {
            di = cd[i];
            ct = di.ct;

            if(!ct) continue; // Eğer ct yoksa, bu noktayı atla

            x = xa.c2p(ct); // X koordinatını hesapla
            y = ya.c2p(ct); // Y koordinatını hesapla

            // Eğer selectionTester bu noktayı içeriyorsa, seçime ekle
            if(selectionTester.contains([x, y], null, i, searchInfo)) {
                selection.push({
                    pointNumber: i,
                    lon: ct[0],
                    lat: ct[1]
                });
                di.selected = 1; // Noktayı seçilmiş olarak işaretle
            } else {
                di.selected = 0; // Noktayı seçilmemiş olarak işaretle
            }
        }
    }

    return selection; // Seçilen noktaları döndür
};
