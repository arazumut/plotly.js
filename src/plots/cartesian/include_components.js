'use strict';

var Registry = require('../../registry');
var Lib = require('../../lib');
var axisIds = require('./axis_ids');

/**
 * Alt grafik referansları için bileşen dizilerini kontrol eden fabrika fonksiyonu.
 *
 * @param {string} containerArrayName: gd.layout içindeki üst düzey diziyi kontrol eder
 *   Eğer bu konteynerde kartesyen x ve/veya y eksenine referans veren bir öğe bulunursa,
 *   kartesyenin bir temel grafik modülü olarak işaretlendiğinden emin olur ve eksenleri (ve
 *   her iki referans da eksen ise alt grafiği) gd._fullLayout içinde kaydeder.
 *
 * @return {function}: layoutIn (gd.layout) ve layoutOut (gd._fullLayout) argümanlarıyla
 * beklenen bir bileşen includeBasePlot yöntemi döner.
 */
module.exports = function bileşenleriDahilEtYapıcı(containerArrayName) {
    return function bileşenleriDahilEt(layoutIn, layoutOut) {
        var dizi = layoutIn[containerArrayName];
        if(!Array.isArray(dizi)) return;

        var Cartesian = Registry.subplotsRegistry.cartesian;
        var idRegex = Cartesian.idRegex;
        var altGrafikler = layoutOut._subplots;
        var xaList = altGrafikler.xaxis;
        var yaList = altGrafikler.yaxis;
        var kartesyenListesi = altGrafikler.cartesian;
        var kartesyenVar = layoutOut._has('cartesian');

        for(var i = 0; i < dizi.length; i++) {
            var öğei = dizi[i];
            if(!Lib.isPlainObject(öğei)) continue;

            // cleanId çağrısı yap çünkü xref veya yref bir şey eklenmişse
            // (örneğin, ' domain') bu kaldırılacaktır.
            var xref = axisIds.cleanId(öğei.xref, 'x', false);
            var yref = axisIds.cleanId(öğei.yref, 'y', false);

            var xrefVar = idRegex.x.test(xref);
            var yrefVar = idRegex.y.test(yref);
            if(xrefVar || yrefVar) {
                if(!kartesyenVar) Lib.pushUnique(layoutOut._basePlotModules, Cartesian);

                var yeniEksen = false;
                if(xrefVar && xaList.indexOf(xref) === -1) {
                    xaList.push(xref);
                    yeniEksen = true;
                }
                if(yrefVar && yaList.indexOf(yref) === -1) {
                    yaList.push(yref);
                    yeniEksen = true;
                }

                /*
                 * Buradaki mantığa dikkat edin: yalnızca bir bileşen için alt grafik ekleyin
                 * eğer hem x hem de y eksenlerine referans veriyorsa VE yeni bir eksen oluşturuyorsa
                 * örneğin, grafiğinizde zaten xy ve x2y2 varsa, x2y veya xy2 üzerindeki bir açıklama
                 * yeni bir alt grafik oluşturmaz.
                 */
                if(yeniEksen && xrefVar && yrefVar) {
                    kartesyenListesi.push(xref + yref);
                }
            }
        }
    };
};
