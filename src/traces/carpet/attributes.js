'use strict';

// Gerekli modülleri dahil et
var fontAttrs = require('../../plots/font_attributes');
var axisAttrs = require('./axis_attributes');
var colorAttrs = require('../../components/color/attributes');

// Halı grafiği için varsayılan yazı tipi ayarları
var carpetFont = fontAttrs({
    editType: 'calc',
    description: 'Bu halı grafiğindeki eksen ve işaret etiketleri için kullanılan varsayılan yazı tipi'
});

var zorder = require('../scatter/attributes').zorder;

// TODO: Küresel yazı tipinden miras al
carpetFont.family.dflt = '"Open Sans", verdana, arial, sans-serif';
carpetFont.size.dflt = 12;
carpetFont.color.dflt = colorAttrs.defaultLine;

module.exports = {
    carpet: {
        valType: 'string',
        editType: 'calc',
        description: [
            'Bu halı grafiği için bir tanımlayıcı, böylece `scattercarpet` ve',
            '`contourcarpet` izleri, üzerinde bulundukları halı grafiğini belirtebilir'
        ].join(' ')
    },
    x: {
        valType: 'data_array',
        editType: 'calc+clearAxisTypes',
        description: [
            'Her halı noktadaki x koordinatlarının iki boyutlu bir dizisi.',
            'Eğer belirtilmezse, grafik bir hile grafiği olur ve x ekseni varsayılan olarak gizlenir.'
        ].join(' ')
    },
    y: {
        valType: 'data_array',
        editType: 'calc+clearAxisTypes',
        description: 'Her halı noktadaki y koordinatlarının iki boyutlu bir dizisi.'
    },
    a: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'İlk parametre değerlerinin bulunduğu bir dizi'
        ].join(' ')
    },
    a0: {
        valType: 'number',
        dflt: 0,
        editType: 'calc',
        description: [
            '`a` alternatifi.',
            'Bir a koordinatlarının doğrusal bir alanını oluşturur.',
            '`da` ile birlikte kullanın',
            'burada `a0` başlangıç koordinatı ve `da` adımdır.'
        ].join(' ')
    },
    da: {
        valType: 'number',
        dflt: 1,
        editType: 'calc',
        description: [
            'a koordinat adımını ayarlar.',
            'Daha fazla bilgi için `a0` a bakın.'
        ].join(' ')
    },
    b: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Her halı noktadaki y koordinatlarının iki boyutlu bir dizisi.'
    },
    b0: {
        valType: 'number',
        dflt: 0,
        editType: 'calc',
        description: [
            '`b` alternatifi.',
            'Bir b koordinatlarının doğrusal bir alanını oluşturur.',
            '`db` ile birlikte kullanın',
            'burada `b0` başlangıç koordinatı ve `db` adımdır.'
        ].join(' ')
    },
    db: {
        valType: 'number',
        dflt: 1,
        editType: 'calc',
        description: [
            'b koordinat adımını ayarlar.',
            'Daha fazla bilgi için `b0` a bakın.'
        ].join(' ')
    },
    cheaterslope: {
        valType: 'number',
        dflt: 1,
        editType: 'calc',
        description: [
            'Bir hile grafiği oluştururken verilerin her ardışık satırına uygulanan kayma.',
            'Sadece `x` belirtilmemişse kullanılır.'
        ].join(' ')
    },
    aaxis: axisAttrs,
    baxis: axisAttrs,
    font: carpetFont,
    color: {
        valType: 'color',
        dflt: colorAttrs.defaultLine,
        editType: 'plot',
        description: [
            'Bu eksenle ilişkili tüm renkler için varsayılan ayarları belirler',
            'hepsi bir arada: çizgi, yazı tipi, işaret ve ızgara renkleri.',
            'Izgara rengi, bu rengi grafik arka planıyla harmanlayarak hafifletilir.',
            'Bireysel parçalar bunu geçersiz kılabilir.'
        ].join(' ')
    },
    transforms: undefined,
    zorder: zorder
};
