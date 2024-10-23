'use strict';

// Bu modül, belirli noktaları seçmek için kullanılır.
module.exports = function noktalarıSeç(searchInfo, seçimTesti) {
    var cd = searchInfo.cd;
    var xa = searchInfo.xaxis;
    var ya = searchInfo.yaxis;
    var iz = cd[0].trace;
    var huniMi = (iz.type === 'funnel');
    var yatayMi = (iz.orientation === 'h');
    var seçim = [];
    var i;

    if(seçimTesti === false) {
        // Seçimi temizle
        for(i = 0; i < cd.length; i++) {
            cd[i].selected = 0;
        }
    } else {
        for(i = 0; i < cd.length; i++) {
            var di = cd[i];
            var ct = 'ct' in di ? di.ct : merkezNoktası(di, xa, ya, yatayMi, huniMi);

            if(seçimTesti.contains(ct, false, i, searchInfo)) {
                seçim.push({
                    pointNumber: i,
                    x: xa.c2d(di.x),
                    y: ya.c2d(di.y)
                });
                di.selected = 1;
            } else {
                di.selected = 0;
            }
        }
    }

    return seçim;
};

// Merkez noktasını hesaplayan fonksiyon
function merkezNoktası(d, xa, ya, yatayMi, huniMi) {
    var x0 = xa.c2p(yatayMi ? d.s0 : d.p0, true);
    var x1 = xa.c2p(yatayMi ? d.s1 : d.p1, true);
    var y0 = ya.c2p(yatayMi ? d.p0 : d.s0, true);
    var y1 = ya.c2p(yatayMi ? d.p1 : d.s1, true);

    if(huniMi) {
        return [(x0 + x1) / 2, (y0 + y1) / 2];
    } else {
        if(yatayMi) {
            return [x1, (y0 + y1) / 2];
        } else {
            return [(x0 + x1) / 2, y1];
        }
    }
}
