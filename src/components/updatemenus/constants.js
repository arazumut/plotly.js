'use strict';

module.exports = {

    // layout attribute name
    // Düzen özniteliği adı
    name: 'güncellemeMenüleri',

    // class names
    // sınıf adları
    containerClassName: 'güncellemeMenüsü-konteyner',
    headerGroupClassName: 'güncellemeMenüsü-başlık-grubu',
    headerClassName: 'güncellemeMenüsü-başlık',
    headerArrowClassName: 'güncellemeMenüsü-başlık-ok',
    dropdownButtonGroupClassName: 'güncellemeMenüsü-açılır-düğme-grubu',
    dropdownButtonClassName: 'güncellemeMenüsü-açılır-düğme',
    buttonClassName: 'güncellemeMenüsü-düğme',
    itemRectClassName: 'güncellemeMenüsü-öğe-dikdörtgen',
    itemTextClassName: 'güncellemeMenüsü-öğe-metin',

    // DOM attribute name in button group keeping track
    // of active update menu
    // Etkin güncelleme menüsünü takip eden düğme grubundaki DOM özniteliği adı
    menuIndexAttrName: 'güncellemeMenüsü-aktif-indeks',

    // id root pass to Plots.autoMargin
    // Plots.autoMargin'e geçirilen id kökü
    autoMarginIdRoot: 'güncellemeMenüsü-',

    // options when 'active: -1'
    // 'active: -1' olduğunda seçenekler
    blankHeaderOpts: { label: '  ' },

    // min item width / height
    // minimum öğe genişliği / yüksekliği
    minWidth: 30,
    minHeight: 30,

    // padding around item text
    // öğe metni etrafındaki dolgu
    textPadX: 24,
    arrowPadX: 16,

    // item rect radii
    // öğe dikdörtgen yarıçapları
    rx: 2,
    ry: 2,

    // item text x offset off left edge
    // öğe metni sol kenardan x ofseti
    textOffsetX: 12,

    // item text y offset (w.r.t. middle)
    // öğe metni y ofseti (orta ile ilgili)
    textOffsetY: 3,

    // arrow offset off right edge
    // ok sağ kenardan ofseti
    arrowOffsetX: 4,

    // gap between header and buttons
    // başlık ve düğmeler arasındaki boşluk
    gapButtonHeader: 5,

    // gap between between buttons
    // düğmeler arasındaki boşluk
    gapButton: 2,

    // color given to active buttons
    // etkin düğmelere verilen renk
    activeColor: '#F4FAFF',

    // color given to hovered buttons
    // üzerine gelinen düğmelere verilen renk
    hoverColor: '#F4FAFF',

    // symbol for menu open arrow
    // menü açma oku için sembol
    arrowSymbol: {
        left: '◄',
        right: '►',
        up: '▲',
        down: '▼'
    }
};
