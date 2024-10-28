'use strict';

// Gerekli modülleri dahil et
var d3 = require('@plotly/d3');
var Color = require('../../components/color');
var Drawing = require('../../components/drawing');
var Colorscale = require('../../components/colorscale');

// Stil fonksiyonu
function stil(gd, hesaplananIz) {
    if(hesaplananIz) stilIz(gd, hesaplananIz);
}

// İz stil fonksiyonu
function stilIz(gd, hesaplananIz) {
    var iz = hesaplananIz[0].iz;
    var s = hesaplananIz[0].node3;
    var konumlar = s.selectAll('.choroplethlocation');
    var marker = iz.marker || {};
    var markerCizgi = marker.line || {};

    var renkOlcegiFonksiyonu = Colorscale.makeColorScaleFuncFromTrace(iz);

    konumlar.each(function(d) {
        d3.select(this)
            .attr('fill', renkOlcegiFonksiyonu(d.z))
            .call(Color.stroke, d.mlc || markerCizgi.color)
            .call(Drawing.dashLine, '', d.mlw || markerCizgi.width || 0)
            .style('opacity', marker.opacity);
    });

    Drawing.selectedPointStyle(konumlar, iz);
}

// Seçim üzerine stil fonksiyonu
function secimUzerineStil(gd, hesaplananIz) {
    var s = hesaplananIz[0].node3;
    var iz = hesaplananIz[0].iz;

    if(iz.selectedpoints) {
        Drawing.selectedPointStyle(s.selectAll('.choroplethlocation'), iz);
    } else {
        stilIz(gd, hesaplananIz);
    }
}

// Modülleri dışa aktar
module.exports = {
    stil: stil,
    secimUzerineStil: secimUzerineStil
};
