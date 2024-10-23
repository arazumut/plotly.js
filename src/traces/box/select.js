'use strict';

// Bu modül, belirli noktaları seçmek için kullanılır.
module.exports = function noktalarıSeç(aramaBilgisi, seçimTesti) {
    var cd = aramaBilgisi.cd;
    var xa = aramaBilgisi.xaxis;
    var ya = aramaBilgisi.yaxis;
    var seçim = [];
    var i, j;

    if(seçimTesti === false) {
        for(i = 0; i < cd.length; i++) {
            for(j = 0; j < (cd[i].pts || []).length; j++) {
                // seçimi temizle
                cd[i].pts[j].selected = 0;
            }
        }
    } else {
        for(i = 0; i < cd.length; i++) {
            for(j = 0; j < (cd[i].pts || []).length; j++) {
                var pt = cd[i].pts[j];
                var x = xa.c2p(pt.x);
                var y = ya.c2p(pt.y);

                if(seçimTesti.contains([x, y], null, pt.i, aramaBilgisi)) {
                    seçim.push({
                        pointNumber: pt.i,
                        x: xa.c2d(pt.x),
                        y: ya.c2d(pt.y)
                    });
                    pt.selected = 1;
                } else {
                    pt.selected = 0;
                }
            }
        }
    }

    return seçim;
};
