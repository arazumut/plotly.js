'use strict';

// Bu fonksiyon, verilen 'pt' nesnesindeki verileri 'out' nesnesine ekler ve 'out' nesnesini geri döner.
module.exports = function olayVerisi(out, pt) {
    out.lon = pt.lon; // Boylam bilgisini ekler
    out.lat = pt.lat; // Enlem bilgisini ekler
    out.z = pt.z;     // Z değerini ekler
    return out;       // Güncellenmiş 'out' nesnesini geri döner
};
