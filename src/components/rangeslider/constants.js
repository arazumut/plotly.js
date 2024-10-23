'use strict';

module.exports = {

    // öznitelik konteyner adı
    name: 'aralık kaydırıcı',

    // sınıf adları

    containerClassName: 'aralık-kaydırıcı-konteyner',
    bgClassName: 'aralık-kaydırıcı-arka-plan',
    rangePlotClassName: 'aralık-kaydırıcı-aralık-grafiği',

    maskMinClassName: 'aralık-kaydırıcı-maske-min',
    maskMaxClassName: 'aralık-kaydırıcı-maske-max',
    slideBoxClassName: 'aralık-kaydırıcı-kaydırma-kutusu',

    grabberMinClassName: 'aralık-kaydırıcı-tutucu-min',
    grabAreaMinClassName: 'aralık-kaydırıcı-tutma-alanı-min',
    handleMinClassName: 'aralık-kaydırıcı-tutma-yeri-min',

    grabberMaxClassName: 'aralık-kaydırıcı-tutucu-max',
    grabAreaMaxClassName: 'aralık-kaydırıcı-tutma-alanı-max',
    handleMaxClassName: 'aralık-kaydırıcı-tutma-yeri-max',

    maskMinOppAxisClassName: 'aralık-kaydırıcı-maske-min-ters-eksen',
    maskMaxOppAxisClassName: 'aralık-kaydırıcı-maske-max-ters-eksen',

    // stil sabitleri

    maskColor: 'rgba(0,0,0,0.4)',
    maskOppAxisColor: 'rgba(0,0,0,0.2)',

    slideBoxFill: 'şeffaf',
    slideBoxCursor: 'ew-resize',

    grabAreaFill: 'şeffaf',
    grabAreaCursor: 'col-resize',
    grabAreaWidth: 10,

    handleWidth: 4,
    handleRadius: 1,
    handleStrokeWidth: 1,

    extraPad: 15
};
