'use strict';

module.exports = function olayVerisi(out, pt) {
    // Not: hoverOnBox özelliği, bir kutunun tıklanmasını
    // yok saymak için click-to-select özelliği için gereklidir.
    // Bu nedenle kutu, bu özel olayVerisi fonksiyonunu uygular.
    if(pt.hoverOnBox) out.hoverOnBox = pt.hoverOnBox;

    if('xVal' in pt) out.x = pt.xVal;
    if('yVal' in pt) out.y = pt.yVal;
    if(pt.xa) out.xEkseni = pt.xa;
    if(pt.ya) out.yEkseni = pt.ya;

    return out;
};
