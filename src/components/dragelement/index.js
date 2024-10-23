'use strict';

var mouseOffset = require('mouse-event-offset');
var hasHover = require('has-hover');
var supportsPassive = require('has-passive-events');

var removeElement = require('../../lib').removeElement;
var constants = require('../../plots/cartesian/constants');

var dragElement = module.exports = {};

dragElement.align = require('./align');
dragElement.getCursor = require('./cursor');

var unhover = require('./unhover');
dragElement.unhover = unhover.wrapped;
dragElement.unhoverRaw = unhover.raw;

/**
 * Tıklama ve sürükleme etkileşimlerini soyutlar
 *
 * Etkileşim sırasında, tüm sayfayı kaplayan şeffaf bir "coverSlip" elemanı oluşturulur,
 * bu iki ana etkiye sahiptir:
 * - Grafiğin sınırlarının ötesine sürüklemenize izin verir
 * - İmleci dondurur: etkileşim başladığında sürükleme elemanının sahip olduğu fare imleci
 *   coverSlip'e kopyalanır ve mouseup'a kadar kullanılır
 *
 * Kullanıcı MINDRAG'den daha büyük bir sürükleme gerçekleştirirse, geri çağırmalar şu şekilde çalışır:
 *      prepFn, moveFn (bir veya daha fazla kez), doneFn
 * Kullanıcı yeterince sürüklemezse, prepFn ve clickFn çalışır.
 *
 * Not: contextmenu'yu iptal ederseniz, clickFn sağ tıklama ile bile çalışır
 * (yerel olayların aksine) bu nedenle bir `plotly_click` olayı alırsınız. Contextmenu'yu iptal etmek için:
 *    gd.addEventListener('contextmenu', function(e) { e.preventDefault(); });
 * TODO: Bunu bir `config` parametresine dönüştürmeliyiz, böylece contextmenu'yu iptal etmezseniz,
 * kısmi sürüklemeleri önleyebiliriz, bu da sizi garip bir duruma sokar.
 *
 * Kullanıcı hızlı bir şekilde birden fazla kez tıklarsa, clickFn her seferinde çalışır
 * ancak numClicks artar, böylece çift tıklamaları tanıyabilirsiniz.
 *
 * @param {object} options anahtarları ile:
 *      element (gerekli) sürüklenecek DOM elemanı
 *      prepFn (isteğe bağlı) function(event, startX, startY)
 *          mousedown'da çalıştırılır
 *          startX ve startY, mousedown olayının clientX ve clientY piksel konumlarıdır
 *      moveFn (isteğe bağlı) function(dx, dy)
 *          hareket sırasında çalıştırılır, SADECE MINDRAG'i aştıktan sonra
 *          (başladığınız yere geri dönerseniz moveFn çalışmaya devam eder)
 *          dx ve dy sürüklemenin net piksel ofsetidir,
 *          dragged true/false, fare yeterince hareket etti mi
 *          sürükleme oluşturmak için
 *      doneFn (isteğe bağlı) function(e)
 *          mouseup'da çalıştırılır, SADECE MINDRAG'i aştıysak (bu nedenle moveFn'in en az bir kez çalıştığından emin olabilirsiniz)
 *          numClicks, bir çift tıklama süresi içinde kaydettiğimiz tıklama sayısıdır
 *          e orijinal mouseup olayıdır
 *      clickFn (isteğe bağlı) function(numClicks, e)
 *          mouseup'da çalıştırılır, eğer MINDRAG'i aşmadıysak (yani moveFn hiç çalışmadıysa)
 *          numClicks, bir çift tıklama süresi içinde kaydettiğimiz tıklama sayısıdır
 *          e orijinal mousedown olayıdır
 *      clampFn (isteğe bağlı, function(dx, dy) return [dx2, dy2])
 *          Küçük yer değiştirmeler için özel sıkıştırma işlevi sağlayın.
 *          Varsayılan olarak, sıkıştırma x ve y yer değiştirmelerine `minDrag` kullanılarak yapılır.
 */
dragElement.init = function init(options) {
    var gd = options.gd;
    var numClicks = 1;
    var doubleClickDelay = gd._context.doubleClickDelay;
    var element = options.element;

    var startX,
        startY,
        newMouseDownTime,
        cursor,
        dragCover,
        initialEvent,
        initialTarget,
        rightClick;

    if(!gd._mouseDownTime) gd._mouseDownTime = 0;

    element.style.pointerEvents = 'all';

    element.onmousedown = onStart;

    if(!supportsPassive) {
        element.ontouchstart = onStart;
    } else {
        if(element._ontouchstart) {
            element.removeEventListener('touchstart', element._ontouchstart);
        }
        element._ontouchstart = onStart;
        element.addEventListener('touchstart', onStart, {passive: false});
    }

    function _clampFn(dx, dy, minDrag) {
        if(Math.abs(dx) < minDrag) dx = 0;
        if(Math.abs(dy) < minDrag) dy = 0;
        return [dx, dy];
    }

    var clampFn = options.clampFn || _clampFn;

    function onStart(e) {
        gd._dragged = false;
        gd._dragging = true;
        var offset = pointerOffset(e);
        startX = offset[0];
        startY = offset[1];
        initialTarget = e.target;
        initialEvent = e;
        rightClick = e.buttons === 2 || e.ctrlKey;

        if(typeof e.clientX === 'undefined' && typeof e.clientY === 'undefined') {
            e.clientX = startX;
            e.clientY = startY;
        }

        newMouseDownTime = (new Date()).getTime();
        if(newMouseDownTime - gd._mouseDownTime < doubleClickDelay) {
            numClicks += 1;
        } else {
            numClicks = 1;
            gd._mouseDownTime = newMouseDownTime;
        }

        if(options.prepFn) options.prepFn(e, startX, startY);

        if(hasHover && !rightClick) {
            dragCover = coverSlip();
            dragCover.style.cursor = window.getComputedStyle(element).cursor;
        } else if(!hasHover) {
            dragCover = document;
            cursor = window.getComputedStyle(document.documentElement).cursor;
            document.documentElement.style.cursor = window.getComputedStyle(element).cursor;
        }

        document.addEventListener('mouseup', onDone);
        document.addEventListener('touchend', onDone);

        if(options.dragmode !== false) {
            e.preventDefault();
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, {passive: false});
        }

        return;
    }

    function onMove(e) {
        e.preventDefault();

        var offset = pointerOffset(e);
        var minDrag = options.minDrag || constants.MINDRAG;
        var dxdy = clampFn(offset[0] - startX, offset[1] - startY, minDrag);
        var dx = dxdy[0];
        var dy = dxdy[1];

        if(dx || dy) {
            gd._dragged = true;
            dragElement.unhover(gd, e);
        }

        if(gd._dragged && options.moveFn && !rightClick) {
            gd._dragdata = {
                element: element,
                dx: dx,
                dy: dy
            };
            options.moveFn(dx, dy);
        }

        return;
    }

    function onDone(e) {
        delete gd._dragdata;

        if(options.dragmode !== false) {
            e.preventDefault();
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
        }

        document.removeEventListener('mouseup', onDone);
        document.removeEventListener('touchend', onDone);

        if(hasHover) {
            removeElement(dragCover);
        } else if(cursor) {
            dragCover.documentElement.style.cursor = cursor;
            cursor = null;
        }

        if(!gd._dragging) {
            gd._dragged = false;
            return;
        }
        gd._dragging = false;

        if((new Date()).getTime() - gd._mouseDownTime > doubleClickDelay) {
            numClicks = Math.max(numClicks - 1, 1);
        }

        if(gd._dragged) {
            if(options.doneFn) options.doneFn();
        } else {
            if(options.clickFn) options.clickFn(numClicks, initialEvent);

            if(!rightClick) {
                var e2;

                try {
                    e2 = new MouseEvent('click', e);
                } catch(err) {
                    var offset = pointerOffset(e);
                    e2 = document.createEvent('MouseEvents');
                    e2.initMouseEvent('click',
                        e.bubbles, e.cancelable,
                        e.view, e.detail,
                        e.screenX, e.screenY,
                        offset[0], offset[1],
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                        e.button, e.relatedTarget);
                }

                initialTarget.dispatchEvent(e2);
            }
        }

        gd._dragging = false;
        gd._dragged = false;
        return;
    }
};

function coverSlip() {
    var cover = document.createElement('div');

    cover.className = 'dragcover';
    var cStyle = cover.style;
    cStyle.position = 'fixed';
    cStyle.left = 0;
    cStyle.right = 0;
    cStyle.top = 0;
    cStyle.bottom = 0;
    cStyle.zIndex = 999999999;
    cStyle.background = 'none';

    document.body.appendChild(cover);

    return cover;
}

dragElement.coverSlip = coverSlip;

function pointerOffset(e) {
    return mouseOffset(
        e.changedTouches ? e.changedTouches[0] : e,
        document.body
    );
}
