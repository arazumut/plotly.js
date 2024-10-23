'use strict';

var d3 = require('@plotly/d3');
var Color = require('../color');
var ARROWPATHS = require('./arrow_paths');
var Lib = require('../../lib');
var strScale = Lib.strScale;
var strRotate = Lib.strRotate;
var strTranslate = Lib.strTranslate;

/**
 * Bir yol veya çizgi elemanına ok başı ekler
 *
 * @param {d3.selection} el3: d3 ile seçilmiş bir çizgi veya yol elemanı
 *
 * @param {string} ends: 'none', 'start', 'end' veya 'start+end' hangi uçların ok başı alacağını belirtir
 *
 * @param {object} options: stil bilgisi. Aşağıdaki tüm özelliklere sahip olmalıdır:
 * @param {number} options.arrowhead: uç başı stili - bkz. ./arrow_paths
 * @param {number} options.startarrowhead: başlangıç başı stili - bkz. ./arrow_paths
 * @param {number} options.arrowsize: uç başının çizgi genişliğine göre göreceli boyutu
 * @param {number} options.startarrowsize: başlangıç başının çizgi genişliğine göre göreceli boyutu
 * @param {number} options.standoff: uç ok noktasını hedefinden uzaklaştırmak için piksel cinsinden mesafe
 * @param {number} options.startstandoff: başlangıç ok noktasını hedefinden uzaklaştırmak için piksel cinsinden mesafe
 * @param {number} options.arrowwidth: ok çizgisinin genişliği
 * @param {string} options.arrowcolor: ok çizgisinin rengi, başın da bu renkle uyumlu olması için
 *     Bu rengin opaklığı göz ardı edilir, çünkü çizgi ve başın kapsayıcısının opaklığına sahip olduğu varsayılır,
 *     böylece üst üste geldiklerinde daha fazla opaklık olmaz.
 */
module.exports = function drawArrowHead(el3, ends, options) {
    var el = el3.node();
    var headStyle = ARROWPATHS[options.arrowhead || 0];
    var startHeadStyle = ARROWPATHS[options.startarrowhead || 0];
    var scale = (options.arrowwidth || 1) * (options.arrowsize || 1);
    var startScale = (options.arrowwidth || 1) * (options.startarrowsize || 1);
    var doStart = ends.indexOf('start') >= 0;
    var doEnd = ends.indexOf('end') >= 0;
    var backOff = headStyle.backoff * scale + options.standoff;
    var startBackOff = startHeadStyle.backoff * startScale + options.startstandoff;

    var start, end, startRot, endRot;

    if(el.nodeName === 'line') {
        start = {x: +el3.attr('x1'), y: +el3.attr('y1')};
        end = {x: +el3.attr('x2'), y: +el3.attr('y2')};

        var dx = start.x - end.x;
        var dy = start.y - end.y;

        startRot = Math.atan2(dy, dx);
        endRot = startRot + Math.PI;
        if(backOff && startBackOff) {
            if(backOff + startBackOff > Math.sqrt(dx * dx + dy * dy)) {
                hideLine();
                return;
            }
        }

        if(backOff) {
            if(backOff * backOff > dx * dx + dy * dy) {
                hideLine();
                return;
            }
            var backOffX = backOff * Math.cos(startRot);
            var backOffY = backOff * Math.sin(startRot);

            end.x += backOffX;
            end.y += backOffY;
            el3.attr({x2: end.x, y2: end.y});
        }

        if(startBackOff) {
            if(startBackOff * startBackOff > dx * dx + dy * dy) {
                hideLine();
                return;
            }
            var startBackOffX = startBackOff * Math.cos(startRot);
            var startbackOffY = startBackOff * Math.sin(startRot);

            start.x -= startBackOffX;
            start.y -= startbackOffY;
            el3.attr({x1: start.x, y1: start.y});
        }
    } else if(el.nodeName === 'path') {
        var pathlen = el.getTotalLength();
        // yolun backOff bölgesini gizlemek için dash kullanılıyor.
        // eğer ok için dash'a izin verirsek, bu hileden daha iyisini yapmamız gerekecek...
        // belki sadece ikisini manuel olarak birleştiririz
        var dashArray = '';

        if(pathlen < backOff + startBackOff) {
            hideLine();
            return;
        }

        var start0 = el.getPointAtLength(0);
        var dstart = el.getPointAtLength(0.1);

        startRot = Math.atan2(start0.y - dstart.y, start0.x - dstart.x);
        start = el.getPointAtLength(Math.min(startBackOff, pathlen));

        dashArray = '0px,' + startBackOff + 'px,';

        var end0 = el.getPointAtLength(pathlen);
        var dend = el.getPointAtLength(pathlen - 0.1);

        endRot = Math.atan2(end0.y - dend.y, end0.x - dend.x);
        end = el.getPointAtLength(Math.max(0, pathlen - backOff));

        var shortening = dashArray ? startBackOff + backOff : backOff;
        dashArray += (pathlen - shortening) + 'px,' + pathlen + 'px';

        el3.style('stroke-dasharray', dashArray);
    }

    function hideLine() { el3.style('stroke-dasharray', '0px,100px'); }

    function drawhead(arrowHeadStyle, p, rot, arrowScale) {
        if(!arrowHeadStyle.path) return;
        if(arrowHeadStyle.noRotate) rot = 0;

        d3.select(el.parentNode).append('path')
            .attr({
                class: el3.attr('class'),
                d: arrowHeadStyle.path,
                transform:
                    strTranslate(p.x, p.y) +
                    strRotate(rot * 180 / Math.PI) +
                    strScale(arrowScale)
            })
            .style({
                fill: Color.rgb(options.arrowcolor),
                'stroke-width': 0
            });
    }

    if(doStart) drawhead(startHeadStyle, start, startRot, startScale);
    if(doEnd) drawhead(headStyle, end, endRot, scale);
};
