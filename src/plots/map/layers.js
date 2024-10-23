'use strict';

var Lib = require('../../lib');
var sanitizeHTML = require('../../lib/svg_text_utils').sanitizeHTML;
var convertTextOpts = require('./convert_text_opts');
var constants = require('./constants');

function HaritaKatmanı(subplot, index) {
    this.subplot = subplot;

    this.uid = subplot.uid + '-' + index;
    this.index = index;

    this.idKaynak = 'kaynak-' + this.uid;
    this.idKatman = constants.layoutLayerPrefix + this.uid;

    // Bir kaldırma/ekleme adımının gerekli olup olmadığını kontrol etmek için bazı durum değişkenleri
    this.kaynakTipi = null;
    this.kaynak = null;
    this.katmanTipi = null;
    this.altında = null;

    // Katman şu anda görünür mü
    this.görünür = false;
}

var proto = HaritaKatmanı.prototype;

proto.güncelle = function güncelle(opts) {
    if(!this.görünür) {
        // ÖNEMLİ: Hatalara neden olmamak için katmandan önce kaynak oluşturulmalıdır
        this.kaynakGüncelle(opts);
        this.katmanGüncelle(opts);
    } else if(this.yeniResimGerekli(opts)) {
        this.resimGüncelle(opts);
    } else if(this.yeniKaynakGerekli(opts)) {
        // ÖNEMLİ: Hatalara neden olmamak için kaynaktan önce katman silinmelidir
        this.katmanKaldır();
        this.kaynakGüncelle(opts);
        this.katmanGüncelle(opts);
    } else if(this.yeniKatmanGerekli(opts)) {
        this.katmanGüncelle(opts);
    } else {
        this.stilGüncelle(opts);
    }

    this.görünür = görünürMü(opts);
};

proto.yeniResimGerekli = function(opts) {
    var harita = this.subplot.map;
    return (
        harita.getSource(this.idKaynak) &&
        this.kaynakTipi === 'image' &&
        opts.kaynakTipi === 'image' &&
        (this.kaynak !== opts.kaynak ||
            JSON.stringify(this.koordinatlar) !==
            JSON.stringify(opts.koordinatlar))
    );
};

proto.yeniKaynakGerekli = function(opts) {
    return (
        this.kaynakTipi !== opts.kaynakTipi ||
        JSON.stringify(this.kaynak) !== JSON.stringify(opts.kaynak) ||
        this.katmanTipi !== opts.tip
    );
};

proto.yeniKatmanGerekli = function(opts) {
    return (
        this.katmanTipi !== opts.tip ||
        this.altında !== this.subplot.altındaLookup['layout-' + this.index]
    );
};

proto.altındaLookup = function() {
    return this.subplot.altındaLookup['layout-' + this.index];
};

proto.resimGüncelle = function(opts) {
    var harita = this.subplot.map;
    harita.getSource(this.idKaynak).updateImage({
        url: opts.kaynak, coordinates: opts.koordinatlar
    });

    var _altında = this.sonrakiHaritaKatmanıIdBul(this.altındaLookup());
    if(_altında !== null) {
        this.subplot.map.moveLayer(this.idKatman, _altında);
    }
};

proto.kaynakGüncelle = function(opts) {
    var harita = this.subplot.map;

    if(harita.getSource(this.idKaynak)) harita.removeSource(this.idKaynak);

    this.kaynakTipi = opts.kaynakTipi;
    this.kaynak = opts.kaynak;

    if(!görünürMü(opts)) return;

    var kaynakOpts = kaynakOptsDönüştür(opts);

    harita.addSource(this.idKaynak, kaynakOpts);
};

proto.sonrakiHaritaKatmanıIdBul = function(altında) {
    if(altında === 'izler') {
        var haritaKatmanları = this.subplot.getMapLayers();

        for(var i = 0; i < haritaKatmanları.length; i++) {
            var katmanId = haritaKatmanları[i].id;
            if(typeof katmanId === 'string' &&
                katmanId.indexOf(constants.traceLayerPrefix) === 0
            ) {
                altında = katmanId;
                break;
            }
        }
    }
    return altında;
};

proto.katmanGüncelle = function(opts) {
    var subplot = this.subplot;
    var dönüştürülmüşOpts = optsDönüştür(opts);
    var altında = this.altındaLookup();
    var _altında = this.sonrakiHaritaKatmanıIdBul(altında);

    this.katmanKaldır();

    if(görünürMü(opts)) {
        subplot.addLayer({
            id: this.idKatman,
            source: this.idKaynak,
            'source-layer': opts.kaynakKatmanı || '',
            type: opts.tip,
            minzoom: opts.minzoom,
            maxzoom: opts.maxzoom,
            layout: dönüştürülmüşOpts.layout,
            paint: dönüştürülmüşOpts.paint
        }, _altında);
    }

    this.katmanTipi = opts.tip;
    this.altında = altında;
};

proto.stilGüncelle = function(opts) {
    if(görünürMü(opts)) {
        var dönüştürülmüşOpts = optsDönüştür(opts);
        this.subplot.setOptions(this.idKatman, 'setLayoutProperty', dönüştürülmüşOpts.layout);
        this.subplot.setOptions(this.idKatman, 'setPaintProperty', dönüştürülmüşOpts.paint);
    }
};

proto.katmanKaldır = function() {
    var harita = this.subplot.map;
    if(harita.getLayer(this.idKatman)) {
        harita.removeLayer(this.idKatman);
    }
};

proto.dispose = function() {
    var harita = this.subplot.map;
    if(harita.getLayer(this.idKatman)) harita.removeLayer(this.idKatman);
    if(harita.getSource(this.idKaynak)) harita.removeSource(this.idKaynak);
};

function görünürMü(opts) {
    if(!opts.görünür) return false;

    var kaynak = opts.kaynak;

    if(Array.isArray(kaynak) && kaynak.length > 0) {
        for(var i = 0; i < kaynak.length; i++) {
            if(typeof kaynak[i] !== 'string' || kaynak[i].length === 0) {
                return false;
            }
        }
        return true;
    }

    return Lib.isPlainObject(kaynak) ||
        (typeof kaynak === 'string' && kaynak.length > 0);
}

function optsDönüştür(opts) {
    var layout = {};
    var paint = {};

    switch(opts.tip) {
        case 'circle':
            Lib.extendFlat(paint, {
                'circle-radius': opts.circle.radius,
                'circle-color': opts.renk,
                'circle-opacity': opts.opacity
            });
            break;

        case 'line':
            Lib.extendFlat(paint, {
                'line-width': opts.line.width,
                'line-color': opts.renk,
                'line-opacity': opts.opacity,
                'line-dasharray': opts.line.dash
            });
            break;

        case 'fill':
            Lib.extendFlat(paint, {
                'fill-color': opts.renk,
                'fill-outline-color': opts.fill.outlinecolor,
                'fill-opacity': opts.opacity
            });
            break;

        case 'symbol':
            var symbol = opts.symbol;
            var textOpts = convertTextOpts(symbol.textposition, symbol.iconsize);

            Lib.extendFlat(layout, {
                'icon-image': symbol.icon + '-15',
                'icon-size': symbol.iconsize / 10,

                'text-field': symbol.text,
                'text-size': symbol.textfont.size,
                'text-anchor': textOpts.anchor,
                'text-offset': textOpts.offset,
                'symbol-placement': symbol.placement
            });

            Lib.extendFlat(paint, {
                'icon-color': opts.renk,
                'text-color': symbol.textfont.color,
                'text-opacity': opts.opacity
            });
            break;
        case 'raster':
            Lib.extendFlat(paint, {
                'raster-fade-duration': 0,
                'raster-opacity': opts.opacity
            });
            break;
    }

    return {
        layout: layout,
        paint: paint
    };
}

function kaynakOptsDönüştür(opts) {
    var kaynakTipi = opts.kaynakTipi;
    var kaynak = opts.kaynak;
    var kaynakOpts = {type: kaynakTipi};
    var alan;

    if(kaynakTipi === 'geojson') {
        alan = 'data';
    } else if(kaynakTipi === 'vector') {
        alan = typeof kaynak === 'string' ? 'url' : 'tiles';
    } else if(kaynakTipi === 'raster') {
        alan = 'tiles';
        kaynakOpts.tileSize = 256;
    } else if(kaynakTipi === 'image') {
        alan = 'url';
        kaynakOpts.coordinates = opts.koordinatlar;
    }

    kaynakOpts[alan] = kaynak;

    if(opts.kaynakAtıf) {
        kaynakOpts.attribution = sanitizeHTML(opts.kaynakAtıf);
    }

    return kaynakOpts;
}

module.exports = function haritaKatmanıOluştur(subplot, index, opts) {
    var haritaKatmanı = new HaritaKatmanı(subplot, index);

    haritaKatmanı.güncelle(opts);

    return haritaKatmanı;
};
