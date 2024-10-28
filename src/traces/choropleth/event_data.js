'use strict';

// Bu modül, olay verilerini işlemek için kullanılır
module.exports = function olayVerisi(out, pt, iz, cd, noktaNumarası) {
    out.konum = pt.konum;
    out.z = pt.z;

    // Girdi geojson'dan özellikleri dahil et
    var cdi = cd[noktaNumarası];
    if(cdi.fIn && cdi.fIn.özellikler) {
        out.özellikler = cdi.fIn.özellikler;
    }
    out.ct = cdi.ct;

    return out;
};
