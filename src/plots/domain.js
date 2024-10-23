'use strict';

var extendFlat = require('../lib/extend').extendFlat;

/**
 * Bir xy domain attribute grubu oluştur
 *
 * @param {object} opts
 *   @param {string}
 *     opts.name: varsayılan açıklamaya eklenecek isim
 *   @param {boolean}
 *     opts.trace: iz konteynerleri için true olarak ayarla
 *   @param {string}
 *     opts.editType: tüm parçalar için editType
 *   @param {boolean}
 *     opts.noGridCell: `row` ve `column`'u atlamak için true olarak ayarla
 *
 * @param {object} extra
 *   @param {string}
 *     extra.description: ekstra açıklama. Not: 
 *     compress_attributes dönüşümü ile uyumlu hale getirmek için ayrı bir ekstra konteyner kullanıyoruz.
 *
 * @return {object} belirtilen {x,y} içeren attribute nesnesi
 */
exports.attributes = function(opts, extra) {
    opts = opts || {};
    extra = extra || {};

    var base = {
        valType: 'info_array',
        editType: opts.editType,
        items: [
            {valType: 'number', min: 0, max: 1, editType: opts.editType},
            {valType: 'number', min: 0, max: 1, editType: opts.editType}
        ],
        dflt: [0, 1]
    };

    var namePart = opts.name ? opts.name + ' ' : '';
    var contPart = opts.trace ? 'iz ' : 'alt grafik ';
    var descPart = extra.description ? ' ' + extra.description : '';

    var out = {
        x: extendFlat({}, base, {
            description: [
                'Bu ' + namePart + contPart + 'nin yatay domainini ayarlar (grafik kesirinde).',
                descPart
            ].join('')
        }),
        y: extendFlat({}, base, {
            description: [
                'Bu ' + namePart + contPart + 'nin dikey domainini ayarlar (grafik kesirinde).',
                descPart
            ].join('')
        }),
        editType: opts.editType
    };

    if(!opts.noGridCell) {
        out.row = {
            valType: 'integer',
            min: 0,
            dflt: 0,
            editType: opts.editType,
            description: [
                'Eğer bir layout grid varsa, bu ' + namePart + contPart + ' için griddeki bu satırın domainini kullan.',
                descPart
            ].join('')
        };
        out.column = {
            valType: 'integer',
            min: 0,
            dflt: 0,
            editType: opts.editType,
            description: [
                'Eğer bir layout grid varsa, bu ' + namePart + contPart + ' için griddeki bu sütunun domainini kullan.',
                descPart
            ].join('')
        };
    }

    return out;
};

exports.defaults = function(containerOut, layout, coerce, dfltDomains) {
    var dfltX = (dfltDomains && dfltDomains.x) || [0, 1];
    var dfltY = (dfltDomains && dfltDomains.y) || [0, 1];

    var grid = layout.grid;
    if(grid) {
        var column = coerce('domain.column');
        if(column !== undefined) {
            if(column < grid.columns) dfltX = grid._domains.x[column];
            else delete containerOut.domain.column;
        }

        var row = coerce('domain.row');
        if(row !== undefined) {
            if(row < grid.rows) dfltY = grid._domains.y[row];
            else delete containerOut.domain.row;
        }
    }

    var x = coerce('domain.x', dfltX);
    var y = coerce('domain.y', dfltY);

    // kötü giriş verilerini kabul etme
    if(!(x[0] < x[1])) containerOut.domain.x = dfltX.slice();
    if(!(y[0] < y[1])) containerOut.domain.y = dfltY.slice();
};
