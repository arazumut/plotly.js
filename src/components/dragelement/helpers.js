'use strict';

// Seçim modunu kontrol eder
exports.secimModu = function(dragmode) {
    return (
        dragmode === 'lasso' ||
        dragmode === 'select'
    );
};

// Çizim modunu kontrol eder
exports.cizimModu = function(dragmode) {
    return (
        dragmode === 'drawclosedpath' ||
        dragmode === 'drawopenpath' ||
        dragmode === 'drawline' ||
        dragmode === 'drawrect' ||
        dragmode === 'drawcircle'
    );
};

// Açık çizim modunu kontrol eder
exports.acikModu = function(dragmode) {
    return (
        dragmode === 'drawline' ||
        dragmode === 'drawopenpath'
    );
};

// Dikdörtgen modunu kontrol eder
exports.dikdortgenModu = function(dragmode) {
    return (
        dragmode === 'select' ||
        dragmode === 'drawline' ||
        dragmode === 'drawrect' ||
        dragmode === 'drawcircle'
    );
};

// Serbest çizim modunu kontrol eder
exports.serbestModu = function(dragmode) {
    return (
        dragmode === 'lasso' ||
        dragmode === 'drawclosedpath' ||
        dragmode === 'drawopenpath'
    );
};

// Seçim veya çizim modunu kontrol eder
exports.secimVeyaCizim = function(dragmode) {
    return (
        exports.serbestModu(dragmode) ||
        exports.dikdortgenModu(dragmode)
    );
};
