'use strict';

// Pikselleştirilmiş görüntü işleme
// Gerçek CSS bildirimi, eski tarayıcılar için geri dönüşlerle öne eklenmiştir.
// Not: IE'nin `-ms-interpolation-mode` sadece <img> ile çalışır, SVG <image> ile değil
// https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
// https://caniuse.com/?search=image-rendering
// http://phrogz.net/tmp/canvas_image_zoom.html

exports.CSS_BILDIRIMLERI = [
    ['image-rendering', 'optimizeSpeed'],
    ['image-rendering', '-moz-crisp-edges'],
    ['image-rendering', '-o-crisp-edges'],
    ['image-rendering', '-webkit-optimize-contrast'],
    ['image-rendering', 'optimize-contrast'],
    ['image-rendering', 'crisp-edges'],
    ['image-rendering', 'pixelated']
];

exports.STIL = exports.CSS_BILDIRIMLERI.map(function(d) {
    return d.join(': ') + '; ';
}).join('');
