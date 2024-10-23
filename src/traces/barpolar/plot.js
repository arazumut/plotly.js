'use strict';

var d3 = require('@plotly/d3');
var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Drawing = require('../../components/drawing');
var helpers = require('../../plots/polar/helpers');

module.exports = function çiz(gd, altGrafik, cdbar) {
    var statikMi = gd._context.staticPlot;
    var xa = altGrafik.xaxis;
    var ya = altGrafik.yaxis;
    var radyalEksen = altGrafik.radialAxis;
    var açısalEksen = altGrafik.angularAxis;
    var yolFn = yolFonksiyonuYap(altGrafik);
    var barKatmanı = altGrafik.layers.frontplot.select('g.barlayer');

    Lib.makeTraceGroups(barKatmanı, cdbar, 'iz çubukları').each(function() {
        var grafikGrubu = d3.select(this);
        var noktaGrubu = Lib.ensureSingle(grafikGrubu, 'g', 'points');
        var çubuklar = noktaGrubu.selectAll('g.point').data(Lib.identity);

        çubuklar.enter().append('g')
            .style('vector-effect', statikMi ? 'none' : 'non-scaling-stroke')
            .style('stroke-miterlimit', 2)
            .classed('point', true);

        çubuklar.exit().remove();

        çubuklar.each(function(di) {
            var çubuk = d3.select(this);

            var rp0 = di.rp0 = radyalEksen.c2p(di.s0);
            var rp1 = di.rp1 = radyalEksen.c2p(di.s1);
            var thetag0 = di.thetag0 = açısalEksen.c2g(di.p0);
            var thetag1 = di.thetag1 = açısalEksen.c2g(di.p1);

            var yolD;

            if(!isNumeric(rp0) || !isNumeric(rp1) ||
                !isNumeric(thetag0) || !isNumeric(thetag1) ||
                rp0 === rp1 || thetag0 === thetag1
            ) {
                // Boş çubukları kaldırmayın, veri-düğüm eşlemesini
                // radyal sürükleme sırasında sağlam tutmak için
                // etkileşimler sırasında _module.style çağırmayı atlayabiliriz
                yolD = 'M0,0Z';
            } else {
                // Bu 'merkez' noktası seçimler ve hover etiketleri için kullanılır
                var rg1 = radyalEksen.c2g(di.s1);
                var thetagOrta = (thetag0 + thetag1) / 2;
                di.ct = [
                    xa.c2p(rg1 * Math.cos(thetagOrta)),
                    ya.c2p(rg1 * Math.sin(thetagOrta))
                ];

                yolD = yolFn(rp0, rp1, thetag0, thetag1);
            }

            Lib.ensureSingle(çubuk, 'path').attr('d', yolD);
        });

        // grafikGrubu'nu kırp, iz katmanı kırpılmadığında
        Drawing.setClipUrl(
            grafikGrubu,
            altGrafik._hasClipOnAxisFalse ? altGrafik.clipIds.forTraces : null,
            gd
        );
    });
};

function yolFonksiyonuYap(altGrafik) {
    var cxx = altGrafik.cxx;
    var cyy = altGrafik.cyy;

    if(altGrafik.vangles) {
        return function(r0, r1, _a0, _a1) {
            var a0, a1;

            if(Lib.angleDelta(_a0, _a1) > 0) {
                a0 = _a0;
                a1 = _a1;
            } else {
                a0 = _a1;
                a1 = _a0;
            }

            var va0 = helpers.findEnclosingVertexAngles(a0, altGrafik.vangles)[0];
            var va1 = helpers.findEnclosingVertexAngles(a1, altGrafik.vangles)[1];
            var vaÇubuk = [va0, (a0 + a1) / 2, va1];
            return helpers.pathPolygonAnnulus(r0, r1, a0, a1, vaÇubuk, cxx, cyy);
        };
    }

    return function(r0, r1, a0, a1) {
        return Lib.pathAnnulus(r0, r1, a0, a1, cxx, cyy);
    };
}
