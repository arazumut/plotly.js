'use strict';

var Kayıt = require('../../registry');
var hover = require('./hover').hover;

module.exports = function tıklama(gd, evt, altGrafik) {
    var açıklamalarTamamlandı = Kayıt.getComponentMethod('annotations', 'onClick')(gd, gd._hoverdata);

    // Alt grafiğin geçilmediği durumlar için yedekleme.
    // Örneğin, Ternary geçmedi, ancak test edildiği için yakalandı.
    if(altGrafik !== undefined) {
        // Sonundaki true bayrağı, hangi noktanın tıklandığını belirlemek için hover hesaplamasını yeniden çalıştırır.
        // Bu olmadan, tıklama biraz güvenilmezdir.
        hover(gd, evt, altGrafik, true);
    }

    function tıklamaYayımla() { gd.emit('plotly_click', {noktalar: gd._hoverdata, olay: evt}); }

    if(gd._hoverdata && evt && evt.target) {
        if(açıklamalarTamamlandı && açıklamalarTamamlandı.then) {
            açıklamalarTamamlandı.then(tıklamaYayımla);
        } else tıklamaYayımla();

        // Bu olmadan neden çift olay alıyoruz???
        if(evt.stopImmediatePropagation) evt.stopImmediatePropagation();
    }
};
