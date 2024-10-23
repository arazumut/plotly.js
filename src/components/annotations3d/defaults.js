'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');
var handleArrayContainerDefaults = require('../../plots/array_container_defaults');
var handleAnnotationCommonDefaults = require('../annotations/common_defaults');
var attributes = require('./attributes');

// Varsayılanları işlemek için ana fonksiyon
module.exports = function handleDefaults(sceneLayoutIn, sceneLayoutOut, opts) {
    handleArrayContainerDefaults(sceneLayoutIn, sceneLayoutOut, {
        name: 'annotations', // Adı 'annotations' olan dizi konteynerini işle
        handleItemDefaults: handleAnnotationDefaults, // Her bir öğenin varsayılanlarını işle
        fullLayout: opts.fullLayout // Tam düzeni belirt
    });
};

// Her bir anotasyonun varsayılanlarını işleyen fonksiyon
function handleAnnotationDefaults(annIn, annOut, sceneLayout, opts) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function coerce(attr, dflt) {
        return Lib.coerce(annIn, annOut, attributes, attr, dflt);
    }

    // Pozisyonu zorlayan fonksiyon
    function coercePosition(axLetter) {
        var axName = axLetter + 'axis';

        // Doğru 3D ekseni almak için sahte bir nesne oluştur
        var gdMock = { _fullLayout: {} };
        gdMock._fullLayout[axName] = sceneLayout[axName];

        return Axes.coercePosition(annOut, gdMock, coerce, axLetter, axLetter, 0.5);
    }

    // Görünürlüğü zorla
    var visible = coerce('visible');
    if(!visible) return;

    // Ortak anotasyon varsayılanlarını işle
    handleAnnotationCommonDefaults(annIn, annOut, opts.fullLayout, coerce);

    // X, Y ve Z pozisyonlarını zorla
    coercePosition('x');
    coercePosition('y');
    coercePosition('z');

    // Eğer bir koordinat varsa, hepsinin olması gerektiğini kontrol et
    Lib.noneOrAll(annIn, annOut, ['x', 'y', 'z']);

    // Tamamlayıcılık için burada zorla
    annOut.xref = 'x';
    annOut.yref = 'y';
    annOut.zref = 'z';

    // Diğer özellikleri zorla
    coerce('xanchor');
    coerce('yanchor');
    coerce('xshift');
    coerce('yshift');

    // Eğer ok gösteriliyorsa, ok referanslarını ve uzunluklarını zorla
    if(annOut.showarrow) {
        annOut.axref = 'pixel';
        annOut.ayref = 'pixel';

        // TODO: Belki varsayılan değerler 2D durumundan daha büyük olmalı?
        coerce('ax', -10);
        coerce('ay', -30);

        // Eğer ok uzunluğunun bir kısmı varsa, her iki kısmının da olması gerektiğini kontrol et
        Lib.noneOrAll(annIn, annOut, ['ax', 'ay']);
    }
}
