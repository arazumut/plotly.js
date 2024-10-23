'use strict';

module.exports = {

    // layout attribute name
    // düzen yerleşim adı
    name: 'sliders',

    // class names
    // sınıf isimleri
    containerClassName: 'slider-container',
    groupClassName: 'slider-group',
    inputAreaClass: 'slider-input-area',
    railRectClass: 'slider-rail-rect',
    railTouchRectClass: 'slider-rail-touch-rect',
    gripRectClass: 'slider-grip-rect',
    tickRectClass: 'slider-tick-rect',
    inputProxyClass: 'slider-input-proxy',
    labelsClass: 'slider-labels',
    labelGroupClass: 'slider-label-group',
    labelClass: 'slider-label',
    currentValueClass: 'slider-current-value',

    // ray yüksekliği
    railHeight: 5,

    // DOM attribute name in button group keeping track
    // of active update menu
    // aktif güncelleme menüsünü takip eden düğme grubunda DOM öznitelik adı
    menuIndexAttrName: 'slider-active-index',

    // id root pass to Plots.autoMargin
    // Plots.autoMargin'e geçilen id kökü
    autoMarginIdRoot: 'slider-',

    // min item width / height
    // minimum öğe genişliği / yüksekliği
    minWidth: 30,
    minHeight: 30,

    // padding around item text
    // öğe metni etrafındaki dolgu
    textPadX: 40,

    // arrow offset off right edge
    // sağ kenardan ok kayması
    arrowOffsetX: 4,

    // ray yarıçapı
    railRadius: 2,
    // ray genişliği
    railWidth: 5,
    // ray kenarlığı
    railBorder: 4,
    // ray kenarlık genişliği
    railBorderWidth: 1,
    // ray kenarlık rengi
    railBorderColor: '#bec8d9',
    // ray arka plan rengi
    railBgColor: '#f8fafc',

    // The distance of the rail from the edge of the touchable area
    // Slightly less than the step inset because of the curved edges
    // of the rail
    // Rayın dokunulabilir alanın kenarından uzaklığı
    // Rayın kavisli kenarları nedeniyle adım iç kısmından biraz daha az
    railInset: 8,

    // The distance from the extremal tick marks to the edge of the
    // touchable area. This is basically the same as the grip radius,
    // but for other styles it wouldn't really need to be.
    // Uç işaretlerden dokunulabilir alanın kenarına olan mesafe.
    // Bu, temel olarak tutma yarıçapı ile aynıdır, ancak diğer stiller için
    // gerçekten gerekli olmayabilir.
    stepInset: 10,

    // tutma yarıçapı
    gripRadius: 10,
    // tutma genişliği
    gripWidth: 20,
    // tutma yüksekliği
    gripHeight: 20,
    // tutma kenarlığı
    gripBorder: 20,
    // tutma kenarlık genişliği
    gripBorderWidth: 1,
    // tutma kenarlık rengi
    gripBorderColor: '#bec8d9',
    // tutma arka plan rengi
    gripBgColor: '#f6f8fa',
    // aktif tutma arka plan rengi
    gripBgActiveColor: '#dbdde0',

    // etiket dolgusu
    labelPadding: 8,
    // etiket kayması
    labelOffset: 0,

    // işaret genişliği
    tickWidth: 1,
    // işaret rengi
    tickColor: '#333',
    // işaret kayması
    tickOffset: 25,
    // işaret uzunluğu
    tickLength: 7,

    // küçük işaret kayması
    minorTickOffset: 25,
    // küçük işaret rengi
    minorTickColor: '#333',
    // küçük işaret uzunluğu
    minorTickLength: 4,

    // Extra space below the current value label:
    // Mevcut değer etiketinin altındaki ekstra alan:
    currentValuePadding: 8,
    // Mevcut değer iç kısmı
    currentValueInset: 0,
};
