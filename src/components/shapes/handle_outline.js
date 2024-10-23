'use strict';

// Çerçeve kontrolcülerini temizle
function cerceveKontrolculeriniTemizle(gd) {
    var zoomKatmani = gd._fullLayout._zoomlayer;
    if(zoomKatmani) {
        zoomKatmani.selectAll('.outline-controllers').remove();
    }
}

// Çerçeveyi temizle
function cerceveyiTemizle(gd) {
    var zoomKatmani = gd._fullLayout._zoomlayer;
    if(zoomKatmani) {
        // Kalıcı seçimlere geçene kadar, çerçeveyi burada kaldır.
        // Seçimin kendisi, çizim sonunda yeniden çizildiğinde kaldırılacaktır.
        zoomKatmani.selectAll('.select-outline').remove();
    }

    gd._fullLayout._outlining = false;
}

module.exports = {
    cerceveKontrolculeriniTemizle: cerceveKontrolculeriniTemizle,
    cerceveyiTemizle: cerceveyiTemizle
};
