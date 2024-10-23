'use strict';

/*
 * 'showexponent', 'showtickprefix' ve 'showticksuffix' 
 * özellikleri aynı değerleri paylaşır.
 *
 * Eğer sadece 1 özellik ayarlanmışsa,
 * kalan özellikler bu değeri devralır.
 *
 * Eğer 2 özellik aynı değere ayarlanmışsa,
 * kalan özellik bu değeri devralır.
 *
 * Eğer 2 özellik farklı değerlere ayarlanmışsa,
 * kalan özellik varsayılan değerine ayarlanır.
 *
 */
module.exports = function getShowAttrDflt(containerIn) {
    var tumGosterimOzellikleri = ['showexponent', 'showtickprefix', 'showticksuffix'];
    var gosterimOzellikleri = tumGosterimOzellikleri.filter(function(a) {
        return containerIn[a] !== undefined;
    });
    var ayniDeger = function(a) {
        return containerIn[a] === containerIn[gosterimOzellikleri[0]];
    };

    if(gosterimOzellikleri.every(ayniDeger) || gosterimOzellikleri.length === 1) {
        return containerIn[gosterimOzellikleri[0]];
    }
};
