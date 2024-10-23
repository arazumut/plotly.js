'use strict';

var isNumeric = require('fast-isnumeric');
var toLogRange = require('../../lib/to_log_range');

/*
 * convertCoords: Bir ekseni logaritmik ve doğrusal arasında dönüştürürken,
 * bu eksendeki herhangi bir anotasyonu aynı veri noktasına işaret etmeye devam edecek şekilde değiştirmeniz gerekir.
 * v3.0'da bu işlev gereksiz hale gelecektir.
 *
 * gd: grafik div'i
 * ax: değiştirilen eksen
 * newType: yeni tür
 * doExtra: relayout içinden attribute'u ayarlayan function(attr, val).
 *     Bu değişiklikleri yapmak için kullanın çünkü aynı relayout çağrısındaki diğer değişikliklerin bu dönüşümü geçersiz kılıp kılmayacağını bilir.
 */
module.exports = function convertCoords(gd, ax, newType, doExtra) {
    ax = ax || {};

    var toLog = (newType === 'log') && (ax.type === 'linear');
    var fromLog = (newType === 'linear') && (ax.type === 'log');

    if (!(toLog || fromLog)) return;

    var annotations = gd._fullLayout.annotations;
    var axLetter = ax._id.charAt(0);
    var ann;
    var attrPrefix;

    function convert(attr) {
        var currentVal = ann[attr];
        var newVal = null;

        if (toLog) newVal = toLogRange(currentVal, ax.range);
        else newVal = Math.pow(10, currentVal);

        // dönüşüm başarısız olursa, değeri silin böylece varsayılan bir değer alır
        if (!isNumeric(newVal)) newVal = null;

        doExtra(attrPrefix + attr, newVal);
    }

    for (var i = 0; i < annotations.length; i++) {
        ann = annotations[i];
        attrPrefix = 'annotations[' + i + '].';

        if (ann[axLetter + 'ref'] === ax._id) convert(axLetter);
        if (ann['a' + axLetter + 'ref'] === ax._id) convert('a' + axLetter);
    }
};
