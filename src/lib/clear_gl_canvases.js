'use strict';

/**
 * GL çerçevesini temizle (varsa). Bu yaygın bir desendir çünkü
 * genellikle gl bağlamı oluşturma sırasında `preserveDrawingBuffer: true`
 * ayarlarız (örneğin `reglUtils.prepare` aracılığıyla).
 *
 * @param {DOM düğümü veya nesne} gd : grafik div nesnesi
 */
module.exports = function glKanvaslariniTemizle(gd) {
    var tamYerlesim = gd._fullLayout;

    if(tamYerlesim._glcanvas && tamYerlesim._glcanvas.size()) {
        tamYerlesim._glcanvas.each(function(d) {
            if(d.regl) d.regl.clear({color: true, depth: true});
        });
    }
};
