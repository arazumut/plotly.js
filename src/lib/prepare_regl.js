'use strict';

var showNoWebGlMsg = require('./show_no_webgl_msg');

// Bu modülün SADECE regl izleme modüllerine karşılık gelen
// dosyalara dahil edilmesi gerektiğini unutmayın
// böylece sadece regl olmayan paketler
// regl ve tüm baytlarını içermez.
var createRegl = require('regl');

/**
 * Idempotent createRegl versiyonu. Regl örneklerini
 * doğru kanvaslarda doğru öznitelikler ve
 * seçeneklerle oluşturur.
 *
 * @param {DOM düğümü veya nesne} gd : grafik div nesnesi
 * @param {dizi} extensions : createRegl'e geçilecek uzantı listesi
 *
 * @return {boolean} tüm createRegl çağrıları başarılı olduysa true, aksi takdirde false
 */
module.exports = function prepareRegl(gd, extensions, reglPrecompiled) {
    var fullLayout = gd._fullLayout;
    var success = true;

    fullLayout._glcanvas.each(function(d) {
        if(d.regl) {
            d.regl.preloadCachedCode(reglPrecompiled);
            return;
        }
        // sadece parcoords seçim katmanına ihtiyaç duyar
        if(d.pick && !fullLayout._has('parcoords')) return;

        try {
            d.regl = createRegl({
                canvas: this,
                attributes: {
                    antialias: !d.pick,
                    preserveDrawingBuffer: true
                },
                pixelRatio: gd._context.plotGlPixelRatio || global.devicePixelRatio,
                extensions: extensions || [],
                cachedCode: reglPrecompiled || {}
            });
        } catch(e) {
            success = false;
        }

        if(!d.regl) success = false;

        if(success) {
            this.addEventListener('webglcontextlost', function(event) {
                if(gd && gd.emit) {
                    gd.emit('plotly_webglcontextlost', {
                        event: event,
                        layer: d.key
                    });
                }
            }, false);
        }
    });

    if(!success) {
        showNoWebGlMsg({container: fullLayout._glcontainer.node()});
    }
    return success;
};
