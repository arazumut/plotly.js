'use strict';

var d3 = require('@plotly/d3');

var Fx = require('../../components/fx');
var dragElement = require('../../components/dragelement');
var setCursor = require('../../lib/setcursor');

var makeDragBox = require('./dragbox').makeDragBox;
var DRAGGERSIZE = require('./constants').DRAGGERSIZE;

exports.initInteractions = function initInteractions(gd) {
    var fullLayout = gd._fullLayout;

    if(gd._context.staticPlot) {
        // Bu sadece kartesyen sürükleme elemanlarını değil, daha fazlasını temizler...
        d3.select(gd).selectAll('.drag').remove();
        return;
    }

    if(!fullLayout._has('cartesian') && !fullLayout._has('splom')) return;

    var subplots = Object.keys(fullLayout._plots || {}).sort(function(a, b) {
        // Önce bindirmeleri sıralar, sonra x ekseni numarasına, sonra y ekseni numarasına göre sıralar
        if((fullLayout._plots[a].mainplot && true) ===
            (fullLayout._plots[b].mainplot && true)) {
            var aParts = a.split('y');
            var bParts = b.split('y');
            return (aParts[0] === bParts[0]) ?
                (Number(aParts[1] || 1) - Number(bParts[1] || 1)) :
                (Number(aParts[0] || 1) - Number(bParts[0] || 1));
        }
        return fullLayout._plots[a].mainplot ? 1 : -1;
    });

    subplots.forEach(function(subplot) {
        var plotinfo = fullLayout._plots[subplot];
        var xa = plotinfo.xaxis;
        var ya = plotinfo.yaxis;

        // Ana ve köşe sürükleyiciler, bindirilmiş alt grafikler için tekrar edilmemelidir
        if(!plotinfo.mainplot) {
            // Ana sürükleyici ızgaraların ve verilerin üzerine gider, bu yüzden tüm veri hover efektleri için onun mousemove olaylarını kullanırız
            var maindrag = makeDragBox(gd, plotinfo, xa._offset, ya._offset,
                xa._length, ya._length, 'ns', 'ew');

            maindrag.onmousemove = function(evt) {
                // Bu `gd._fullLayout` üzerinde, çünkü referans bu tekrar çağrıldığında değişir.
                gd._fullLayout._rehover = function() {
                    if((gd._fullLayout._hoversubplot === subplot) && gd._fullLayout._plots[subplot]) {
                        Fx.hover(gd, evt, subplot);
                    }
                };

                Fx.hover(gd, evt, subplot);

                // Burada önbelleğe alınmış fullLayout değişkenini kullanmadığımıza dikkat edin
                // çünkü bu daha sonra bir geri çağırma olarak çağrıldığında güncel olmayabilir
                gd._fullLayout._lasthover = maindrag;
                gd._fullLayout._hoversubplot = subplot;
            };

            /*
             * ÖNEMLİ:
             * Burada sürükleme kapağının varlığını kontrol etmeliyiz.
             * Eğer yapmazsak, her 'click' olayından önce 'mouseout' olayı tetiklenir,
             * bu da hover verilerini temizler; böylece tıklama olayını iptal eder.
             */
            maindrag.onmouseout = function(evt) {
                if(gd._dragging) return;

                // Fare bu ana sürükleyiciden çıktığında, hover edilen alt grafiği kaldır.
                // Bu, fare doğrudan başka bir alt grafiğe geçtiğinde sorunlara neden olabilir,
                // ancak bu şu anda küçük bir köşe durumu.
                gd._fullLayout._hoversubplot = null;

                dragElement.unhover(gd, evt);
            };

            // köşe sürükleyiciler
            if(gd._context.showAxisDragHandles) {
                makeDragBox(gd, plotinfo, xa._offset - DRAGGERSIZE, ya._offset - DRAGGERSIZE,
                    DRAGGERSIZE, DRAGGERSIZE, 'n', 'w');
                makeDragBox(gd, plotinfo, xa._offset + xa._length, ya._offset - DRAGGERSIZE,
                    DRAGGERSIZE, DRAGGERSIZE, 'n', 'e');
                makeDragBox(gd, plotinfo, xa._offset - DRAGGERSIZE, ya._offset + ya._length,
                    DRAGGERSIZE, DRAGGERSIZE, 's', 'w');
                makeDragBox(gd, plotinfo, xa._offset + xa._length, ya._offset + ya._length,
                    DRAGGERSIZE, DRAGGERSIZE, 's', 'e');
            }
        }
        if(gd._context.showAxisDragHandles) {
            // x ekseni sürükleyiciler - bindirilmiş grafikleriniz varsa,
            // bu her ekseni ayrı ayrı sürükler
            if(subplot === xa._mainSubplot) {
                // ana x ekseni çizgisinin y konumu
                var y0 = xa._mainLinePosition;
                if(xa.side === 'top') y0 -= DRAGGERSIZE;
                makeDragBox(gd, plotinfo, xa._offset + xa._length * 0.1, y0,
                    xa._length * 0.8, DRAGGERSIZE, '', 'ew');
                makeDragBox(gd, plotinfo, xa._offset, y0,
                    xa._length * 0.1, DRAGGERSIZE, '', 'w');
                makeDragBox(gd, plotinfo, xa._offset + xa._length * 0.9, y0,
                    xa._length * 0.1, DRAGGERSIZE, '', 'e');
            }
            // y ekseni sürükleyiciler
            if(subplot === ya._mainSubplot) {
                // ana y ekseni çizgisinin x konumu
                var x0 = ya._mainLinePosition;
                if(ya.side !== 'right') x0 -= DRAGGERSIZE;
                makeDragBox(gd, plotinfo, x0, ya._offset + ya._length * 0.1,
                    DRAGGERSIZE, ya._length * 0.8, 'ns', '');
                makeDragBox(gd, plotinfo, x0, ya._offset + ya._length * 0.9,
                    DRAGGERSIZE, ya._length * 0.1, 's', '');
                makeDragBox(gd, plotinfo, x0, ya._offset,
                    DRAGGERSIZE, ya._length * 0.1, 'n', '');
            }
        }
    });

    // Hover metni üzerinde fare hareket ettirdiğinizde, bunu Fx.hover'a da gönderin
    // bunu yapıyoruz çünkü hover metnini her şeyin önüne koyabiliriz,
    // ancak her şeyle etkileşime girebiliriz sanki orada değilmiş gibi
    var hoverLayer = fullLayout._hoverlayer.node();

    hoverLayer.onmousemove = function(evt) {
        evt.target = gd._fullLayout._lasthover;
        Fx.hover(gd, evt, fullLayout._hoversubplot);
    };

    hoverLayer.onclick = function(evt) {
        evt.target = gd._fullLayout._lasthover;
        Fx.click(gd, evt);
    };

    // ayrıca fare basmalarını da delege et... TODO: bu gerçekten çalışıyor mu?
    hoverLayer.onmousedown = function(evt) {
        gd._fullLayout._lasthover.onmousedown(evt);
    };

    exports.updateFx(gd);
};

// 'modebar' düzenlemelerinde gereken minimal güncelleme seti.
// Sadece <g .draglayer> imleç stilini güncellememiz gerekiyor.
//
// Eksen yapılandırmasını ve/veya fixedrange özniteliğini değiştirmek
// tam bir initInteractions tetiklemelidir.
exports.updateFx = function(gd) {
    var fullLayout = gd._fullLayout;
    var cursor = fullLayout.dragmode === 'pan' ? 'move' : 'crosshair';
    setCursor(fullLayout._draggers, cursor);
};
