'use strict';

var isNumeric = require('fast-isnumeric');
var toLogRange = require('../../lib/to_log_range');

/*
 * convertCoords: Bir ekseni logaritmik ve doğrusal arasında dönüştürürken,
 * eksendeki herhangi bir görüntüyü aynı veri noktasına işaret etmeye devam edecek şekilde
 * değiştirmeniz gerekir.
 * V3.0'da bu gereksiz hale gelecek (veya belki boyut hala dönüştürme gerektirebilir?)
 * Boyutu, maksimum genişliğin *veri birimleri cinsinden* aynı olması gerektiğini
 * belirterek dönüştürüyoruz, görüntünün merkezi tarafından sabitlendiğini varsayarak
 * (bu kısıtlamayı kaldırabiliriz eğer önemli olduğunu düşünürsek) 
 * ölçek doğrusal olmayan hale geldiğinden gerçek sol ve sağ değerler tam olarak aynı olmayacak
 * (ve merkezi sabitleme, görüntünün piksel merkezini, veri birimleri merkezini değil)
 *
 * gd: grafik divi
 * ax: değiştirilen eksen
 * newType: eksenin alacağı yeni tür
 * doExtra: relayout içinden attribute'u ayarlayan function(attr, val).
 *     Bunu değişiklikleri yapmak için kullanın çünkü aynı relayout çağrısındaki
 *     diğer değişikliklerin bu dönüşümü geçersiz kılıp kılmayacağını bilir.
 */
module.exports = function convertCoords(gd, ax, newType, doExtra) {
    ax = ax || {};

    var toLog = (newType === 'log') && (ax.type === 'linear');
    var fromLog = (newType === 'linear') && (ax.type === 'log');

    if(!(toLog || fromLog)) return;

    var images = gd._fullLayout.images;
    var axLetter = ax._id.charAt(0);
    var image;
    var attrPrefix;

    for(var i = 0; i < images.length; i++) {
        image = images[i];
        attrPrefix = 'images[' + i + '].';

        if(image[axLetter + 'ref'] === ax._id) {
            var currentPos = image[axLetter];
            var currentSize = image['size' + axLetter];
            var newPos = null;
            var newSize = null;

            if(toLog) {
                newPos = toLogRange(currentPos, ax.range);

                // Bu, aşağıdaki fromLog dönüşümünde yaptığımız dönüşümün tersidir
                // böylece dönüşüm tersine çevrilebilir (dikkat edin fromLog dönüşümü
                // sinh gibidir ve bu dönüşüm arcsinh gibidir)
                var dx = currentSize / Math.pow(10, newPos) / 2;
                newSize = 2 * Math.log(dx + Math.sqrt(1 + dx * dx)) / Math.LN10;
            } else {
                newPos = Math.pow(10, currentPos);
                newSize = newPos * (Math.pow(10, currentSize / 2) - Math.pow(10, -currentSize / 2));
            }

            // Eğer dönüşüm başarısız olursa, değeri silin böylece daha sonra varsayılan bir değer alabilir
            if(!isNumeric(newPos)) {
                newPos = null;
                newSize = null;
            } else if(!isNumeric(newSize)) newSize = null;

            doExtra(attrPrefix + axLetter, newPos);
            doExtra(attrPrefix + 'size' + axLetter, newSize);
        }
    }
};
