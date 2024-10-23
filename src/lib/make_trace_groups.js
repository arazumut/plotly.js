'use strict';

var d3 = require('@plotly/d3');

/**
 * Hesaplanmış veri (calcdata) temelinde iz gruplarını yönetmek için genel yardımcı
 *
 * @param {d3.selection} traceLayer: bu izleri çizmek için tek bir grup içeren bir seçim
 * @param {array} cdModule: bu modül ve alt grafik kombinasyonu için hesaplanmış veri öğeleri dizisi.
 *     Her iz için hesaplanmış veri öğesinin, ilk öğeye eklenmiş tam veri izini içerdiğini varsayar.
 * @param {string} cls: her iz grubuna vermek için sınıf niteliği,
 *     böylece birden fazla sınıfı boşluklarla ayırarak verebilirsiniz
 */
module.exports = function izGruplarınıOluştur(traceLayer, cdModule, cls) {
    var izler = traceLayer.selectAll('g.' + cls.replace(/\s/g, '.'))
        .data(cdModule, function(cd) { return cd[0].trace.uid; });

    izler.exit().remove();

    izler.enter().append('g')
        .attr('class', cls);

    izler.order();

    // Hesaplanmış veride iz grubuna referans düğümünü sakla,
    // (hızlı) styleOnSelect için kullanışlı
    var k = traceLayer.classed('rangeplot') ? 'nodeRangePlot3' : 'node3';
    izler.each(function(cd) { cd[0][k] = d3.select(this); });

    return izler;
};
