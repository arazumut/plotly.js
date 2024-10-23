'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var handleSubplotDefaults = require('../subplot_defaults');
var handleArrayContainerDefaults = require('../array_container_defaults');
var layoutAttributes = require('./layout_attributes');

// Layout varsayılanlarını sağla
module.exports = function layoutVarsayilanlariniSagla(layoutIn, layoutOut, fullData) {
    handleSubplotDefaults(layoutIn, layoutOut, fullData, {
        type: 'mapbox',
        attributes: layoutAttributes,
        handleDefaults: varsayilanlariIsle,
        partition: 'y',
        accessToken: layoutOut._mapboxAccessToken
    });
};

// Varsayılanları işle
function varsayilanlariIsle(containerIn, containerOut, coerce, opts) {
    coerce('accesstoken', opts.accessToken);
    coerce('style');
    coerce('center.lon');
    coerce('center.lat');
    coerce('zoom');
    coerce('bearing');
    coerce('pitch');

    var batı = coerce('bounds.west');
    var doğu = coerce('bounds.east');
    var güney = coerce('bounds.south');
    var kuzey = coerce('bounds.north');
    if(
        batı === undefined ||
        doğu === undefined ||
        güney === undefined ||
        kuzey === undefined
    ) {
        delete containerOut.bounds;
    }

    handleArrayContainerDefaults(containerIn, containerOut, {
        name: 'layers',
        handleItemDefaults: katmanVarsayilanlariniIsle
    });

    // 'center' ve 'zoom' değerlerini harita hareketinde güncellemek için giriş konteynerine referans kopyala
    containerOut._input = containerIn;
}

// Katman varsayılanlarını işle
function katmanVarsayilanlariniIsle(layerIn, layerOut) {
    function coerce(attr, dflt) {
        return Lib.coerce(layerIn, layerOut, layoutAttributes.layers, attr, dflt);
    }

    var görünür = coerce('visible');
    if(görünür) {
        var kaynakTipi = coerce('sourcetype');
        var rasterKatmanOlmali = kaynakTipi === 'raster' || kaynakTipi === 'image';

        coerce('source');
        coerce('sourceattribution');

        if(kaynakTipi === 'vector') {
            coerce('sourcelayer');
        }

        if(kaynakTipi === 'image') {
            coerce('coordinates');
        }

        var tipVarsayilan;
        if(rasterKatmanOlmali) tipVarsayilan = 'raster';

        var tip = coerce('type', tipVarsayilan);

        if(rasterKatmanOlmali && tip !== 'raster') {
            tip = layerOut.type = 'raster';
            Lib.log('Kaynak türleri *raster* ve *image* *raster* katman türü çizmelidir.');
        }

        coerce('below');
        coerce('color');
        coerce('opacity');
        coerce('minzoom');
        coerce('maxzoom');

        if(tip === 'circle') {
            coerce('circle.radius');
        }

        if(tip === 'line') {
            coerce('line.width');
            coerce('line.dash');
        }

        if(tip === 'fill') {
            coerce('fill.outlinecolor');
        }

        if(tip === 'symbol') {
            coerce('symbol.icon');
            coerce('symbol.iconsize');

            coerce('symbol.text');
            Lib.coerceFont(coerce, 'symbol.textfont', undefined, {
                noFontVariant: true,
                noFontShadow: true,
                noFontLineposition: true,
                noFontTextcase: true,
            });
            coerce('symbol.textposition');
            coerce('symbol.placement');
        }
    }
}
