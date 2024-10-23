'use strict';

var d3 = require('@plotly/d3');
var isNumeric = require('fast-isnumeric');

var NOTEDATA = [];

/**
 * bildirimci
 * @param {String} metin Kullanıcının adı
 * @param {Number} [gösterimSüresi=1000] Milisaniye cinsinden gecikme süresi
 *          veya 'uzun' 2000 ms gecikme süresi sağlar.
 * @return {undefined} bu fonksiyon bir değer döndürmez
 */
module.exports = function(metin, gösterimSüresi) {
    if(NOTEDATA.indexOf(metin) !== -1) return;

    NOTEDATA.push(metin);

    var ts = 1000;
    if(isNumeric(gösterimSüresi)) ts = gösterimSüresi;
    else if(gösterimSüresi === 'uzun') ts = 3000;

    var bildirimciKonteyner = d3.select('body')
        .selectAll('.plotly-bildirimci')
        .data([0]);
    bildirimciKonteyner.enter()
        .append('div')
        .classed('plotly-bildirimci', true);

    var notlar = bildirimciKonteyner.selectAll('.bildirimci-notu').data(NOTEDATA);

    function notuYokEt(geçiş) {
        geçiş
            .duration(700)
            .style('opacity', 0)
            .each('end', function(buMetin) {
                var buIndex = NOTEDATA.indexOf(buMetin);
                if(buIndex !== -1) NOTEDATA.splice(buIndex, 1);
                d3.select(this).remove();
            });
    }

    notlar.enter().append('div')
        .classed('bildirimci-notu', true)
        .style('opacity', 0)
        .each(function(buMetin) {
            var not = d3.select(this);

            not.append('button')
                .classed('bildirimci-kapat', true)
                .html('&times;')
                .on('click', function() {
                    not.transition().call(notuYokEt);
                });

            var p = not.append('p');
            var satırlar = buMetin.split(/<br\s*\/?>/g);
            for(var i = 0; i < satırlar.length; i++) {
                if(i) p.append('br');
                p.append('span').text(satırlar[i]);
            }

            if(gösterimSüresi === 'yapışkan') {
                not.transition()
                        .duration(350)
                        .style('opacity', 1);
            } else {
                not.transition()
                        .duration(700)
                        .style('opacity', 1)
                    .transition()
                        .delay(ts)
                        .call(notuYokEt);
            }
        });
};
