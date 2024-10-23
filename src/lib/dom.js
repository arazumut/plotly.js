'use strict';

var d3 = require('@plotly/d3');
var loggers = require('./loggers');
var matrix = require('./matrix');
var mat4X4 = require('gl-mat4');

/**
 * Bir grafik DOM elemanına doğrudan veya id stringi ile referans vermeyi sağlar
 *
 * @param {HTMLDivElement|string} gd: bir grafik elemanı veya onun id'si
 *
 * @returns {HTMLDivElement} grafiğin DOM elemanı
 */
function getGraphDiv(gd) {
    var gdElement;

    if(typeof gd === 'string') {
        gdElement = document.getElementById(gd);

        if(gdElement === null) {
            throw new Error('Sayfada \'' + gd + '\' id\'li bir DOM elemanı yok.');
        }

        return gdElement;
    } else if(gd === null || gd === undefined) {
        throw new Error('Sağlanan DOM elemanı null veya undefined');
    }

    // aksi takdirde gd'nin bir DOM elemanı olduğunu varsay
    return gd;
}

function isPlotDiv(el) {
    var el3 = d3.select(el);
    return el3.node() instanceof HTMLElement &&
        el3.size() &&
        el3.classed('js-plotly-plot');
}

function removeElement(el) {
    var elParent = el && el.parentNode;
    if(elParent) elParent.removeChild(el);
}

/**
 * Dinamik olarak stil kuralları eklemek için
 * Bu fonksiyonun tüm çağrıları tarafından eklenen kuralları içeren bir stil sayfası oluşturur
 */
function addStyleRule(selector, styleString) {
    addRelatedStyleRule('global', selector, styleString);
}

/**
 * Dinamik olarak stil kuralları eklemek için
 * Bir uid ile benzersiz olarak tanımlanan bir stil sayfasına
 */
function addRelatedStyleRule(uid, selector, styleString) {
    var id = 'plotly.js-style-' + uid;
    var style = document.getElementById(id);
    if(!style) {
        style = document.createElement('style');
        style.setAttribute('id', id);
        // WebKit hack :(
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
    }
    var styleSheet = style.sheet;

    if(styleSheet.insertRule) {
        styleSheet.insertRule(selector + '{' + styleString + '}', 0);
    } else if(styleSheet.addRule) {
        styleSheet.addRule(selector, styleString, 0);
    } else loggers.warn('addStyleRule başarısız oldu');
}

/**
 * Belirli bir uid ile tanımlanan bir stil sayfasını sayfadan kaldırmak için
 */
function deleteRelatedStyleRule(uid) {
    var id = 'plotly.js-style-' + uid;
    var style = document.getElementById(id);
    if(style) removeElement(style);
}

function getFullTransformMatrix(element) {
    var allElements = getElementAndAncestors(element);
    // kimlik matrisi
    var out = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    allElements.forEach(function(e) {
        var t = getElementTransformMatrix(e);
        if(t) {
            var m = matrix.convertCssMatrix(t);
            out = mat4X4.multiply(out, out, m);
        }
    });
    return out;
}

/**
 * Bir elemandan 2D CSS stil dönüşüm matrisini çıkarır ve ayrıştırır
 */
function getElementTransformMatrix(element) {
    var style = window.getComputedStyle(element, null);
    var transform = (
      style.getPropertyValue('-webkit-transform') ||
      style.getPropertyValue('-moz-transform') ||
      style.getPropertyValue('-ms-transform') ||
      style.getPropertyValue('-o-transform') ||
      style.getPropertyValue('transform')
    );

    if(transform === 'none') return null;
    // dönüşüm, matrix(a, b, ...) veya matrix3d(...) biçiminde bir stringdir
    return transform
        .replace('matrix', '')
        .replace('3d', '')
        .slice(1, -1)
        .split(',')
        .map(function(n) { return +n; });
}

/**
 * Belirtilen elemanın (kendisi dahil) tüm DOM elemanlarını alır
 */
function getElementAndAncestors(element) {
    var allElements = [];
    while(isTransformableElement(element)) {
        allElements.push(element);
        element = element.parentNode;
        if(typeof ShadowRoot === 'function' && element instanceof ShadowRoot) {
            element = element.host;
        }
    }
    return allElements;
}

function isTransformableElement(element) {
    return element && (element instanceof Element || element instanceof HTMLElement);
}

function equalDomRects(a, b) {
    return (
        a && b &&
        a.top === b.top &&
        a.left === b.left &&
        a.right === b.right &&
        a.bottom === b.bottom
    );
}

module.exports = {
    getGraphDiv: getGraphDiv,
    isPlotDiv: isPlotDiv,
    removeElement: removeElement,
    addStyleRule: addStyleRule,
    addRelatedStyleRule: addRelatedStyleRule,
    deleteRelatedStyleRule: deleteRelatedStyleRule,
    getFullTransformMatrix: getFullTransformMatrix,
    getElementTransformMatrix: getElementTransformMatrix,
    getElementAndAncestors: getElementAndAncestors,
    equalDomRects: equalDomRects
};
