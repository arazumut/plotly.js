'use strict';

// daha fazla bilgi: http://stackoverflow.com/questions/18531624/isplainobject-thing
module.exports = function isPlainObject(obj) {
    // Asenkron görüntü isteklerinin nasıl ele alındığı nedeniyle
    // `imagetest` konteynerinde biraz daha az katı olmamız gerekiyor.
    //
    // NOT: `imagetest` içinde isPlainObject(new Constructor()) true dönecektir
    if (window && window.process && window.process.versions) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    return (
        Object.prototype.toString.call(obj) === '[object Object]' &&
        Object.getPrototypeOf(obj).hasOwnProperty('hasOwnProperty')
    );
};
